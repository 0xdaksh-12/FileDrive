import axios from 'axios';

/**
 * Extracts a human-readable error message from an unknown error,
 * especially handling Axios and Django REST Framework error formats.
 */
export function getErrorMessage(
  error: unknown,
  fallbackMessage = 'An unexpected error occurred',
): string {
  if (!axios.isAxiosError(error)) {
    if (error instanceof Error) return error.message;
    return fallbackMessage;
  }

  const data = error.response?.data;

  if (data) {
    // If the response data is a string
    if (typeof data === 'string') {
      return data;
    }

    // DRF standard error shape: { "detail": "error message" }
    if (data.detail && typeof data.detail === 'string') {
      return data.detail;
    }

    // Custom error shape: { "message": "error message" }
    if (data.message && typeof data.message === 'string') {
      return data.message;
    }

    // DRF validation error shape: { "email": ["This email is already in use."] }
    if (typeof data === 'object') {
      const keys = Object.keys(data);
      if (keys.length > 0) {
        const firstKey = keys[0];
        const val = (data as Record<string, unknown>)[firstKey];

        // Capitalize the field name for readability
        const fieldName = firstKey.charAt(0).toUpperCase() + firstKey.slice(1);

        if (Array.isArray(val) && typeof val[0] === 'string') {
          return `${fieldName}: ${val[0]}`;
        }
        if (typeof val === 'string') {
          return `${fieldName}: ${val}`;
        }
      }
    }
  }

  // Fallback to standard axios error message (e.g. network error)
  return error.message || fallbackMessage;
}
