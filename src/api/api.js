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
  if (response.status === 401 || response.status === 403) {
    // Only clear and redirect if we're not currently on the login page
    if (!window.location.pathname.includes('/login')) {
      localStorage.removeItem('adminToken');
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
