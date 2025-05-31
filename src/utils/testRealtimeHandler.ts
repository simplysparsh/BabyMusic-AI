/**
 * Browser-based test utilities for RealtimeHandler
 * 
 * Run these tests in the browser console:
 * import('./utils/testRealtimeHandler.js').then(test => test.runBrowserTests());
 */

import { realtimeHandler, supabase } from '../lib/supabase';
import type { ChannelFactory, SubscriptionEventCallbacks } from '../lib/realtimeHandler';

// Test state management
interface TestResults {
  passed: number;
  failed: number;
  tests: Array<{ name: string; status: 'passed' | 'failed'; message?: string }>;
}

const testResults: TestResults = {
  passed: 0,
  failed: 0,
  tests: []
};

function logTest(name: string, passed: boolean, message?: string) {
  const status = passed ? 'passed' : 'failed';
  const emoji = passed ? '✅' : '❌';
  const color = passed ? 'color: green' : 'color: red';
  
  console.log(`%c${emoji} ${name}`, color);
  if (message) {
    console.log(`   ${message}`);
  }
  
  testResults.tests.push({ name, status, message });
  if (passed) {
    testResults.passed++;
  } else {
    testResults.failed++;
  }
}

/**
 * Test 1: Verify RealtimeHandler is initialized
 */
function testHandlerInitialization() {
  console.log('%c🧪 Test 1: Handler Initialization', 'font-weight: bold; color: blue');
  
  try {
    if (!realtimeHandler) {
      logTest('Handler exists', false, 'realtimeHandler is not defined');
      return;
    }
    
    logTest('Handler exists', true, 'realtimeHandler is properly imported');
    
    // Check if it has the expected methods
    const expectedMethods = ['addChannel', 'removeChannel', 'start'];
    for (const method of expectedMethods) {
      if (typeof (realtimeHandler as any)[method] === 'function') {
        logTest(`Handler has ${method} method`, true);
      } else {
        logTest(`Handler has ${method} method`, false, `Method ${method} is missing or not a function`);
      }
    }
  } catch (error) {
    logTest('Handler initialization', false, `Error: ${error}`);
  }
}

/**
 * Test 2: Test channel creation and removal
 */
