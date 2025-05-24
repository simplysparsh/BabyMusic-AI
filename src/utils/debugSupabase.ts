/**
 * Supabase Debug Utilities
 * 
 * This file contains debugging utilities for troubleshooting Supabase connection issues.
 * All functions are automatically exposed to the global window object for easy console access.
 * 
 * USAGE:
 * 
 * 1. Open browser DevTools (F12) and go to Console tab
 * 
 * 2. Available functions:
 * 
 *    clearAllSupabaseData()
 *    - Clears all Supabase-related localStorage, sessionStorage, and cookies
 *    - Use when experiencing auth or session issues
 *    - Example: clearAllSupabaseData()
 * 
 *    debugWebSocketStatus()
 *    - Tests basic WebSocket connectivity and checks for common issues
 *    - Use when real-time features aren't working
 *    - Example: debugWebSocketStatus()
 * 
 *    testSupabaseRealtime()
 *    - Tests Supabase real-time channel subscription and messaging
 *    - Returns a promise that resolves with success/failure status
 *    - Example: await testSupabaseRealtime()
 * 
 *    checkSupabaseStatus()
 *    - Comprehensive test of Supabase services (database, auth, network)
 *    - Tests connectivity with timeouts and provides detailed diagnostics
 *    - Example: await checkSupabaseStatus()
 * 
 *    testSupabaseNetwork()
 *    - Tests direct network access to Supabase endpoints
 *    - Useful for diagnosing network/firewall issues
 *    - Example: await testSupabaseNetwork()
 * 
 * 3. Typical troubleshooting workflow:
 *    a) Start with: await checkSupabaseStatus()
 *    b) If real-time issues: debugWebSocketStatus() then await testSupabaseRealtime()
 *    c) If auth issues: clearAllSupabaseData() then refresh page
 *    d) If connection issues: await testSupabaseNetwork()
 * 
 * 4. All functions provide detailed console output with emojis for easy reading
 * 
 */

// Utility functions for debugging Supabase connection issues

export const clearAllSupabaseData = () => {
  console.log('🧹 Clearing all Supabase-related browser storage...');
  
  // Clear all localStorage items with 'supabase' in the key
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.includes('supabase')) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
    console.log(`✅ Removed localStorage: ${key}`);
  });
  
  // Clear sessionStorage
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    if (key && key.includes('supabase')) {
      sessionStorage.removeItem(key);
      console.log(`✅ Removed sessionStorage: ${key}`);
    }
  }
  
  // Clear cookies (for localhost)
  document.cookie.split(";").forEach((c) => {
    document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
  });
  
  console.log('✅ All Supabase data cleared! Please refresh the page.');
  return true;
};

export const debugWebSocketStatus = () => {
  console.log('🔍 Debugging WebSocket connections...');
  
  // Check if WebSocket is available
  if (typeof WebSocket === 'undefined') {
    console.error('❌ WebSocket is not available in this browser');
    return false;
  }
  
  // Test basic WebSocket connectivity
  try {
    const testWs = new WebSocket('wss://echo.websocket.org/');
    testWs.onopen = () => {
      console.log('✅ Basic WebSocket connectivity works');
      testWs.close();
    };
    testWs.onerror = (error) => {
      console.error('❌ Basic WebSocket test failed:', error);
    };
  } catch (error) {
    console.error('❌ Cannot create WebSocket:', error);
  }
  
  // Check for any browser extensions that might interfere
  if (navigator.userAgent.includes('Chrome')) {
    console.log('💡 If using Chrome, try disabling extensions or use Incognito mode');
  }
  
  return true;
};

