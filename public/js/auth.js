// WeArt Authentication Utilities

class WeArtAuth {
    constructor() {
        this.tokenKey = 'authToken';
        this.userKey = 'user';
    }

    // Get stored auth token
    getToken() {
        return localStorage.getItem(this.tokenKey);
    }

    // Get stored user data
    getUser() {
        const userData = localStorage.getItem(this.userKey);
        try {
            return userData ? JSON.parse(userData) : null;
        } catch (error) {
            console.error('Error parsing user data:', error);
            this.clearAuth();
            return null;
        }
    }

    // Store auth data
    setAuth(token, user) {
        localStorage.setItem(this.tokenKey, token);
        localStorage.setItem(this.userKey, JSON.stringify(user));
    }

    // Clear auth data
    clearAuth() {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.userKey);
    }

    // Check if user is authenticated
    isAuthenticated() {
        return !!this.getToken() && !!this.getUser();
    }

    // Make authenticated API request
    async makeAuthenticatedRequest(url, options = {}) {
        const token = this.getToken();
        if (!token) {
            throw new Error('No authentication token found');
        }

        const headers = {
            'Authorization': `Bearer ${token}`,
            ...options.headers
        };

        // Don't set Content-Type for FormData - let browser set it
        if (!(options.body instanceof FormData) && !headers['Content-Type']) {
            headers['Content-Type'] = 'application/json';
        }

        const response = await fetch(url, {
            ...options,
            headers
        });

        if (response.status === 401) {
            // Token expired or invalid
            this.clearAuth();
            window.location.href = 'register.html';
            return;
        }

        return response;
    }

    // Update user preferences
    async updatePreferences(preferences) {
        try {
            const response = await this.makeAuthenticatedRequest('/api/auth/preferences', {
                method: 'POST',
                body: JSON.stringify(preferences)
            });

            const data = await response.json();
            if (response.ok) {
                // Update stored user data
                this.setAuth(this.getToken(), data.user);
                return data.user;
            } else {
                throw new Error(data.error || 'Failed to update preferences');
            }
        } catch (error) {
            console.error('Error updating preferences:', error);
            throw error;
        }
    }

    // Logout user
    async logout() {
        try {
            await fetch('/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.getToken()}`
                }
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            this.clearAuth();
            window.location.href = 'register.html';
        }
    }

    // Redirect based on user state
    redirectBasedOnAuth() {
        const user = this.getUser();
        const token = this.getToken();

        if (!token || !user) {
            // Not authenticated, go to register
            window.location.href = 'register.html';
            return;
        }

        if (user.onboardingCompleted) {
            // Onboarding complete, go to AI chat
            window.location.href = 'ai.html';
        } else {
            // Continue onboarding
            window.location.href = 'color_selection.html';
        }
    }
}

// Create global instance
window.weartAuth = new WeArtAuth();

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WeArtAuth;
} 