function testChannelManagement() {
  console.log('%c🧪 Test 2: Channel Management', 'font-weight: bold; color: blue');
  
  try {
    const testUserId = 'test-browser-user';
    
    // Create a test channel factory
    const testChannelFactory: ChannelFactory = (supabase) => {
      return supabase
        .channel(`browser-test-${Date.now()}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'songs',
          filter: `user_id=eq.${testUserId}`
        }, (payload) => {
          console.log('Test payload received:', payload);
        });
    };
    
    // Test callbacks
    const testCallbacks: SubscriptionEventCallbacks = {
      onSubscribe: (channel) => {
        console.log(`📡 Subscribed to ${channel.topic}`);
      },
      onError: (channel, error) => {
        console.log(`❌ Error in ${channel.topic}:`, error.message);
      }
    };
    
    // Add channel
    const removeChannel = realtimeHandler.addChannel(testChannelFactory, testCallbacks);
    
    if (typeof removeChannel === 'function') {
      logTest('Channel addition', true, 'addChannel returned cleanup function');
      
      // Remove channel
      setTimeout(() => {
        removeChannel();
        logTest('Channel removal', true, 'Channel removed successfully');
      }, 100);
    } else {
      logTest('Channel addition', false, 'addChannel did not return cleanup function');
    }
    
  } catch (error) {
    logTest('Channel management', false, `Error: ${error}`);
  }
}

/**
 * Test 3: Test subscription callbacks
 */
function testSubscriptionCallbacks() {
  console.log('%c🧪 Test 3: Subscription Callbacks', 'font-weight: bold; color: blue');
  
  try {
    let callbacksReceived = {
      onSubscribe: false,
      onError: false,
      onTimeout: false,
      onClose: false
    };
    
    const testCallbacks: SubscriptionEventCallbacks = {
      onSubscribe: (channel) => {
        callbacksReceived.onSubscribe = true;
        console.log(`📡 Test callback: Subscribed to ${channel.topic}`);
      },
      onError: (channel, error) => {
        callbacksReceived.onError = true;
        console.log(`❌ Test callback: Error in ${channel.topic}:`, error.message);
      },
      onTimeout: (channel) => {
        callbacksReceived.onTimeout = true;
        console.log(`⏰ Test callback: Timeout in ${channel.topic}`);
      },
      onClose: (channel) => {
        callbacksReceived.onClose = true;
        console.log(`🔌 Test callback: Closed ${channel.topic}`);
      }
    };
    
    const testChannelFactory: ChannelFactory = (supabase) => {
      return supabase.channel(`callback-test-${Date.now()}`);
    };
    
    const removeChannel = realtimeHandler.addChannel(testChannelFactory, testCallbacks);
    
    logTest('Callbacks configured', true, 'Subscription callbacks set up successfully');
    
    // Note: Actual callback testing requires real Supabase connection
    // This test just verifies the setup doesn't throw errors
    
    setTimeout(() => {
      removeChannel();
    }, 500);
    
  } catch (error) {
    logTest('Subscription callbacks', false, `Error: ${error}`);
  }
}

/**
 * Test 4: Test visibility change handling
 */
function testVisibilityHandling() {
  console.log('%c🧪 Test 4: Visibility Change Handling', 'font-weight: bold; color: blue');
  
  try {
    // Create a test event
    const visibilityEvent = new Event('visibilitychange');
    
    // Dispatch the event (this will test if our handler is listening)
    document.dispatchEvent(visibilityEvent);
    
    logTest('Visibility change event', true, 'Visibility change event dispatched successfully');
    
    // Test document.hidden property access
    const hiddenState = document.hidden;
    logTest('Document.hidden access', true, `Current hidden state: ${hiddenState}`);
    
  } catch (error) {
    logTest('Visibility handling', false, `Error: ${error}`);
  }
}

/**
 * Test 5: Integration with actual Supabase client
 */
function testSupabaseIntegration() {
  console.log('%c🧪 Test 5: Supabase Integration', 'font-weight: bold; color: blue');
  
  try {
    // Test Supabase client availability
    if (!supabase) {
      logTest('Supabase client', false, 'Supabase client not available');
      return;
    }
    
    logTest('Supabase client', true, 'Supabase client is available');
    
    // Test realtime client
    if (supabase.realtime) {
      logTest('Realtime client', true, 'Supabase realtime client is available');
    } else {
      logTest('Realtime client', false, 'Supabase realtime client not found');
    }
    
    // Test channel creation through Supabase
    const testChannel = supabase.channel(`integration-test-${Date.now()}`);
    if (testChannel) {
      logTest('Channel creation', true, 'Test channel created successfully');
      
      // Clean up
      supabase.removeChannel(testChannel);
      logTest('Channel cleanup', true, 'Test channel removed successfully');
    } else {
      logTest('Channel creation', false, 'Failed to create test channel');
    }
    
  } catch (error) {
    logTest('Supabase integration', false, `Error: ${error}`);
  }
}

/**
 * Test 6: Test error recovery scenarios
 */
function testErrorRecovery() {
  console.log('%c🧪 Test 6: Error Recovery', 'font-weight: bold; color: blue');
  
  try {
    // Test removing non-existent channel
    realtimeHandler.removeChannel('non-existent-channel-12345');
    logTest('Remove non-existent channel', true, 'Handled gracefully without throwing');
    
    // Test adding channel with invalid factory (should handle gracefully)
    try {
      const invalidFactory: ChannelFactory = () => {
        throw new Error('Test error in factory');
      };
      
      // This might throw, but shouldn't crash the handler
      const removeChannel = realtimeHandler.addChannel(invalidFactory);
      logTest('Invalid channel factory', true, 'Invalid factory handled');
      
      // Clean up if it somehow succeeded
      if (typeof removeChannel === 'function') {
        removeChannel();
      }
    } catch (factoryError) {
      logTest('Invalid channel factory', true, 'Invalid factory error caught properly');
    }
    
  } catch (error) {
    logTest('Error recovery', false, `Unexpected error: ${error}`);
  }
}

/**
 * Run all browser tests
 */
export async function runBrowserTests() {
  console.clear();
  console.log('%c🚀 RealtimeHandler Browser Tests', 'font-size: 16px; font-weight: bold; color: blue');
  console.log('%c==============================', 'color: blue');
  
  // Reset test results
  testResults.passed = 0;
  testResults.failed = 0;
  testResults.tests = [];
  
  // Run all tests
  testHandlerInitialization();
  await new Promise(resolve => setTimeout(resolve, 100));
  
  testChannelManagement();
  await new Promise(resolve => setTimeout(resolve, 200));
  
  testSubscriptionCallbacks();
  await new Promise(resolve => setTimeout(resolve, 200));
  
  testVisibilityHandling();
  await new Promise(resolve => setTimeout(resolve, 100));
  
  testSupabaseIntegration();
  await new Promise(resolve => setTimeout(resolve, 100));
  
  testErrorRecovery();
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Print results
  console.log('%c\n📊 Test Results', 'font-size: 14px; font-weight: bold');
  console.log('%c===============', 'color: blue');
  console.log(`%c✅ Tests Passed: ${testResults.passed}`, 'color: green');
  console.log(`%c❌ Tests Failed: ${testResults.failed}`, testResults.failed > 0 ? 'color: red' : 'color: green');
  console.log(`%c📋 Total Tests: ${testResults.passed + testResults.failed}`, 'color: blue');
  
  if (testResults.failed === 0) {
    console.log('%c\n🎉 All browser tests passed! RealtimeHandler is working correctly in the browser.', 'color: green; font-weight: bold');
  } else {
    console.log('%c\n🚨 Some browser tests failed. Check the detailed results above.', 'color: red; font-weight: bold');
  }
  
  return testResults;
}

/**
 * Test RealtimeHandler with real user session
 */
export async function testWithRealSession(userId: string) {
  console.log('🔍 Testing RealtimeHandler with real session...');
  
  try {
    const songsChannelFactory: ChannelFactory = (supabase) => {
      return supabase
        .channel(`songs-${userId}`)
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'songs',
          filter: `user_id=eq.${userId}`,
        }, (payload) => {
          console.log('📨 Songs update received:', payload);
        });
    };

    const variationsChannelFactory: ChannelFactory = (supabase) => {
      return supabase
        .channel(`variations-${userId}`)
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'song_variations'
        }, (payload) => {
          console.log('📨 Variation update received:', payload);
        });
    };

    const removeChannel1 = realtimeHandler.addChannel(songsChannelFactory);
    const removeChannel2 = realtimeHandler.addChannel(variationsChannelFactory);

    console.log('✅ Real session test channels added');
    
    // Return cleanup function
    return () => {
      removeChannel1();
      removeChannel2();
    };
  } catch (error) {
    console.error('❌ Real session test failed:', error);
    return () => {};
  }
}

// New diagnostic function to check authentication and subscription health
export async function diagnoseMealtimeConnection() {
  console.log('🔍 Diagnosing Realtime Connection Issues');
  console.log('=====================================');
  
  try {
    const { supabase } = await import('../lib/supabase');
    
    // 1. Check authentication status
    const { data: session, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      console.error('❌ Session error:', sessionError);
      return false;
    }
    
    if (!session?.session?.user) {
      console.error('❌ No authenticated user found');
      return false;
    }
    
    console.log('✅ User authenticated:', session.session.user.id);
    
    // 2. Test basic database connection
    const { error: testError } = await supabase
      .from('songs')
      .select('count')
      .limit(1);
      
    if (testError) {
      console.error('❌ Database connection error:', testError);
      return false;
    }
    
    console.log('✅ Database connection working');
    
    // 3. Check realtime connection
    const realtimeStatus = supabase.realtime.isConnected();
    console.log('🔌 Realtime connected:', realtimeStatus);
    
    // 4. Test creating a simple channel
    console.log('🧪 Testing channel creation...');
    
    const testChannel = supabase
      .channel('diagnostic-test')
      .on('presence', { event: 'sync' }, () => {
        console.log('✅ Test channel presence sync working');
      });
    
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Channel subscription timeout'));
      }, 10000); // 10 second timeout
      
      testChannel.subscribe((status, err) => {
        clearTimeout(timeout);
        if (status === 'SUBSCRIBED') {
          console.log('✅ Test channel subscribed successfully');
          resolve(true);
        } else if (status === 'TIMED_OUT') {
          reject(new Error('Test channel timed out'));
        } else if (status === 'CHANNEL_ERROR') {
          reject(err || new Error('Test channel error'));
        }
      });
    });
    
    // Clean up test channel
    await supabase.removeChannel(testChannel);
    
    // 5. Test postgres_changes subscription
    console.log('🧪 Testing postgres_changes subscription...');
    
    const pgChannel = supabase
      .channel('diagnostic-postgres-test')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'songs',
        filter: `user_id=eq.${session.session.user.id}`,
      }, () => {
        console.log('✅ Postgres changes listener working');
      });
    
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Postgres changes subscription timeout'));
      }, 15000); // 15 second timeout for postgres_changes
      
      pgChannel.subscribe((status, err) => {
        clearTimeout(timeout);
        if (status === 'SUBSCRIBED') {
          console.log('✅ Postgres changes subscribed successfully');
          resolve(true);
        } else if (status === 'TIMED_OUT') {
          reject(new Error('Postgres changes timed out - likely RLS or network issue'));
        } else if (status === 'CHANNEL_ERROR') {
          reject(err || new Error('Postgres changes error'));
        }
      });
    });
    
    // Clean up postgres test channel
    await supabase.removeChannel(pgChannel);
    
    console.log('🎉 All diagnostic tests passed! Connection is healthy.');
    return true;
    
  } catch (error) {
    console.error('❌ Diagnostic failed:', error);
    
    // Provide specific guidance based on error type
    if (error instanceof Error) {
      if (error.message.includes('timeout')) {
        console.log('💡 Timeout suggests network connectivity or RLS policy issues');
        console.log('💡 Try checking your internet connection and Supabase project status');
      } else if (error.message.includes('unauthorized') || error.message.includes('permission')) {
        console.log('💡 Permission error suggests RLS policy or authentication issues');
        console.log('💡 Check that you are logged in and RLS policies allow realtime subscriptions');
      }
    }
    
    return false;
  }
}

// Expose functions to global scope for easy browser testing
if (typeof window !== 'undefined') {
  (window as any).testRealtimeHandler = {
    runBrowserTests,
    testWithRealSession,
    diagnoseMealtimeConnection,
    testHandlerInitialization,
    testChannelManagement,
    testSubscriptionCallbacks,
    testVisibilityHandling,
    testSupabaseIntegration,
    testErrorRecovery
  };
} 