export const testSupabaseRealtime = async () => {
  console.log('🔍 Testing Supabase Realtime connection...');
  
  try {
    // Import supabase instance
    const { supabase } = await import('../lib/supabase');
    
    // Create a test channel
    const testChannel = supabase
      .channel('test-channel-' + Date.now())
      .on('system', { event: '*' }, (payload) => {
        console.log('✅ Received system event:', payload);
      })
      .on('broadcast', { event: 'test' }, (payload) => {
        console.log('✅ Received broadcast:', payload);
      });
    
    // Subscribe with timeout
    const subscribePromise = new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Subscription timeout after 10 seconds'));
      }, 10000);
      
      testChannel.subscribe((status) => {
        clearTimeout(timeout);
        console.log('📡 Channel status:', status);
        
        if (status === 'SUBSCRIBED') {
          console.log('✅ Successfully subscribed to realtime channel!');
          
          // Send a test broadcast
          testChannel.send({
            type: 'broadcast',
            event: 'test',
            payload: { message: 'Hello from test!' }
          });
          
          // Clean up after 2 seconds
          setTimeout(() => {
            supabase.removeChannel(testChannel);
            console.log('🧹 Test channel removed');
            resolve(true);
          }, 2000);
        } else if (status === 'CHANNEL_ERROR') {
          reject(new Error('Channel subscription error'));
        } else if (status === 'TIMED_OUT') {
          reject(new Error('Channel subscription timed out'));
        } else if (status === 'CLOSED') {
          reject(new Error('Channel was closed'));
        }
      });
    });
    
    await subscribePromise;
    return { success: true };
  } catch (error) {
    console.error('❌ Realtime test failed:', error);
    return { success: false, error };
  }
};

// Check Supabase service status
export const checkSupabaseStatus = async () => {
  console.log('🔍 Checking Supabase service status...');
  
  try {
    const { supabase } = await import('../lib/supabase');
    
    // Helper to add timeout to promises
    const withTimeout = <T>(promise: Promise<T>, timeoutMs: number, operation: string): Promise<T> => {
      return Promise.race([
        promise,
        new Promise<T>((_, reject) => 
          setTimeout(() => reject(new Error(`${operation} timed out after ${timeoutMs}ms`)), timeoutMs)
        )
      ]);
    };
    
    // Test database connection with timeout
    console.log('Testing database...');
    try {
      const { data: _data, error } = await withTimeout(
        (async () => {
          const result = await supabase.from('profiles').select('count').limit(1).maybeSingle();
          return result;
        })(),
        5000,
        'Database query'
      );
      console.log(error ? '❌ Database test failed' : '✅ Database connection OK');
    } catch (error) {
      console.error('❌ Database test error:', error);
    }
    
    // Test auth service with timeout
    console.log('Testing auth service...');
    try {
      const authResult = await withTimeout(
        supabase.auth.getSession(),
        5000,
        'Auth check'
      );
      console.log(authResult.data ? '✅ Auth service OK' : '✅ Auth service OK (no session)');
    } catch (error) {
      console.error('❌ Auth test error:', error);
    }
    
    // Get connection info
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
    const url = new URL(supabaseUrl);
    console.log('📍 Supabase project:', url.hostname.split('.')[0]);
    console.log('🌐 Region:', url.hostname.includes('supabase.co') ? 'Hosted' : 'Self-hosted');
    
    // Test if we can reach the Supabase URL at all
    console.log('Testing network connectivity to Supabase...');
    try {
      const response = await withTimeout(
        fetch(`${supabaseUrl}/rest/v1/`, {
          method: 'HEAD',
          headers: {
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY || ''
          }
        }),
        5000,
        'Network connectivity test'
      );
      console.log(response.ok ? '✅ Network connectivity OK' : `❌ Network issue: ${response.status}`);
    } catch (error) {
      console.error('❌ Cannot reach Supabase:', error);
    }
    
    return {
      completed: true
    };
  } catch (error) {
    console.error('❌ Status check failed:', error);
    return { error };
  }
};

