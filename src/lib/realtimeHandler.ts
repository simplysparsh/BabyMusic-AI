import type { RealtimeChannel, SupabaseClient } from '@supabase/supabase-js';

import { REALTIME_SUBSCRIBE_STATES } from '@supabase/realtime-js';

export type Topic = string;

export type ChannelFactory<T extends SupabaseClient = SupabaseClient> = (
	supabase: T
) => RealtimeChannel;

export type RealtimeChannelFactories<T extends SupabaseClient = SupabaseClient> = Map<
	Topic,
	ChannelFactory<T>
>;

export type RealtimeChannels = Map<Topic, RealtimeChannel>;

export type RealtimeHandlerConfig = {
	/** The number of milliseconds to wait before disconnecting from realtime when the document is not visible.
	 * Default is 10 minutes.
	 */
	inactiveTabTimeoutSeconds: number;
};

export type SubscriptionEventCallbacks = {
	onSubscribe?: (channel: RealtimeChannel) => void;
	onClose?: (channel: RealtimeChannel) => void;
	onTimeout?: (channel: RealtimeChannel) => void;
	onError?: (channel: RealtimeChannel, err: Error) => void;
};

export type SubscriptionEventCallbacksMap = Map<Topic, SubscriptionEventCallbacks>;

/**
 * Handles realtime subscriptions to multiple channels.
 *
 * Factories are used rather than channels themselves to allow for re-creation of channels when needed
 * to do a proper reconnection after an error or timeout.
 */
export class RealtimeHandler<T extends SupabaseClient> {
	private inactiveTabTimeoutSeconds = 10 * 60;

	private supabaseClient: T;

	private channelFactories: RealtimeChannelFactories<T> = new Map();
	private channels: RealtimeChannels = new Map();

	private subscriptionEventCallbacks: SubscriptionEventCallbacksMap = new Map();

	/** Timer reference used to disconnect when tab is inactive. */
	private inactiveTabTimer: ReturnType<typeof setTimeout> | undefined;

	/** Flag to indicate if the handler has been started. */
	private started = false;

	public constructor(supabaseClient: T, config?: RealtimeHandlerConfig) {
		this.supabaseClient = supabaseClient;
		if (config?.inactiveTabTimeoutSeconds) {
			this.inactiveTabTimeoutSeconds = config.inactiveTabTimeoutSeconds;
		}
	}

	/**
	 * Adds a new channel using the provided channel factory and, optionally, subscription event callbacks.
	 *
	 * @param channelFactory - A factory function responsible for creating the channel.
	 * @param subscriptionEventCallbacks - Optional callbacks for handling subscription-related events.
	 *
	 * @returns A function that, when executed, removes the channel. Use this for cleanup.
	 */
	public addChannel(
		channelFactory: ChannelFactory<T>,
		subscriptionEventCallbacks?: SubscriptionEventCallbacks
	) {
		const channel = this.createChannel(channelFactory);

		if (this.channelFactories.has(channel.topic)) {
			console.warn(`Overwriting existing channel factory for topic: ${channel.topic}`);
			this.unsubscribeFromChannel(channel.topic);
		}
		this.channelFactories.set(channel.topic, channelFactory);

		if (subscriptionEventCallbacks) {
			this.subscriptionEventCallbacks.set(channel.topic, subscriptionEventCallbacks);
		}

		if (this.started) {
			// No reason to await, as it's all event-driven.
			this.subscribeToChannel(channel);
		}

		return () => {
			this.removeChannel(channel.topic);
		};
	}

	/**
	 * Removes and unsubscribes the channel associated with the given topic.
	 */
	public removeChannel(topic: Topic) {
		if (!topic.startsWith('realtime:')) {
			// If not prefixed, the user passed in the `subTopic`.
			topic = `realtime:${topic}`;
		}
		this.channelFactories.delete(topic);
		this.unsubscribeFromChannel(topic);
	}

	/**
	 * Starts the realtime event handling process.
	 *
	 * @returns A cleanup function that stops realtime event handling by removing the visibility change listener
	 *          and unsubscribing from all channels.
	 */
	public start() {
		if (this.started) {
			console.debug('RealtimeHandler already started (likely React StrictMode). Returning no-op cleanup.');
			return () => {};
		}

		const removeVisibilityChangeListener = this.addOnVisibilityChangeListener();

		this.subscribeToAllCreatedChannels();

		this.started = true;

		return () => {
			// cleanup
			removeVisibilityChangeListener();
			this.unsubscribeFromAllChannels();
		};
	}

	/* -----------------------------------------------------------
	   Private / Internal Methods
	----------------------------------------------------------- */

	/**
	 * Recreates the channel for the specified topic.
	 */
	private createChannel(channelFactory: ChannelFactory<T>) {
		const channel = channelFactory(this.supabaseClient);
		this.channels.set(channel.topic, channel);
		return channel;
	}

	/**
	 * Subscribes to a single channel.
	 */
	private async subscribeToChannel(channel: RealtimeChannel) {
		if (channel.state === 'joined' || channel.state === 'joining') {
			console.debug(`Channel '${channel.topic}' is already joined or joining. Skipping subscribe.`);
			return;
		}

		await this.refreshSessionIfNeeded();

		channel.subscribe(async (status, err) => {
			await this.handleSubscriptionStateEvent(channel, status, err);
		});
	}

	private subscribeToAllCreatedChannels() {
		for (const channel of this.channels.values()) {
			if (channel) {
				this.subscribeToChannel(channel);
			}
		}
	}

