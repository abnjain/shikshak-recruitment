/**
 * In-memory access token store.
 *
 * Access token is kept ONLY in memory (never localStorage) for security.
 * Refresh token is stored in an httpOnly cookie (set by the backend) and
 * never accessible from JavaScript.
 */
let accessToken: string | null = null;
let refreshPromise: Promise<string | null> | null = null;

export const tokenManager = {
  /** Store the access token in memory */
  setAccessToken(token: string | null) {
    accessToken = token;
  },

  /** Retrieve the current access token */
  getAccessToken(): string | null {
    return accessToken;
  },

  /** Clear the access token (e.g. on logout) */
  clear() {
    accessToken = null;
    refreshPromise = null;
  },

  /**
   * Try to refresh the access token via the httpOnly cookie.
   * Uses a shared promise to prevent multiple simultaneous refresh calls.
   */
  async refresh(refreshUrl: string): Promise<string | null> {
    // If a refresh is already in-flight, reuse that promise
    if (refreshPromise) {
      return refreshPromise;
    }

    refreshPromise = (async () => {
      try {
        const response = await fetch(refreshUrl, {
          method: 'POST',
          credentials: 'include', // send cookies
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
          accessToken = null;
          return null;
        }

        const body = await response.json();
        const newToken: string | undefined = body?.data?.token;
        if (newToken) {
          accessToken = newToken;
          return newToken;
        }
        return null;
      } catch {
        accessToken = null;
        return null;
      } finally {
        refreshPromise = null;
      }
    })();

    return refreshPromise;
  },
};
