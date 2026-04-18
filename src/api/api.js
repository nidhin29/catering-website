const BASE_URL = 'http://localhost:8000';

/**
 * Minimalist wrapper for the native fetch API.
 * Handles base URL, JWT headers, and standard response parsing.
 */
export const apiRequest = async (path, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers,
  });

  console.log(`[API Request] ${options.method || 'GET'} ${BASE_URL}${path} | Status: ${response.status}`);

  // Handle common authentication errors
  if (response.status === 401) {
    // Only attempt refresh if we're not currently on the login page and not already calling refresh
    if (!window.location.pathname.includes('/login') && path !== '/api/v1/user/auth/refresh-token') {
      try {
        const refreshResponse = await fetch(`${BASE_URL}/api/v1/auth/refresh-token`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        });

        if (refreshResponse.ok) {
          // Retry the original request
          return apiRequest(path, options);
        }
      } catch (e) {
        console.error('Silent refresh failed:', e);
      }

      localStorage.removeItem('adminUser');
      window.location.replace('/login');
    }
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `Error: ${response.status}`);
  }

  return data;
};