	private resubscribeToAllChannels() {
		for (const topic of this.channelFactories.keys()) {
			if (!this.channels.get(topic)) {
				this.resubscribeToChannel(topic);
			}
		}
	}

	/**
	 * Recreates and subscribes to the realtime channel for the given topic.
	 */
	private resubscribeToChannel(topic: Topic) {
		const channelFactory = this.channelFactories.get(topic);
		if (!channelFactory) {
			throw new Error(`Channel factory not found for topic: ${topic}`);
		}
		const channel = this.createChannel(channelFactory);
		this.subscribeToChannel(channel);
	}

	private unsubscribeFromChannel(topic: Topic) {
		const channel = this.channels.get(topic);
		if (channel) {
			this.supabaseClient.removeChannel(channel);
			this.channels.delete(topic);
		}
	}

	private unsubscribeFromAllChannels() {
		for (const topic of this.channels.keys()) {
			this.unsubscribeFromChannel(topic);
		}
	}

	private async handleSubscriptionStateEvent(
		channel: RealtimeChannel,
		status: REALTIME_SUBSCRIBE_STATES,
		err: Error | undefined
	) {
		const { topic } = channel;

		switch (status) {
			case REALTIME_SUBSCRIBE_STATES.SUBSCRIBED: {
				console.debug(`Successfully subscribed to '${topic}'`);
				const subscriptionEventCallbacks = this.subscriptionEventCallbacks.get(topic);
				if (subscriptionEventCallbacks?.onSubscribe) {
					subscriptionEventCallbacks.onSubscribe(channel);
				}
				break;
			}
			case REALTIME_SUBSCRIBE_STATES.CLOSED: {
				console.debug(`Channel closed '${topic}'`);
				const subscriptionEventCallbacks = this.subscriptionEventCallbacks.get(topic);
				if (subscriptionEventCallbacks?.onClose) {
					subscriptionEventCallbacks.onClose(channel);
				}
				break;
			}
			case REALTIME_SUBSCRIBE_STATES.TIMED_OUT: {
				console.debug(`Channel timed out '${topic}'`);
				const subscriptionEventCallbacks = this.subscriptionEventCallbacks.get(topic);
				if (subscriptionEventCallbacks?.onTimeout) {
					subscriptionEventCallbacks.onTimeout(channel);
				}
				
				// Auto-reconnect after timeout unless tab is hidden
				if (!document.hidden) {
					console.debug(`Auto-reconnecting timed out channel '${topic}'`);
					// Small delay before reconnecting to avoid immediate retimeout
					setTimeout(() => {
						try {
							this.resubscribeToChannel(topic);
						} catch (error) {
							console.warn(`Failed to auto-reconnect timed out channel '${topic}':`, error);
						}
					}, 2000); // 2 second delay
				}
				break;
			}
			case REALTIME_SUBSCRIBE_STATES.CHANNEL_ERROR: {
				// We'll just reconnect when the tab becomes visible again.
				// if the tab is hidden, we don't really care about reconnection
				if (document.hidden) {
					console.debug(`Channel error in '${topic}', but tab is hidden. Removing channel.`);
					await this.supabaseClient.removeChannel(channel);
					return;
				} else if (err && isTokenExpiredError(err)) {
					console.debug(`Token expired causing channel error in '${topic}'. Refreshing session.`);
					this.resubscribeToChannel(topic);
				} else {
					console.warn(`Channel error in '${topic}': `, err?.message);
				}
				const subscriptionEventCallbacks = this.subscriptionEventCallbacks.get(topic);
				if (subscriptionEventCallbacks?.onError) {
					subscriptionEventCallbacks.onError(channel, err!);
				}
				break;
			}
			default: {
				const exhaustiveCheck: never = status;
				throw new Error(`Unknown channel status: ${exhaustiveCheck}`);
			}
		}
	}

	/**
	 * Refreshes the session token if needed and sets the token for Supabase Realtime.
	 */
	private async refreshSessionIfNeeded() {
		const { data, error } = await this.supabaseClient.auth.getSession();
		if (error) {
			throw error;
		}
		if (!data.session) {
			throw new Error('Session not found');
		}
		if (this.supabaseClient.realtime.accessTokenValue !== data.session.access_token) {
			await this.supabaseClient.realtime.setAuth(data.session.access_token);
		}
	}

	private addOnVisibilityChangeListener() {
		const handler = () => this.handleVisibilityChange();
		document.addEventListener('visibilitychange', handler);

		return () => {
			document.removeEventListener('visibilitychange', handler);
		};
	}

	private handleVisibilityChange() {
		if (document.hidden) {
			if (!this.inactiveTabTimer) {
				this.inactiveTabTimer = setTimeout(async () => {
					console.log(
						`Tab inactive for ${this.inactiveTabTimeoutSeconds} seconds. Disconnecting from realtime.`
					);
					this.unsubscribeFromAllChannels();
				}, this.inactiveTabTimeoutSeconds * 1000);
			}
		} else {
			if (this.inactiveTabTimer) {
				clearTimeout(this.inactiveTabTimer);
				this.inactiveTabTimer = undefined;
			}

			this.resubscribeToAllChannels();
		}
	}
}

/**
 * Determines if the provided error relates to an expired token.
 */
const isTokenExpiredError = (err: Error) => {
	// For some reason, message has sometimes been undefined. Adding a ? just in case.
	return err.message?.startsWith('"Token has expired');
}; 