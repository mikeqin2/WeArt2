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
        this.data.learningGoals = goals;
        this.saveData();
    }

    updateArtMediums(mediums) {
        this.data.artMediums = mediums;
        this.saveData();
    }

    completeOnboarding() {
        this.data.completedAt = new Date().toISOString();
        this.saveData();
    }

    generateAIPrompt() {
        const { colorSelection, pathSelection, learningGoals, artMediums } = this.data;
        
        // Map selections to descriptive text
        const colorMap = {
            prosperity: "focused on commercial success and building a sustainable art career",
            connections: "interested in building meaningful relationships and collaborating with other artists", 
            exploration: "driven by curiosity and a desire to experiment with new creative frontiers"
        };

        const pathMap = {
            elementary: "elementary school student with fresh curiosity about art",
            middle: "middle school student discovering their artistic interests",
            high: "high school student preparing for potential art studies",
            parent: "parent looking to support their child's artistic development or explore art personally",
            elderly: "mature learner embracing art as a new chapter in life",
            boss: "professional seeking art as creative fulfillment and stress relief"
        };

        const goalMap = {
            abroad: "pursuing international art education opportunities",
            collection: "building knowledge about art collection and appreciation",
            sentiment: "using art for emotional enrichment and personal growth",
            direction: "seeking clarity on life direction through creative expression",
            expression: "focusing on personal creative expression and storytelling",
            product: "developing skills to create independent artistic products",
            appreciation: "learning to analyze and appreciate different art forms",
            education: "pursuing formal art education and structured learning"
        };

        const mediumMap = {
            painting: "traditional painting techniques and materials",
            digital: "digital art creation and modern tools",
            photography: "photographic composition and visual storytelling",
            music: "musical composition and sound art",
            sculpture: "three-dimensional art and sculptural techniques",
            mixed: "multimedia approaches and experimental combinations"
        };

        let prompt = `You are WeArt's AI Assistant, and you're meeting a new user for the first time. Based on their onboarding choices, provide a warm, personalized introduction and learning plan.

USER PROFILE:
- Creative Vision: ${colorSelection ? colorMap[colorSelection] : 'not specified'}
- Background: ${pathSelection ? pathMap[pathSelection] : 'not specified'}
- Learning Goals: ${learningGoals.length > 0 ? learningGoals.map(goal => goalMap[goal]).join(', ') : 'not specified'}
- Interested Mediums: ${artMediums.length > 0 ? artMediums.map(medium => mediumMap[medium]).join(', ') : 'not specified'}

Please:
1. Give a warm, personalized greeting that acknowledges their specific choices
2. Create a customized 4-6 week learning plan based on their selections
3. Suggest 2-3 specific first steps they can take today
4. Mention relevant resources, courses, or community features on WeArt
5. End by directing them to explore the main dashboard where they can access courses, connect with mentors, and join the community

Keep the tone encouraging, specific to their choices, and actionable. Make it feel like you truly understand their artistic journey and goals.`;

        return prompt;
    }

    isComplete() {
        return this.data.colorSelection && 
               this.data.pathSelection && 
               this.data.learningGoals.length > 0 && 
               this.data.artMediums.length > 0;
    }

    getData() {
        return this.data;
    }

    clear() {
        localStorage.removeItem('weart-onboarding-data');
        this.data = {
            colorSelection: null,
            pathSelection: null,
            learningGoals: [],
            artMediums: [],
            completedAt: null
        };
    }
}

// Make it globally available
window.OnboardingData = OnboardingData;