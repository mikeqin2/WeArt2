// Onboarding Data Collection System
class OnboardingData {
    constructor() {
        this.data = this.loadData();
    }

    loadData() {
        const stored = localStorage.getItem('weart-onboarding-data');
        return stored ? JSON.parse(stored) : {
            colorSelection: null,
            pathSelection: null, 
            learningGoals: [],
            artMediums: [],
            completedAt: null
        };
    }

    saveData() {
        localStorage.setItem('weart-onboarding-data', JSON.stringify(this.data));
        console.log('🎯 Onboarding data saved:', this.data);
    }

    updateColorSelection(selection) {
        this.data.colorSelection = selection;
        this.saveData();
    }

    updatePathSelection(selection) {
        this.data.pathSelection = selection;
        this.saveData();
    }

    updateLearningGoals(goals) {
        this.data.learningGoals = Array.isArray(goals) ? goals : [goals];
        this.saveData();
    }

    updateArtMediums(mediums) {
        this.data.artMediums = Array.isArray(mediums) ? mediums : [mediums];
        this.saveData();
    }

    completeOnboarding() {
        this.data.completedAt = new Date().toISOString();
        this.saveData();
    }

    isComplete() {
        return this.data.completedAt !== null && 
               this.data.colorSelection !== null &&
               this.data.pathSelection !== null &&
               this.data.learningGoals.length > 0 &&
               this.data.artMediums.length > 0;
    }

    getData() {
        return { ...this.data };
    }

    reset() {
        this.data = {
            colorSelection: null,
            pathSelection: null,
            learningGoals: [],
            artMediums: [],
            completedAt: null
        };
        this.saveData();
    }
}

// Make it available globally
window.OnboardingData = OnboardingData;

// Debug function
window.debugOnboarding = function() {
    console.log('🐛 Debug - Creating test onboarding data');
    
    const testData = new OnboardingData();
    testData.updateColorSelection('exploration');
    testData.updatePathSelection('boss');
    testData.updateLearningGoals(['expression', 'product']);
    testData.updateArtMediums(['digital', 'painting']);
    testData.completeOnboarding();
    
    console.log('✅ Created test data:', testData.getData());
    
    // Reset first visit flag
    localStorage.setItem('weart-ai-first-visit', 'true');
    
    console.log('🔄 Ready to test - go to ai.html to see personalized intro');
};

console.log('📦 Onboarding.js loaded successfully');