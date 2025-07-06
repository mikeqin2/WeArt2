// Mentor Page JavaScript
class MentorPage {
    constructor() {
        this.selectedMentors = new Set();
        this.allMentors = [];
        this.currentFilters = {
            category: 'all',
            education: [],
            institution: [],
            search: '',
            nameSearch: ''
        };
        
        this.init();
    }

    async init() {
        await this.loadMentors();
        this.setupEventListeners();
        this.loadFilterOptions();
    }

    async loadMentors(filters = {}) {
        try {
            const params = new URLSearchParams({
                ...this.currentFilters,
                ...filters
            });

            // Convert arrays to multiple params
            if (this.currentFilters.education.length > 0) {
                this.currentFilters.education.forEach(edu => params.append('education', edu));
            }
            if (this.currentFilters.institution.length > 0) {
                this.currentFilters.institution.forEach(inst => params.append('institution', inst));
            }

            const response = await fetch(`/api/mentors?${params}`);
            const data = await response.json();
            
            this.allMentors = data.mentors;
            this.renderMentors();
        } catch (error) {
            console.error('Error loading mentors:', error);
            this.showError('Failed to load mentors. Please try again.');
        }
    }

    async loadFilterOptions() {
        try {
            const [categoriesRes, educationRes, institutionsRes] = await Promise.all([
                fetch('/api/mentors/meta/categories'),
                fetch('/api/mentors/meta/education-levels'),
                fetch('/api/mentors/meta/institutions')
            ]);

            const categories = await categoriesRes.json();
            const educationLevels = await educationRes.json();
            const institutions = await institutionsRes.json();

            this.renderFilterOptions(categories, educationLevels, institutions);
        } catch (error) {
            console.error('Error loading filter options:', error);
        }
    }

    renderFilterOptions(categories, educationLevels, institutions) {
        // Render discipline filters
        const disciplineFilters = document.getElementById('disciplineFilters');
        if (disciplineFilters) {
            disciplineFilters.innerHTML = categories.map(category => `
                <div class="filter-option">
                    <input type="checkbox" id="cat-${category}" value="${category}" data-filter="category">
                    <label for="cat-${category}">${this.formatCategoryName(category)}</label>
                </div>
            `).join('');
        }

        // Render institution filters (show top 10 most common)
        const institutionFilters = document.getElementById('institutionFilters');
        if (institutionFilters) {
            const topInstitutions = institutions.slice(0, 10);
            institutionFilters.innerHTML = topInstitutions.map((institution, index) => `
                <div class="filter-option">
                    <input type="checkbox" id="inst-${index}" value="${institution}" data-filter="institution">
                    <label for="inst-${index}">${institution}</label>
                </div>
            `).join('');
        }
    }

    formatCategoryName(category) {
        const categoryNames = {
            'design': 'Design',
            'music': 'Music',
            'literature': 'Literature',
            'philosophy': 'Philosophy'
        };
        return categoryNames[category] || category;
    }