// Simple network test without Supabase client
export const testSupabaseNetwork = async () => {
  console.log('🔍 Testing direct network access to Supabase...');
  
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
  
  if (!supabaseUrl || !anonKey) {
    console.error('❌ Missing Supabase URL or anon key');
    return { success: false, error: 'Missing configuration' };
  }
  
  console.log('📍 Testing URL:', supabaseUrl);
  
  // Test 1: Basic fetch to root
  try {
    console.log('1️⃣ Testing basic connectivity...');
    const response = await fetch(supabaseUrl, { 
      method: 'HEAD',
      mode: 'cors'
    });
    console.log(`   Status: ${response.status} ${response.statusText}`);
  } catch (error) {
    console.error('   ❌ Basic connectivity failed:', error);
  }
  
  // Test 2: REST API endpoint
  try {
    console.log('2️⃣ Testing REST API...');
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      headers: {
        'apikey': anonKey,
        'Authorization': `Bearer ${anonKey}`
      }
    });
    console.log(`   Status: ${response.status} ${response.statusText}`);
  } catch (error) {
    console.error('   ❌ REST API test failed:', error);
  }
  
  // Test 3: Realtime endpoint (HTTP, not WebSocket)
  try {
    console.log('3️⃣ Testing Realtime HTTP endpoint...');
    const response = await fetch(`${supabaseUrl}/realtime/v1/`, {
      headers: {
        'apikey': anonKey
      }
    });
    console.log(`   Status: ${response.status} ${response.statusText}`);
  } catch (error) {
    console.error('   ❌ Realtime HTTP test failed:', error);
  }
  
  // Test 4: Check if WebSocket URL is reachable
  const wsUrl = supabaseUrl.replace('https://', 'wss://').replace('http://', 'ws://');
  console.log('4️⃣ WebSocket URL would be:', wsUrl + '/realtime/v1/websocket');
  
  return { completed: true };
};

// Monitor realtime connection health over time
export const monitorRealtimeHealth = () => {
  console.log('🔍 Starting realtime health monitor...');
  console.log('💡 This will log connection status every 30 seconds for 5 minutes');
  console.log('💡 Look for consistent "SUBSCRIBED" status and absence of reconnections');
  
  let monitorCount = 0;
  const maxMonitors = 10; // 5 minutes (10 * 30 seconds)
  
  const checkHealth = async () => {
    monitorCount++;
    const timestamp = new Date().toLocaleTimeString();
    
    try {
      const { supabase } = await import('../lib/supabase');
      
      // Check if we can quickly test a channel
      const testChannel = supabase.channel('health-check-' + Date.now());
      
      const statusPromise = new Promise((resolve) => {
        const timeout = setTimeout(() => resolve('TIMEOUT'), 5000);
        
        testChannel.subscribe((status) => {
          clearTimeout(timeout);
          resolve(status);
        });
      });
      
      const status = await statusPromise;
      
      if (status === 'SUBSCRIBED') {
        console.log(`✅ [${timestamp}] Realtime healthy - Status: ${status}`);
      } else {
        console.log(`⚠️ [${timestamp}] Realtime issue - Status: ${status}`);
      }
      
      // Clean up
      supabase.removeChannel(testChannel);
      
    } catch (error) {
      console.error(`❌ [${timestamp}] Realtime error:`, error);
    }
    
    if (monitorCount < maxMonitors) {
      setTimeout(checkHealth, 30000); // Check every 30 seconds
    } else {
      console.log('🏁 Realtime health monitoring completed');
    }
  };
  
  // Start monitoring
  checkHealth();
  
  return {
    stop: () => {
      monitorCount = maxMonitors;
      console.log('🛑 Realtime health monitoring stopped');
    }
  };
};

// Make functions available globally for console debugging
if (typeof window !== 'undefined') {
  (window as any).clearAllSupabaseData = clearAllSupabaseData;
  (window as any).debugWebSocketStatus = debugWebSocketStatus;
  (window as any).testSupabaseRealtime = testSupabaseRealtime;
  (window as any).checkSupabaseStatus = checkSupabaseStatus;
  (window as any).testSupabaseNetwork = testSupabaseNetwork;
  (window as any).monitorRealtimeHealth = monitorRealtimeHealth;
} 