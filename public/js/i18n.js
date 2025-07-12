// WeArt Internationalization System
class WeArtI18n {
    constructor() {
        this.currentLanguage = this.getStoredLanguage() || this.detectLanguage();
        this.translations = {};
        this.loadTranslations();
        this.init();
    }

    // Get stored language from localStorage
    getStoredLanguage() {
        return localStorage.getItem('weart-language');
    }

    // Detect language from browser or page lang attribute
    detectLanguage() {
        const htmlLang = document.documentElement.lang;
        if (htmlLang === 'zh-CN') return 'zh';
        if (htmlLang === 'en') return 'en';
        
        const browserLang = navigator.language || navigator.userLanguage;
        return browserLang.startsWith('zh') ? 'zh' : 'en';
    }

    // Load translations
    loadTranslations() {
        this.translations = {
            en: {
                // Common UI elements
                'weart': 'WeArt',
                'continue': 'Continue',
                'loading': 'Loading...',
                'search': 'Search',
                'online': 'Online',
                'dashboard': 'Dashboard',
                'explore': 'Explore',
                'courses': 'Courses',
                'community': 'Community',
                'mentors': 'Mentors',
                'profile': 'Profile',
                'create_prompt': 'Create Prompt',
                'ai_assistant': 'AI Assistant',
                'skip_intro': 'Skip Intro',
                'begin_journey': 'Begin Your Journey',
                'loading_cosmic': 'Loading cosmic universe...',
                'skip_for_now': 'Skip for now',

                // Register page
                'join_art_community': 'Join Art Community',
                'explore_infinite_creativity': 'Explore infinite creativity, connect with the art world',
                'name': 'Name',
                'email': 'Email',
                'phone': 'Phone',
                'enter_name': 'Please enter your name',
                'enter_email': 'Please enter your email',
                'enter_phone': 'Please enter your phone number',
                'join_now': 'Join Now',
                'have_account': 'Already have an account?',
                'login_now': 'Login Now',
                'user_login': 'User Login',
                'password_optional': 'Password (Optional)',
                'enter_password': 'If you have set a password, please enter it',

                // Dashboard
                'your_creative_journey': 'Your Creative Journey Today',
                'day_streak': 'DAY STREAK',
                'xp_points': 'XP',
                'commercial_illustration': 'Commercial\nIllustration',
                'environment_architecture': 'Environment &\nArchitecture',
                'global_art_styles': 'Global Art\nStyles',
                'trending_prompts': 'Trending Prompts',
                'continue_learning': 'Continue Learning',
                'landscape_painting_basics': 'Landscape Painting Basics',
                'ask_art_techniques': 'Ask about art techniques, history, or courses...',

                // Intro page
                'welcome_artmind': 'Welcome to ArtMind',
                'journey_universe': 'Your journey into the universe of AI-powered art education begins here',

                // Color selection
                'choose_cosmic_path': 'Choose Your Cosmic Path',
                'select_vision': 'Select the vision that resonates with your artistic journey',

                // Path selection
                'choose_your_path': 'Choose Your Path',
                'upload_file': 'Click or drag files here',
                'upload_resume': 'Upload Resume',
                'or': 'OR',

                // Learning goals
                'map_artistic_constellation': 'Map Your Artistic Constellation',
                'plan_art_constellation': 'Plan Your Art Constellation',
                'art_abroad': 'Art Abroad',
                'art_collection': 'Art Collection',
                'cultivating_sentiment': 'Cultivating Sentiment',
                'finding_life_direction': 'Finding Life Direction',
                'creative_expression': 'Creative Expression',
                'independent_product': 'Independent Product',
                'learning_appreciation': 'Learning Appreciation',
                'institutional_education': 'Institutional Education',

                // Art medium selection
                'select_art_medium': 'Select Your Art Medium',
                'digital_art': 'Digital Art',
                'traditional_painting': 'Traditional Painting',
                'sculpture': 'Sculpture',
                'photography': 'Photography',
                'music': 'Music',
                'literature': 'Literature',
                'fashion_design': 'Fashion Design',
                'cinema': 'Cinema',
                'theatre': 'Theatre',
                'dance': 'Dance',
                'mixed_media': 'Mixed Media',

                // Auth page
                'join_creative_community': 'Join the Creative Community',
                'discover_learn_create': 'Discover, learn, and create with artists from around the world',
                'learn_expert_mentors': 'Learn from expert mentors',
                'connect_artists_globally': 'Connect with artists globally',
                'ai_creative_guidance': 'Get AI-powered creative guidance',
                'showcase_artwork': 'Showcase your artwork',

                // AI Chat
                'recent_conversations': 'Recent Conversations',
                'getting_started_oil': 'Getting Started with Oil Painting',
                'color_theory_basics': 'Color Theory Basics',
                'renaissance_exploration': 'Renaissance Art Exploration',
                'digital_art_techniques': 'Digital Art Techniques',
                'watercolor_landscape': 'Watercolor Landscape Tips',

                // Language toggle
                'language': 'Language',
                'english': 'English',
                'chinese': 'Chinese',

                // New dashboard elements
                'explore_categories': 'Explore Categories',
                'quick_actions': 'Quick Actions',
                'view_courses': 'View Courses',
                'find_mentors': 'Find Mentors',
                'explore_art': 'Explore Art',
                'personalized_guidance': 'Personalized Guidance',
                
                // Explore page translations
                'search_artworks': 'Search artworks, artists...',
                'share_artwork': 'Share Artwork',
                'filter_artworks': 'Filter Artworks',
                'all_artworks': 'All Artworks',
                'trending': 'Trending',
                'recent': 'Recent',
                'art_categories': 'Categories',
                'abstract_art': 'Abstract Art',
                'photography': 'Photography',
                'sculpture': 'Sculpture',
                'fashion_design': 'Fashion Design',
                'traditional_art': 'Traditional Art',
                'engagement': 'Engagement',
                'most_liked': 'Most Liked',
                'most_commented': 'Most Commented',
                'grid_view': 'Grid',
                'list_view': 'List',
                'sort_by': 'Sort by',
                'newest_first': 'Newest First',
                'oldest_first': 'Oldest First',
                'most_popular': 'Most Popular',
                'most_discussed': 'Most Discussed',
                'loading_artworks': 'Loading amazing artworks...',

                // Course page translations
                'course_player': 'Course Player',
                'search_courses': 'Search courses, lessons...',
                'back_to_dashboard': 'Back to Dashboard',
                'intermediate': 'Intermediate',
                'total_hours': '12 hours total',
                'total_lessons': '24 lessons',
                'course_description': 'Learn advanced digital painting techniques from professional artist Sarah Johnson. This comprehensive course covers color theory, composition, lighting, and specialized techniques for creating stunning digital artwork.',
                'completed': 'Completed',
                'in_progress': 'In progress',
                'not_started': 'Not started',
                'lesson': 'Lesson %s',

                // Mentor page translations
                'mentors_title': 'WeArt Mentors',
                'search_mentors': 'Search mentors...',
                'choose_guiding_star': 'Choose Your Guiding Star',
                'all_disciplines': 'All Disciplines',
                'design': 'Design',
                'music': 'Music',
                'literature': 'Literature',
                'philosophy': 'Philosophy',
                'filter': 'Filter',
                'search_by_name': 'Search by name...',
                'discipline': 'Discipline',
                'education_level': 'Education Level',
                'phd': 'PhD',
                'masters': 'Masters',
                'bachelors': 'Bachelors',
                'experience_level': 'Experience Level',
                'expert': 'Expert',
                'senior': 'Senior',
                'mid_level': 'Mid Level',
                'junior': 'Junior',
                'rating': 'Rating',
                'sort_by_rating': 'Sort by Rating',
                'sort_by_name': 'Sort by Name',
                'view_profile': 'View Profile',
                'years_experience': '%s years experience',
                'students': '%s students',
                'rating_out_of_5': '%s/5',
                'specializes_in': 'Specializes in %s',

                // Course page translations
                'courses_title': 'WeArt Courses',
                'discover_courses': 'Discover Your Creative Path',
                'courses_subtitle': 'Unlock your artistic potential with expert-led courses designed to inspire and educate',
                'back_to_courses': 'Back to Courses',
                'download_materials': 'Download Materials',
                'course_content': 'Course Content',

                // Updated course content
                'modernity_artistic_expression': 'Modernity and Artistic Expression',
                'philosophy_art_life': 'Philosophy of Art and Life',
                'aesthetics_literary_criticism': 'Aesthetics and Literary Criticism',
                'instructor_kaiming': 'Dr. Kaiming Zhang',
                'instructor_duoge': 'Prof. Duoge Ma',
                'instructor_bing': 'Dr. Bing Zhang',
                'beginner': 'Beginner',
                'advanced': 'Advanced',
                'intermediate': 'Intermediate',
                'duration_60min': '60 minutes',
                'duration_75min': '75 minutes',
                'duration_90min': '90 minutes',
                'duration_8weeks': '8 weeks',
                'duration_6weeks': '6 weeks',
                'duration_10weeks': '10 weeks',
                'course_description_kaiming': 'Explore the relationship between modernity, trauma, and artistic expression. This advanced seminar examines how contemporary culture reflects symptoms of modern life through literary and visual analysis, drawing connections between historical trauma and postmodern aesthetics.',
                'course_description_duoge': 'Discover what it truly means to live as an artist. This philosophical exploration examines the relationship between artistic practice and way of life, drawing from Foucault\'s concepts of truth and self-creation, and Duchamp\'s vision of life as art.',
                'course_description_bing': 'A deep dive into the complex relationship between beauty and trauma in literary works. Examine how aesthetic experience can both elevate and complicate our understanding of difficult subjects, with focus on contemporary Chinese literature and critical theory.',
                'short_desc_kaiming': 'Cultural analysis of modernity and trauma in art',
                'short_desc_duoge': 'Philosophical exploration of artistic living',
                'short_desc_bing': 'Critical analysis of beauty, trauma, and literature',
                'cultural_theory': 'Cultural Theory',
                'modern_art': 'Modern Art',
                'literary_analysis': 'Literary Analysis',
                'philosophy': 'Philosophy',
                'art_theory': 'Art Theory',
                'life_practice': 'Life Practice',
                'self_development': 'Self-Development',
                'literary_criticism': 'Literary Criticism',
                'aesthetics': 'Aesthetics',
                'contemporary_lit': 'Contemporary Literature',
                'critical_theory': 'Critical Theory',
                
                // Email verification flow
                'fill_required_fields': 'Please fill in all required fields',
                'registration_success': 'Registration successful! Welcome to WeArt art community',
                'login_success': 'Login successful! Welcome back',
                'registration_failed': 'Registration failed. Please try again.',
                'email_exists': 'An account with this email already exists. Please try logging in instead.',
                'login_failed': 'Login failed. Please check your credentials and try again.',
                'invalid_email': 'No account found with this email. Please register first.',
                'enter_email_address': 'Please enter your email address',
                'send_verification': 'Send Verification Code',
                'verify_email': 'Verify Email',
                'verification_sent': 'We have sent a verification code to',
                'verification_sent_end': '',
                'demo_code': 'Demo Code: ',
                'no_code': 'Did not receive the code?',
                'resend': 'Resend',
                'back': 'Back',
                'complete_registration': 'Complete Registration',
                'invalid_code': 'Invalid verification code. Please try again.',
                'code_sent': 'Verification code sent!',
                
                // Learning Path feature
                'your_learning_path': 'Your Personalized Learning Path',
                'ai_generated_path': 'AI-generated based on your preferences and goals',
                'regenerate_path': 'Regenerate Learning Path'
            },
            zh: {
                // Common UI elements
                'weart': 'WeArt',
                'continue': '继续',
                'loading': '加载中...',
                'search': '搜索',
                'online': '在线',
                'dashboard': '仪表板',
                'explore': '探索',
                'courses': '课程',
                'community': '社区',
                'mentors': '导师',
                'profile': '个人资料',
                'create_prompt': '创建提示',
                'ai_assistant': 'AI助手',
                'skip_intro': '跳过介绍',
                'begin_journey': '开始您的旅程',
                'loading_cosmic': '正在加载宇宙...',
                'skip_for_now': '现在跳过',

                // Register page
                'join_art_community': '加入艺术社群',
                'explore_infinite_creativity': '探索无限创意，连接艺术世界',
                'name': '姓名',
                'email': '邮箱',
                'phone': '电话',
                'enter_name': '请输入您的姓名',
                'enter_email': '请输入您的邮箱',
                'enter_phone': '请输入您的电话号码',
                'join_now': '立即加入',
                'have_account': '已有账号？',
                'login_now': '立即登录',
                'user_login': '用户登录',
                'password_optional': '密码（可选）',
                'enter_password': '如果您设置了密码，请输入',

                // Dashboard
                'your_creative_journey': '您今天的创意之旅',
                'day_streak': '连续天数',
                'xp_points': '经验值',
                'commercial_illustration': '商业\n插画',
                'environment_architecture': '环境与\n建筑',
                'global_art_styles': '全球艺术\n风格',
                'trending_prompts': '热门提示',
                'continue_learning': '继续学习',
                'landscape_painting_basics': '风景画基础',
                'ask_art_techniques': '询问艺术技巧、历史或课程...',

                // Intro page
                'welcome_artmind': '欢迎来到ArtMind',
                'journey_universe': '您进入AI驱动艺术教育宇宙的旅程从这里开始',

                // Color selection
                'choose_cosmic_path': '选择您的宇宙路径',
                'select_vision': '选择与您艺术旅程共鸣的愿景',

                // Path selection
                'choose_your_path': '选择你的路径',
                'upload_file': '点击或拖拽文件至此处',
                'upload_resume': '上传简历',
                'or': '或',

                // Learning goals
                'map_artistic_constellation': '规划您的艺术星图',
                'plan_art_constellation': '规划你的艺术星图',
                'art_abroad': '艺术留学',
                'art_collection': '艺术收藏',
                'cultivating_sentiment': '陶冶情操',
                'finding_life_direction': '寻找人生方向',
                'creative_expression': '创意表达',
                'independent_product': '自主创作产品',
                'learning_appreciation': '学习鉴赏',
                'institutional_education': '机构教育',

                // Art medium selection
                'select_art_medium': '选择您的艺术媒介',
                'digital_art': '数字艺术',
                'traditional_painting': '传统绘画',
                'sculpture': '雕塑',
                'photography': '摄影',
                'music': '音乐',
                'literature': '文学',
                'fashion_design': '时尚设计',
                'cinema': '电影',
                'theatre': '戏剧',
                'dance': '舞蹈',
                'mixed_media': '混合媒体',

                // Auth page
                'join_creative_community': '加入创意社区',
                'discover_learn_create': '与来自世界各地的艺术家一起发现、学习和创作',
                'learn_expert_mentors': '向专家导师学习',
                'connect_artists_globally': '与全球艺术家联系',
                'ai_creative_guidance': '获得AI驱动的创意指导',
                'showcase_artwork': '展示您的艺术作品',

                // AI Chat
                'recent_conversations': '最近对话',
                'getting_started_oil': '油画入门',
                'color_theory_basics': '色彩理论基础',
                'renaissance_exploration': '文艺复兴艺术探索',
                'digital_art_techniques': '数字艺术技巧',
                'watercolor_landscape': '水彩风景画技巧',

                // Language toggle
                'language': '语言',
                'english': 'English',
                'chinese': '中文',

                // New dashboard elements
                'explore_categories': '探索类别',
                'quick_actions': '快速操作',
                'view_courses': '查看课程',
                'find_mentors': '寻找导师',
                'explore_art': '探索艺术',
                'personalized_guidance': '个性化指导',
                
                // Explore page translations
                'search_artworks': '搜索艺术品、艺术家...',
                'share_artwork': '分享作品',
                'filter_artworks': '筛选作品',
                'all_artworks': '所有作品',
                'trending': '热门',
                'recent': '最新',
                'art_categories': '类别',
                'abstract_art': '抽象艺术',
                'photography': '摄影',
                'sculpture': '雕塑',
                'fashion_design': '时尚设计',
                'traditional_art': '传统艺术',
                'engagement': '互动',
                'most_liked': '最受欢迎',
                'most_commented': '最受欢迎',
                'grid_view': '网格',
                'list_view': '列表',
                'sort_by': '排序方式',
                'newest_first': '最新优先',
                'oldest_first': '最早优先',
                'most_popular': '最受欢迎',
                'most_discussed': '最受欢迎',
                'loading_artworks': '加载精彩作品...',

                // Course page translations
                'course_player': '课程播放器',
                'search_courses': '搜索课程、课时...',
                'back_to_dashboard': '返回仪表板',
                'intermediate': '中级',
                'total_hours': '总共12小时',
                'total_lessons': '共24课时',
                'course_description': '向专业艺术家Sarah Johnson学习高级数字绘画技巧。这个综合课程涵盖色彩理论、构图、照明和创建出色数字艺术作品的专业技巧。',
                'completed': '已完成',
                'in_progress': '进行中',
                'not_started': '未开始',
                'lesson': '第%s课',

                // Mentor page translations
                'mentors_title': 'WeArt导师',
                'search_mentors': '搜索导师...',
                'choose_guiding_star': '选择您的引路星',
                'all_disciplines': '所有学科',
                'design': '设计',
                'music': '音乐',
                'literature': '文学',
                'philosophy': '哲学',
                'filter': '筛选',
                'search_by_name': '按姓名搜索...',
                'discipline': '学科',
                'education_level': '教育水平',
                'phd': '博士',
                'masters': '硕士',
                'bachelors': '学士',
                'experience_level': '经验水平',
                'expert': '专家',
                'senior': '资深',
                'mid_level': '中级',
                'junior': '初级',
                'rating': '评分',
                'sort_by_rating': '按评分排序',
                'sort_by_name': '按名称排序',
                'view_profile': '查看个人资料',
                'years_experience': '%s年经验',
                'students': '%s学生',
                'rating_out_of_5': '%s/5',
                'specializes_in': '专长于%s',

                // Course page translations
                'courses_title': 'WeArt课程',
                'discover_courses': '发现您的创意之路',
                'courses_subtitle': '通过专家指导的课程，解锁您的艺术潜力，激发灵感并教育',
                'back_to_courses': '返回课程',
                'download_materials': '下载材料',
                'course_content': '课程内容',

                // Updated course content
                'modernity_artistic_expression': '现代性与艺术表达',
                'philosophy_art_life': '艺术与生活的哲学',
                'aesthetics_literary_criticism': '美学与文学批评',
                'instructor_kaiming': '张开明博士',
                'instructor_duoge': '马多格教授',
                'instructor_bing': '张冰博士',
                'beginner': '初学者',
                'advanced': '高级',
                'intermediate': '中级',
                'duration_60min': '60分钟',
                'duration_75min': '75分钟',
                'duration_90min': '90分钟',
                'duration_8weeks': '8周',
                'duration_6weeks': '6周',
                'duration_10weeks': '10周',
                'course_description_kaiming': '探索现代性、创伤与艺术表达之间的关系。本高级研讨会探讨当代文化如何通过文学和视觉分析反映现代生活的症状，并探讨历史创伤与后现代美学之间的联系。',
                'course_description_duoge': '发现作为艺术家的真正意义。本哲学探索考察艺术实践与生活方式之间的关系，从福柯的概念（真理与自我创造）和杜尚的愿景（生活即艺术）中汲取灵感。',
                'course_description_bing': '深入探讨文学作品中美丽与创伤的复杂关系。考察审美体验如何既能提升又能使我们对困难主题的理解复杂化，重点关注当代中国文学和批评理论。',
                'short_desc_kaiming': '艺术中的现代性与创伤文化分析',
                'short_desc_duoge': '艺术生活的哲学探索',
                'short_desc_bing': '文学、美丽与创伤的批判性分析',
                'cultural_theory': '文化理论',
                'modern_art': '现代艺术',
                'literary_analysis': '文学分析',
                'philosophy': '哲学',
                'art_theory': '艺术理论',
                'life_practice': '生活实践',
                'self_development': '自我发展',
                'literary_criticism': '文学批评',
                'aesthetics': '美学',
                'contemporary_lit': '当代文学',
                'critical_theory': '批评理论',
                
                // Email verification flow
                'fill_required_fields': '请填写所有必填字段',
                'registration_success': '注册成功！欢迎来到WeArt艺术社区',
                'login_success': '登录成功！欢迎回来',
                'registration_failed': '注册失败，请重试。',
                'email_exists': '此邮箱已存在，请尝试登录。',
                'login_failed': '登录失败，请检查您的凭据并重试。',
                'invalid_email': '未找到此邮箱，请先注册。',
                'enter_email_address': '请输入您的邮箱地址',
                'send_verification': '发送验证码',
                'verify_email': '验证邮箱',
                'verification_sent': '我们已向',
                'verification_sent_end': '发送了验证码',
                'demo_code': '演示码：',
                'no_code': '未收到验证码？',
                'resend': '重新发送',
                'back': '返回',
                'complete_registration': '完成注册',
                'invalid_code': '无效的验证码，请重试。',
                'code_sent': '验证码已发送！',
                
                // Learning Path feature
                'your_learning_path': '您的个性化学习路径',
                'ai_generated_path': '基于您的偏好和目标生成的AI学习路径',
                'regenerate_path': '重新生成学习路径'
            }
        };
    }

