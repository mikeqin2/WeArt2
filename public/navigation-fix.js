// Navigation Fix for WeArt Dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Fix course navigation (from dashboard to course)
    const courseNavItem = document.querySelector('[data-page="courses"]');
    if (courseNavItem) {
        courseNavItem.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
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
            window.location.href = '/';
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
    
    // Add click handlers for all nav items
    const allNavItems = document.querySelectorAll('.nav-item[data-page]');
    allNavItems.forEach(item => {
        const page = item.getAttribute('data-page');
        item.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            switch(page) {
                case 'dashboard':
                    window.location.href = '/';
                    break;
                case 'courses':
                    window.location.href = '/course.html';
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
    
    console.log('Navigation fix applied for all pages!');
});
