// Navigation Fix for WeArt Dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Function to clear all active states
    function clearActiveStates() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
    }

    // Function to set active state based on current page
    function setActiveStateForCurrentPage() {
        const currentPath = window.location.pathname;
        let activeDataPage = 'dashboard'; // default
        
        if (currentPath.includes('explore.html')) {
            activeDataPage = 'community';
        } else if (currentPath.includes('course.html')) {
            activeDataPage = 'courses';
        } else if (currentPath.includes('mentor.html')) {
            activeDataPage = 'mentors';
        } else if (currentPath === '/' || currentPath.includes('index.html')) {
            activeDataPage = 'dashboard';
        }
        
        // Clear all active states first
        clearActiveStates();
        
        // Set active state for current page
        const activeNavItem = document.querySelector(`[data-page="${activeDataPage}"]`);
        if (activeNavItem) {
            activeNavItem.classList.add('active');
        }
    }

    // Set initial active state
    setActiveStateForCurrentPage();

    // Fix course navigation (from dashboard to course)
    const courseNavItem = document.querySelector('[data-page="courses"]');
    if (courseNavItem) {
        courseNavItem.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            clearActiveStates();
            this.classList.add('active');
            window.location.href = '/course.html';
            return false;
        };
    }
    
    // Fix dashboard navigation (from course to dashboard)
    const dashboardNavItem = document.querySelector('[data-page="dashboard"]');
    if (dashboardNavItem) {
        dashboardNavItem.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            clearActiveStates();
            this.classList.add('active');
            window.location.href = '/';
            return false;
        };
    }
    
    // Fix mentors navigation
    const mentorsNavItem = document.querySelector('[data-page="mentors"]');
    if (mentorsNavItem) {
        mentorsNavItem.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            clearActiveStates();
            this.classList.add('active');
            window.location.href = '/mentor.html';
            return false;
        };
    }

    // Fix learning card navigation
    const learningCard = document.querySelector('.learning-card');
    if (learningCard) {
        learningCard.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            window.location.href = '/course.html';
            return false;
        };
    }
    
    // Add click handlers for all nav items that don't have onclick handlers
    const allNavItems = document.querySelectorAll('.nav-item[data-page]:not([onclick])');
    allNavItems.forEach(item => {
        const page = item.getAttribute('data-page');
        item.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Clear all active states first
            clearActiveStates();
            // Set this item as active
            this.classList.add('active');
            
            switch(page) {
                case 'dashboard':
                    window.location.href = '/';
                    break;
                case 'explore':
                    window.location.href = '/explore.html';
                    break;
                case 'courses':
                    window.location.href = '/course.html';
                    break;
                case 'community':
                    window.location.href = '/explore.html';
                    break;
                case 'mentors':
                    window.location.href = '/mentor.html';
                    break;
                default:
                    console.log(`${page} page not yet implemented`);
                    break;
            }
        });
    });
    
    console.log('Navigation fix applied for all pages with active state management!');
});