    // Initialize the i18n system
    init() {
        this.updatePageLanguage();
        this.translatePage();
        this.createLanguageToggle();
    }

    // Update HTML lang attribute
    updatePageLanguage() {
        document.documentElement.lang = this.currentLanguage === 'zh' ? 'zh-CN' : 'en';
    }

    // Get translation for a key
    t(key, defaultValue = key) {
        return this.translations[this.currentLanguage]?.[key] || defaultValue;
    }

    // Translate the entire page
    translatePage() {
        // Translate elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            element.textContent = this.t(key);
        });

        // Translate placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            element.placeholder = this.t(key);
        });

        // Translate titles
        document.querySelectorAll('[data-i18n-title]').forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            element.title = this.t(key);
        });

        // Update page title
        const titleKey = document.body.getAttribute('data-page-title');
        if (titleKey) {
            document.title = this.t(titleKey);
        }
    }

    // Create language toggle button
    createLanguageToggle() {
        // Check if language toggle already exists
        if (document.getElementById('language-toggle')) {
            return;
        }

        const toggle = document.createElement('div');
        toggle.id = 'language-toggle';
        toggle.className = 'language-toggle';
        toggle.innerHTML = `
            <button class="language-btn" id="language-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2zm0 18c4.41 0 8-3.59 8-8s-3.59-8-8-8-8 3.59 8 8 3.59 8 8 8z"/>
                    <path d="M12 6c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6 2.69-6 6-6z"/>
                </svg>
                <span>${this.currentLanguage === 'zh' ? '中文' : 'English'}</span>
            </button>
            <div class="language-dropdown" id="language-dropdown">
                <div class="language-option ${this.currentLanguage === 'en' ? 'active' : ''}" data-lang="en">
                    🇺🇸 English
                </div>
                <div class="language-option ${this.currentLanguage === 'zh' ? 'active' : ''}" data-lang="zh">
                    🇨🇳 中文
                </div>
            </div>
        `;

        // Add CSS styles
        const style = document.createElement('style');
        style.textContent = `
            .language-toggle {
                position: fixed;
                bottom: 20px;
                left: 20px;
                z-index: 10000;
            }

            .language-btn {
                display: flex;
                align-items: center;
                gap: 8px;
                background: rgba(0, 0, 0, 0.6);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(255, 255, 255, 0.15);
                border-radius: 12px;
                padding: 10px 14px;
                color: #fff;
                font-size: 13px;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            }

            .language-btn:hover {
                background: rgba(0, 0, 0, 0.8);
                border-color: rgba(78, 241, 255, 0.4);
                transform: translateY(-1px);
            }

            .language-dropdown {
                position: absolute;
                bottom: calc(100% + 8px);
                left: 0;
                background: rgba(0, 0, 0, 0.9);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(255, 255, 255, 0.15);
                border-radius: 12px;
                overflow: hidden;
                opacity: 0;
                visibility: hidden;
                transform: translateY(10px);
                transition: all 0.3s ease;
                min-width: 140px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
            }

            .language-dropdown.show {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }

            .language-option {
                padding: 12px 16px;
                color: #fff;
                cursor: pointer;
                transition: background 0.2s ease;
                font-size: 13px;
                white-space: nowrap;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .language-option:hover {
                background: rgba(255, 255, 255, 0.1);
            }

            .language-option.active {
                background: rgba(78, 241, 255, 0.2);
                color: #4EF1FF;
            }

            /* Responsive positioning */
            @media (max-width: 768px) {
                .language-toggle {
                    bottom: 15px;
                    left: 15px;
                }
                
                .language-btn {
                    padding: 8px 12px;
                    font-size: 12px;
                }
            }
        `;
        document.head.appendChild(style);

        // Add toggle to page
        document.body.appendChild(toggle);

        // Add event listeners
        const languageBtn = document.getElementById('language-btn');
        const languageDropdown = document.getElementById('language-dropdown');

        languageBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            languageDropdown.classList.toggle('show');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            languageDropdown.classList.remove('show');
        });

        // Handle language selection
        document.querySelectorAll('.language-option').forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const lang = option.getAttribute('data-lang');
                this.switchLanguage(lang);
                languageDropdown.classList.remove('show');
            });
        });
    }

    // Switch language
    switchLanguage(lang) {
        if (lang !== this.currentLanguage) {
            this.currentLanguage = lang;
            localStorage.setItem('weart-language', lang);
            this.updatePageLanguage();
            this.translatePage();
            
            // Update language button text
            const languageBtn = document.querySelector('#language-btn span');
            if (languageBtn) {
                languageBtn.textContent = lang === 'zh' ? '中文' : 'English';
            }

            // Update active state in dropdown
            document.querySelectorAll('.language-option').forEach(option => {
                option.classList.remove('active');
                if (option.getAttribute('data-lang') === lang) {
                    option.classList.add('active');
                }
            });

            // Emit language change event
            window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
        }
    }

    // Get current language
    getCurrentLanguage() {
        return this.currentLanguage;
    }
}

// Initialize i18n system when DOM is loaded
let weartI18n;
document.addEventListener('DOMContentLoaded', () => {
    weartI18n = new WeArtI18n();
    window.weartI18n = weartI18n;
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WeArtI18n;
} 