    renderMentors() {
        const grid = document.getElementById('mentorsGrid');
        if (!grid) return;

        if (this.allMentors.length === 0) {
            grid.innerHTML = `
                <div class="no-results">
                    <p>No mentors found matching your criteria.</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = this.allMentors.map(mentor => this.createMentorCard(mentor)).join('');
    }

    createMentorCard(mentor) {
        const isSelected = this.selectedMentors.has(mentor.id);
        const educationText = mentor.education.map(edu => `${edu.degree} - ${edu.institution}`).join(' | ');
        
        return `
            <div class="mentor-card ${isSelected ? 'selected' : ''}" data-mentor-id="${mentor.id}">
                <div class="mentor-header">
                    <div class="mentor-avatar">${mentor.avatar}</div>
                    <div class="mentor-info">
                        <h3>${mentor.name}${mentor.nameEn ? ` (${mentor.nameEn})` : ''}${mentor.nameAlt ? ` / ${mentor.nameAlt}` : ''}</h3>
                        <div class="mentor-specialties">
                            ${mentor.specialties.map(specialty => `<span class="specialty-tag">${specialty}</span>`).join('')}
                        </div>
                        <div class="mentor-rating">
                            ${'★'.repeat(Math.floor(mentor.rating))}${'☆'.repeat(5 - Math.floor(mentor.rating))}
                            <span>${mentor.rating}</span>
                            <span>(${mentor.sessions} sessions)</span>
                        </div>
                    </div>
                </div>
                <div class="mentor-description">${mentor.bio}</div>
                <div class="mentor-education">${educationText}</div>
                <div class="mentor-message" style="color: rgba(255, 255, 255, 0.8); font-style: italic; margin-bottom: 16px; font-size: 13px;">
                    "${mentor.message}"
                </div>
                <button class="book-session-btn" onclick="mentorPage.toggleMentorSelection(${mentor.id})">
                    ${isSelected ? 'Selected' : 'Select Mentor'}
                </button>
            </div>
        `;
    }

    setupEventListeners() {
        // Filter tabs
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                
                this.currentFilters.category = e.target.dataset.filter;
                this.loadMentors();
            });
        });

        // Search inputs
        const globalSearch = document.getElementById('globalSearchInput');
        const nameSearch = document.getElementById('nameSearchInput');

        if (globalSearch) {
            globalSearch.addEventListener('input', this.debounce((e) => {
                this.currentFilters.search = e.target.value;
                this.loadMentors();
            }, 300));
        }

        if (nameSearch) {
            nameSearch.addEventListener('input', this.debounce((e) => {
                this.currentFilters.nameSearch = e.target.value;
                this.loadMentors();
            }, 300));
        }

        // Filter checkboxes (delegated event handling)
        document.addEventListener('change', (e) => {
            if (e.target.type === 'checkbox' && e.target.dataset.filter) {
                this.handleFilterChange(e.target);
            }
        });

        // Navigation
        this.setupNavigation();
    }

    handleFilterChange(checkbox) {
        const filterType = checkbox.dataset.filter;
        const value = checkbox.value;

        if (filterType === 'category') {
            // Handle category as single selection
            document.querySelectorAll(`input[data-filter="category"]`).forEach(cb => {
                if (cb !== checkbox) cb.checked = false;
            });
            this.currentFilters.category = checkbox.checked ? value : 'all';
        } else {
            // Handle education and institution as multi-select
            if (checkbox.checked) {
                this.currentFilters[filterType].push(value);
            } else {
                this.currentFilters[filterType] = this.currentFilters[filterType].filter(v => v !== value);
            }
        }

        this.loadMentors();
    }

    toggleMentorSelection(mentorId) {
        if (this.selectedMentors.has(mentorId)) {
            this.selectedMentors.delete(mentorId);
        } else {
            this.selectedMentors.add(mentorId);
        }
        
        this.updateSelectionUI();
    }

    updateSelectionUI() {
        // Update mentor cards
        document.querySelectorAll('.mentor-card').forEach(card => {
            const mentorId = parseInt(card.dataset.mentorId);
            const isSelected = this.selectedMentors.has(mentorId);
            
            card.classList.toggle('selected', isSelected);
            
            const button = card.querySelector('.book-session-btn');
            button.textContent = isSelected ? 'Selected' : 'Select Mentor';
        });

        // Update selection bar
        this.updateSelectionBar();
    }

    updateSelectionBar() {
        const selectionBar = document.querySelector('.selection-bar');
        const selectedCount = document.querySelector('.selected-count');
        const selectedAvatars = document.querySelector('.selected-avatars');

        if (this.selectedMentors.size === 0) {
            selectionBar.classList.remove('show');
            return;
        }

        selectionBar.classList.add('show');
        selectedCount.textContent = `${this.selectedMentors.size} mentor${this.selectedMentors.size > 1 ? 's' : ''} selected`;

        // Show avatars of selected mentors
        const selectedMentorData = this.allMentors.filter(mentor => this.selectedMentors.has(mentor.id));
        selectedAvatars.innerHTML = selectedMentorData.map(mentor => `
            <div class="selected-avatar">${mentor.avatar}</div>
        `).join('');
    }

    setupNavigation() {
        // Navigation items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const page = item.dataset.page;
                this.handleNavigation(page);
            });
        });

        // Back to dashboard button
        const backBtn = document.querySelector('.create-prompt-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                window.location.href = '/';
            });
        }

        // Proceed button in selection bar
        const proceedBtn = document.querySelector('.proceed-btn');
        if (proceedBtn) {
            proceedBtn.addEventListener('click', () => {
                this.proceedWithSelectedMentors();
            });
        }
    }

    handleNavigation(page) {
        switch (page) {
            case 'dashboard':
                window.location.href = '/';
                break;
            case 'courses':
                window.location.href = '/course.html';
                break;
            case 'mentors':
                // Already on mentor page
                break;
            default:
                console.log(`Navigation to ${page} not implemented yet`);
        }
    }

    proceedWithSelectedMentors() {
        if (this.selectedMentors.size === 0) {
            alert('Please select at least one mentor to proceed.');
            return;
        }

        const selectedMentorData = this.allMentors.filter(mentor => this.selectedMentors.has(mentor.id));
        
        // For now, show an alert with selected mentors
        const mentorNames = selectedMentorData.map(mentor => mentor.name).join(', ');
        alert(`You've selected: ${mentorNames}\n\nThis would proceed to booking/consultation page.`);
        
        // TODO: Implement actual booking flow
    }

    showError(message) {
        const grid = document.getElementById('mentorsGrid');
        if (grid) {
            grid.innerHTML = `
                <div class="error-message" style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #ff6b6b;">
                    <p>${message}</p>
                </div>
            `;
        }
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.mentorPage = new MentorPage();
});

// Add some additional styles for the filter UI
const additionalStyles = `
<style>
.no-results {
    grid-column: 1 / -1;
    text-align: center;
    padding: 60px 20px;
    color: rgba(255, 255, 255, 0.6);
}

.no-results p {
    font-size: 18px;
    margin: 0;
}

.error-message {
    background: rgba(255, 107, 107, 0.1);
    border: 1px solid rgba(255, 107, 107, 0.3);
    border-radius: 12px;
    padding: 20px;
    margin: 20px 0;
}

.mentor-message {
    background: rgba(255, 255, 255, 0.05);
    border-left: 3px solid rgba(102, 126, 234, 0.5);
    padding: 12px;
    margin: 12px 0;
    border-radius: 8px;
    font-size: 13px;
    color: rgba(255, 255, 255, 0.8);
    font-style: italic;
}

#institutionFilters {
    max-height: 200px;
    overflow-y: auto;
}

#institutionFilters::-webkit-scrollbar {
    width: 6px;
}

#institutionFilters::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
}

#institutionFilters::-webkit-scrollbar-thumb {
    background: rgba(102, 126, 234, 0.5);
    border-radius: 3px;
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', additionalStyles); 