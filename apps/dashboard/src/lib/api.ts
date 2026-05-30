export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers || {});
  
  // We'll let middleware/server components inject auth token dynamically via fetch wrappers
  // or use client-side interceptors using Axios for more complex apps.
  // For standard fetch in Next.js, we assume cookies are sent if credentials: 'include' is set
  // or token is explicitly passed in headers.
  
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
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

  return response.json();
}
