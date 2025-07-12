 // WeArt Dashboard JavaScript
class WeArtDashboard {
    constructor() {
        this.init();
    }

    async init() {
        this.setupEventListeners();
        await this.loadDashboardData();
        this.animateProgressCircle();
        this.setupNavigation();
    }

    setupEventListeners() {
        // Navigation items - only for items without onclick handlers
        document.querySelectorAll('.nav-item:not([onclick])').forEach(item => {
            item.addEventListener('click', (e) => {
                this.handleNavigation(e.currentTarget);
            });
        });

        // Category cards
        document.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('click', (e) => {
                this.handleCategoryClick(e.currentTarget);
            });
        });

        // Header buttons
        document.getElementById('createPromptBtn')?.addEventListener('click', () => {
            this.handleCreatePrompt();
        });

        document.getElementById('profileBtn')?.addEventListener('click', () => {
            this.handleProfileClick();
        });

        // Search functionality
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }

        // Trending cards click handlers
        document.addEventListener('click', (e) => {
            if (e.target.closest('.trending-card')) {
                this.handleTrendingClick(e.target.closest('.trending-card'));
            }
        });
    }

    async loadDashboardData() {
        try {
            this.showLoading();
            
            // Load user stats
            const statsResponse = await fetch('/api/user/stats');
            const stats = await statsResponse.json();
            this.updateUserStats(stats);

            // Load trending prompts
            const promptsResponse = await fetch('/api/trending-prompts');
            const prompts = await promptsResponse.json();
            this.updateTrendingPrompts(prompts);

            // Load course data
            const coursesResponse = await fetch('/api/courses');
            const courses = await coursesResponse.json();
            this.updateCourseData(courses[0]); // Show first course

            this.hideLoading();
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            this.hideLoading();
            this.showNotification('Failed to load dashboard data', 'error');
        }
    }

    updateUserStats(stats) {
        // Update streak
        const dayStreakEl = document.getElementById('dayStreak');
        if (dayStreakEl) {
            dayStreakEl.textContent = `${stats.streak} DAY STREAK`;
        }

        // Update XP
        const xpPointsEl = document.getElementById('xpPoints');
        if (xpPointsEl) {
            xpPointsEl.textContent = `${stats.xp.toLocaleString()} XP`;
        }

        // Update progress
        const progressTextEl = document.getElementById('progressText');
        if (progressTextEl) {
            progressTextEl.textContent = `${stats.progress}%`;
        }

        // Update progress ring
        this.updateProgressRing(stats.progress);
    }

    updateProgressRing(progress) {
        const progressRing = document.getElementById('progressRing');
        if (progressRing) {
            const circumference = 2 * Math.PI * 60; // r = 60
            const offset = circumference - (progress / 100) * circumference;
            progressRing.style.strokeDashoffset = offset;
        }
    }

    updateTrendingPrompts(prompts) {
        const trendingGrid = document.getElementById('trendingGrid');
        if (trendingGrid) {
            trendingGrid.innerHTML = prompts.map(prompt => `
                <div class="trending-card" data-prompt-id="${prompt.id}">
                    <h3>${prompt.title}</h3>
                </div>
            `).join('');
        }
    }

    updateCourseData(course) {
        const courseTitleEl = document.getElementById('courseTitle');
        const courseProgressEl = document.getElementById('courseProgress');
        
        if (courseTitleEl) {
            courseTitleEl.textContent = course.title;
        }
        
        if (courseProgressEl) {
            courseProgressEl.style.width = `${course.progress}%`;
        }
    }

    animateProgressCircle() {
        const progressRing = document.getElementById('progressRing');
        if (progressRing) {
            // Start from 0 and animate to current value
            const finalOffset = progressRing.style.strokeDashoffset || '150.8';
            progressRing.style.strokeDashoffset = '377';
            
            setTimeout(() => {
                progressRing.style.strokeDashoffset = finalOffset;
            }, 500);
        }
    }

    setupNavigation() {
        // Navigation active states are now handled by navigation-fix.js
        // This prevents conflicts between multiple navigation handlers
    }

    handleNavigation(navItem) {
        // Check if the nav item has an onclick handler
        if (navItem.hasAttribute('onclick')) {
            // Let the onclick handler work normally
            return;
        }
        
        // Remove active class from all nav items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Add active class to clicked item
        navItem.classList.add('active');
        
        // Get page data attribute
        const page = navItem.dataset.page;
        
        // Show notification for demo purposes
        this.showNotification(`Navigating to ${page || 'Dashboard'}...`, 'info');
    }

    handleCategoryClick(categoryCard) {
        const category = categoryCard.dataset.category;
        this.showNotification(`Exploring ${category} category...`, 'info');
        
        // Add visual feedback
        categoryCard.style.transform = 'scale(0.95)';
        setTimeout(() => {
            categoryCard.style.transform = '';
        }, 150);
    }

    handleCreatePrompt() {
        this.showNotification('Create Prompt feature coming soon!', 'info');
    }

    handleProfileClick() {
        this.showNotification('Profile settings coming soon!', 'info');
    }

    handleSearch(query) {
        if (query.length > 2) {
            this.showNotification(`Searching for: ${query}`, 'info');
            // Implement search functionality here
        }
    }

    handleTrendingClick(trendingCard) {
        const promptId = trendingCard.dataset.promptId;
        const title = trendingCard.querySelector('h3').textContent;
        this.showNotification(`Opening prompt: ${title}`, 'info');
        
        // Add visual feedback
        trendingCard.style.transform = 'scale(0.98)';
        setTimeout(() => {
            trendingCard.style.transform = '';
        }, 150);
    }

    showLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.classList.add('show');
        }
    }

    hideLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.classList.remove('show');
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 20px',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '500',
            zIndex: '9999',
            transform: 'translateX(100%)',
            transition: 'all 0.3s ease',
            maxWidth: '300px',
            wordWrap: 'break-word'
        });

        // Set background color based on type
        switch (type) {
            case 'success':
                notification.style.background = 'linear-gradient(135deg, #10b981, #059669)';
                break;
            case 'error':
                notification.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
                break;
            case 'warning':
                notification.style.background = 'linear-gradient(135deg, #f59e0b, #d97706)';
                break;
            default:
                notification.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
        }

        document.body.appendChild(notification);

        // Animate in
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
        });

        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // Utility methods
    formatNumber(num) {
        return num.toLocaleString();
    }

    formatDate(date) {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }).format(new Date(date));
    }

    // Animation utilities
    fadeIn(element, duration = 300) {
        element.style.opacity = '0';
        element.style.display = 'block';
        
        let start = null;
        const animate = (timestamp) => {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            element.style.opacity = Math.min(progress / duration, 1);
            
            if (progress < duration) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    fadeOut(element, duration = 300) {
        let start = null;
        const initialOpacity = parseFloat(getComputedStyle(element).opacity);
        
        const animate = (timestamp) => {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            element.style.opacity = initialOpacity - (progress / duration);
            
            if (progress < duration) {
                requestAnimationFrame(animate);
            } else {
                element.style.display = 'none';
            }
        };
        
        requestAnimationFrame(animate);
    }
}

// WeArt AI Chat Integration
class WeArtAI {
    constructor() {
        this.chatHistory = [];
        this.isLoading = false;
        this.initializeElements();
        this.bindEvents();
        this.loadChatHistory();
        this.showWelcomeMessage();
    }

    initializeElements() {
        this.chatContainer = document.querySelector('.ai-chat-messages');
        this.inputBox = document.querySelector('.ai-input-box');
        this.sendBtn = document.querySelector('.ai-send-btn');
    }

    bindEvents() {
        if (!this.sendBtn || !this.inputBox) return;

        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.inputBox.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Auto-resize textarea
        this.inputBox.addEventListener('input', () => {
            this.inputBox.style.height = 'auto';
            this.inputBox.style.height = Math.min(this.inputBox.scrollHeight, 80) + 'px';
        });
    }

    showWelcomeMessage() {
        if (!this.chatContainer) return;
        
        // Check if we already have messages
        if (this.chatContainer.children.length > 0) return;

        this.addMessage("Hello! I'm your AI art mentor. I can help you with art techniques, history, course recommendations, and creative guidance. What would you like to explore today?", 'ai');
    }

    async sendMessage() {
        if (!this.inputBox || !this.chatContainer) return;
        
        const message = this.inputBox.value.trim();
        if (!message || this.isLoading) return;

        // Clear input
        this.inputBox.value = '';
        this.inputBox.style.height = 'auto';

        // Add user message to chat
        this.addMessage(message, 'user');

        // Show loading state
        this.setLoadingState(true);

        try {
            // Send to DeepSeek API
            const response = await this.callDeepSeekAPI(message);
            this.addMessage(response, 'ai');
            
            // Update chat history
            this.chatHistory.push(
                { role: 'user', content: message },
                { role: 'assistant', content: response }
            );
            
            // Keep only last 20 messages
            if (this.chatHistory.length > 20) {
                this.chatHistory = this.chatHistory.slice(-20);
            }

            this.saveChatHistory();
            
        } catch (error) {
            console.error('Error sending message:', error);
            this.addMessage('Sorry, I\'m having trouble connecting. Please try again.', 'ai');
        } finally {
            this.setLoadingState(false);
        }
    }

    async callDeepSeekAPI(message) {
        try {
            const response = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    chatHistory: this.chatHistory,
                    maxTokens: 1000,
                    temperature: 0.7
                })
            });

            const data = await response.json();

            if (response.ok) {
                return data.response;
            } else {
                throw new Error(data.error || 'Failed to get AI response');
            }
        } catch (error) {
            console.error('DeepSeek API error:', error);
            throw error;
        }
    }

    addMessage(content, type) {
        if (!this.chatContainer) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `${type}-message`;

        const messageContent = document.createElement('div');
        messageContent.innerHTML = this.formatMessage(content);

        const messageTime = document.createElement('div');
        messageTime.className = 'message-time';
        messageTime.textContent = this.getCurrentTime();

        messageDiv.appendChild(messageContent);
        messageDiv.appendChild(messageTime);

        this.chatContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }

    formatMessage(content) {
        // Simple markdown-like formatting
        if (typeof marked !== 'undefined') {
            return marked.parse(content);
        } else {
            // Fallback formatting
            return content
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/\n/g, '<br>');
        }
    }

    getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
        });
    }

    setLoadingState(loading) {
        if (!this.sendBtn || !this.inputBox) return;

        this.isLoading = loading;
        this.sendBtn.disabled = loading;
        this.inputBox.disabled = loading;

        if (loading) {
            this.sendBtn.innerHTML = '<i class="ri-loader-4-line" style="animation: spin 1s linear infinite;"></i>';
            this.addTypingIndicator();
        } else {
            this.sendBtn.innerHTML = '<i class="ri-send-plane-fill"></i>';
            this.removeTypingIndicator();
        }
    }

    addTypingIndicator() {
        if (!this.chatContainer) return;

        const typingDiv = document.createElement('div');
        typingDiv.className = 'ai-message typing-indicator';
        typingDiv.innerHTML = `
            <div>
                <span class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </span>
            </div>
        `;

        this.chatContainer.appendChild(typingDiv);
        this.scrollToBottom();
    }

    removeTypingIndicator() {
        const typingIndicator = document.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    scrollToBottom() {
        setTimeout(() => {
            const chatContainer = document.querySelector('.ai-chat-container');
            if (chatContainer) {
                chatContainer.scrollTop = chatContainer.scrollHeight;
            }
        }, 100);
    }

    saveChatHistory() {
        localStorage.setItem('weart-ai-chat-history', JSON.stringify(this.chatHistory));
    }

    loadChatHistory() {
        try {
            const saved = localStorage.getItem('weart-ai-chat-history');
            if (saved) {
                this.chatHistory = JSON.parse(saved);
                
                // Restore previous messages (show last 5 for space)
                const recentHistory = this.chatHistory.slice(-10);
                recentHistory.forEach(msg => {
                    this.addMessage(msg.content, msg.role === 'user' ? 'user' : 'ai');
                });
            }
        } catch (error) {
            console.error('Error loading chat history:', error);
            this.chatHistory = [];
        }
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.weArtDashboard = new WeArtDashboard();
    window.weArtAI = new WeArtAI();
});

// Handle window resize for responsive behavior
window.addEventListener('resize', () => {
    // Add any resize-specific logic here
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    
    if (window.innerWidth <= 768) {
        sidebar.style.display = 'none';
        mainContent.style.marginLeft = '0';
    } else {
        sidebar.style.display = 'flex';
        mainContent.style.marginLeft = '80px';
    }
});

// Add some interactive mouse effects for enhanced UX
document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.journey-card, .category-card, .learning-card, .ai-chat-card');
    
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        } else {
            card.style.transform = '';
        }
    });
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { WeArtDashboard, WeArtAI };
}