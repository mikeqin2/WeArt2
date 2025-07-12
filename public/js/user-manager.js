// WeArt Global User Management System
class WeArtUserManager {
    constructor() {
        this.storageKey = 'weart_user';
        this.chatHistoryKey = 'weart_chat_history';
        this.onboardingKey = 'weart_onboarding';
        this.currentUser = this.loadUser();
        this.chatHistory = this.loadChatHistory();
    }
    
    // User Authentication
    saveUser(userData) {
        const userWithDefaults = {
            id: userData.id || 'user_' + Date.now(),
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            registeredAt: userData.registeredAt || new Date().toISOString(),
            onboardingCompleted: userData.onboardingCompleted || false,
            preferences: userData.preferences || {},
            ...userData
        };
        
        localStorage.setItem(this.storageKey, JSON.stringify(userWithDefaults));
        this.currentUser = userWithDefaults;
        
        // Dispatch user updated event
        window.dispatchEvent(new CustomEvent('userUpdated', { detail: userWithDefaults }));
        
        return userWithDefaults;
    }
    
    loadUser() {
        const stored = localStorage.getItem(this.storageKey);
        return stored ? JSON.parse(stored) : null;
    }
    
    updateUser(updates) {
        if (!this.currentUser) return null;
        
        const updatedUser = { ...this.currentUser, ...updates };
        return this.saveUser(updatedUser);
    }
    
    isLoggedIn() {
        return this.currentUser !== null;
    }
    
    logout() {
        localStorage.removeItem(this.storageKey);
        localStorage.removeItem(this.chatHistoryKey);
        localStorage.removeItem(this.onboardingKey);
        this.currentUser = null;
        this.chatHistory = [];
        
        // Dispatch logout event
        window.dispatchEvent(new CustomEvent('userLoggedOut'));
        
        // Redirect to register page
        window.location.href = 'register.html';
    }
    
    // Onboarding Management
    saveOnboardingData(step, data) {
        const onboardingData = this.loadOnboardingData();
        onboardingData[step] = { ...data, timestamp: new Date().toISOString() };
        localStorage.setItem(this.onboardingKey, JSON.stringify(onboardingData));
        return onboardingData;
    }
    
    loadOnboardingData() {
        const stored = localStorage.getItem(this.onboardingKey);
        return stored ? JSON.parse(stored) : {};
    }
    
    completeOnboarding() {
        if (this.currentUser) {
            this.updateUser({ onboardingCompleted: true });
        }
    }
    
    // Chat History Management
    saveChatHistory(history) {
        localStorage.setItem(this.chatHistoryKey, JSON.stringify(history));
        this.chatHistory = history;
    }
    
    loadChatHistory() {
        const stored = localStorage.getItem(this.chatHistoryKey);
        return stored ? JSON.parse(stored) : [];
    }
    
    addChatMessage(message) {
        const chatMessage = {
            id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            type: message.type || 'text', // 'text', 'image', 'file'
            sender: message.sender || 'user', // 'user', 'assistant'
            content: message.content,
            timestamp: new Date().toISOString(),
            userId: this.currentUser?.id,
            sessionId: this.getCurrentSessionId(),
            ...message
        };
        
        this.chatHistory.push(chatMessage);
        this.saveChatHistory(this.chatHistory);
        
        // Dispatch chat updated event
        window.dispatchEvent(new CustomEvent('chatHistoryUpdated', { detail: chatMessage }));
        
        return chatMessage;
    }
    
    getChatHistory(limit = null) {
        const history = this.chatHistory.filter(msg => msg.userId === this.currentUser?.id);
        return limit ? history.slice(-limit) : history;
    }
    
    getCurrentSessionId() {
        if (!this.currentSessionId) {
            this.currentSessionId = 'session_' + Date.now();
        }
        return this.currentSessionId;
    }
    
    getRecentConversations(limit = 5) {
        const conversations = {};
        const userHistory = this.getChatHistory();
        
        // Group messages by session or topic
        userHistory.forEach(msg => {
            const sessionId = msg.sessionId || 'default';
            if (!conversations[sessionId]) {
                conversations[sessionId] = {
                    id: sessionId,
                    title: this.generateConversationTitle(msg),
                    lastMessage: msg,
                    messageCount: 0,
                    timestamp: msg.timestamp
                };
            }
            conversations[sessionId].messageCount++;
            if (new Date(msg.timestamp) > new Date(conversations[sessionId].timestamp)) {
                conversations[sessionId].lastMessage = msg;
                conversations[sessionId].timestamp = msg.timestamp;
            }
        });
        
        return Object.values(conversations)
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, limit);
    }
    
    generateConversationTitle(message) {
        const content = message.content.toLowerCase();
        
        if (content.includes('color') || content.includes('painting')) {
            return 'Color Theory Basics';
        } else if (content.includes('oil') || content.includes('acrylic')) {
            return 'Getting Started with Oil Painting';
        } else if (content.includes('renaissance') || content.includes('history')) {
            return 'Renaissance Art Exploration';
        } else if (content.includes('digital') || content.includes('photoshop')) {
            return 'Digital Art Techniques';
        } else if (content.includes('watercolor')) {
            return 'Watercolor Landscape Tips';
        } else {
            return 'Art Discussion';
        }
    }
    
    // Navigation Guards
    requireAuth(redirectTo = 'register.html') {
        if (!this.isLoggedIn()) {
            window.location.href = redirectTo;
            return false;
        }
        return true;
    }
    
    requireOnboarding(redirectTo = 'color_selection.html') {
        if (this.isLoggedIn() && !this.currentUser.onboardingCompleted) {
            window.location.href = redirectTo;
            return false;
        }
        return true;
    }
    
    redirectIfLoggedIn(destination = 'index.html') {
        if (this.isLoggedIn() && this.currentUser.onboardingCompleted) {
            window.location.href = destination;
            return true;
        }
        return false;
    }
    
    // Profile Management
    getUserProfile() {
        return this.currentUser;
    }
    
    updateProfile(profileData) {
        return this.updateUser(profileData);
    }
    
    // Analytics and Preferences
    trackUserAction(action, data = {}) {
        const event = {
            action,
            data,
            timestamp: new Date().toISOString(),
            userId: this.currentUser?.id,
            page: window.location.pathname
        };
        
        // Store in a separate analytics key (optional)
        const analytics = JSON.parse(localStorage.getItem('weart_analytics') || '[]');
        analytics.push(event);
        
        // Keep only last 100 events
        if (analytics.length > 100) {
            analytics.splice(0, analytics.length - 100);
        }
        
        localStorage.setItem('weart_analytics', JSON.stringify(analytics));
        
        console.log('User action tracked:', event);
    }
    
    setPreference(key, value) {
        if (!this.currentUser) return;
        
        const preferences = this.currentUser.preferences || {};
        preferences[key] = value;
        this.updateUser({ preferences });
    }
    
    getPreference(key, defaultValue = null) {
        return this.currentUser?.preferences?.[key] || defaultValue;
    }
}

// Create global instance
window.WeArtUserManager = WeArtUserManager;

// Auto-initialize if not already done
if (!window.userManager) {
    window.userManager = new WeArtUserManager();
}

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WeArtUserManager;
} 