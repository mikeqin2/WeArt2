// Navigation Fix for WeArt Dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Fix course navigation
    const courseNavItem = document.querySelector('[data-page="courses"]');
    if (courseNavItem) {
        courseNavItem.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            window.location.href = '/course.html';
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
    
    console.log('Navigation fix applied!');
});
