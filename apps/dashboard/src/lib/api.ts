export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
import { getAuthToken } from './auth';

export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers || {});
  
  // We'll let middleware/server components inject auth token dynamically via fetch wrappers
  // or use client-side interceptors using Axios for more complex apps.
  // For standard fetch in Next.js, we assume cookies are sent if credentials: 'include' is set
  // or token is explicitly passed in headers.
  
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  // Automatically attach token
  try {
    const token = await getAuthToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  } catch (e) {
    // Ignore if not available in current context
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    cache: 'no-store', // Prevent Next.js from caching 404s or stale admin data
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMsg = 'An error occurred';
    try {
      const err = await response.json();
      errorMsg = err.message || errorMsg;
    } catch {
      // Ignored
    }
    throw new Error(errorMsg);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  const json = await response.json();
  
  // Unwrap 'data' if the API uses TransformInterceptor
  if (json && 'data' in json && Object.keys(json).length === 1) {
    return json.data;
  }
  
  // Also handle paginated responses that might have data and meta
  if (json && 'data' in json && 'meta' in json) {
    return json; // Keep meta if it exists
  }
  
  if (json && 'data' in json) {
    return json.data;
  }

  return json;
}
