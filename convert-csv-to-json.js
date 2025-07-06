const fs = require('fs');
const path = require('path');

// Manual mentor data based on CSV
const mentorData = [
  {
    id: 1,
    name: "李蕙廷",
    education: [
      { degree: "博士", institution: "清华大学美术学院" },
      { degree: "硕士", institution: "美国帕森斯设计学院" }
    ],
    bio: "主修服装设计、面料设计，2017年创立独立设计师品牌，在服装设计实践和理论研究方面具有丰富的经验。",
    specialties: ["服装设计", "面料设计"],
    categories: ["design"],
    message: "服装设计是一门融合了技术与艺术的学科，它需要扎实的专业基础与艺术素养。希望同学们在学习与实践中倾听心灵的声音，展现创意和审美，探索服装设计新的可能性。",
    rating: 4.9,
    sessions: 156,
    avatar: "LH"
  },
  {
    id: 2,
    name: "张冰",
    education: [
      { degree: "博士", institution: "中国政法大学" },
      { degree: "硕士", institution: "中国政法大学" }
    ],
    bio: "社会学学者，媒体编导，定期进行主题沙龙演讲与特稿访谈。",
    specialties: ["文学", "社会学", "社会学原著选读", "艺术与生命问题漫谈"],
    categories: ["literature", "philosophy"],
    message: "去一切的边缘涉险，爱，玩笑般地创造，美丽与恶心。",
    rating: 4.7,
    sessions: 89,
    avatar: "ZB"
  },
  {
    id: 3,
    name: "张凯铭",
    nameEn: "Devin",
    education: [
      { degree: "硕士", institution: "The New School" },
      { degree: "学士", institution: "Furman University" }
    ],
    bio: "哲学学者，助理教授，参与哲学研究与书籍编制、学术会议与发表。",
    specialties: ["德勒兹的电影哲学", "文学分析理论", "文化批评理论", "日本视觉文化分析", "德勒兹的艺术哲学"],
    categories: ["philosophy", "literature"],
    message: "We cannot foresee, we must take risks and endure the longest possible time, we must not lose sight of grand health.",
    rating: 4.8,
    sessions: 124,
    avatar: "ZK"
  },
  {
    id: 4,
    name: "潘虹如",
    nameAlt: "林小颜",
    education: [
      { degree: "博士", institution: "University of Ljubljana" },
      { degree: "硕士", institution: "Columbia University, Teachers College" }
    ],
    bio: "旅美诗人，主编诗集《看不见的骨头》，个人诗集《看不见的特拉维夫》，英文诗集Café After Dawn，《我的诗句唤不醒长眠的你》",
    specialties: ["双语诗歌", "文学", "电音"],
    categories: ["literature", "music"],
    message: "你想象世界是怎样的，世界就会是怎样",
    rating: 4.9,
    sessions: 178,
    avatar: "PH"
  },
  {
    id: 5,
    name: "张羽僮",
    education: [
      { degree: "硕士", institution: "茱莉亚学院" },
      { degree: "学士", institution: "茱莉亚学院" }
    ],
    bio: "上海音乐厅、中国爱乐乐团、中国国家交响乐团、中央芭蕾舞乐团合作表演家；朱莉亚学院小提琴助教。近年多名学生在国际比赛中屡获金奖，多名学生考上美国音乐学院本科及研究生学位。",
    specialties: ["小提琴", "古典音乐", "音乐教育"],
    categories: ["music"],
    message: "音乐是心灵的语言，用琴弦诉说内心的故事。",
    rating: 4.9,
    sessions: 203,
    avatar: "ZY"
  },
  {
    id: 6,
    name: "胡博文",
    education: [
      { degree: "硕士", institution: "纽约大学" },
      { degree: "学士", institution: "加拿大女王大学" }
    ],
    bio: "毕业于纽约大学音乐科技研究生专业，在纽约跟随 Paul Geluso, Phil Galdston, Kevin Killen, Alan Silverman 等格莱美制作人学习制作。担任 Indie Pop企划 敞篷浴缸 WildBathtub，纽约钉鞋乐队Hang Him to the Scales 的工程师和制作人。回国后成立 盐盐音乐 Saltysalt工作室，致力于推动多元化音乐创作。",
    specialties: ["歌曲创作", "制作", "混音", "母带"],
    categories: ["music"],
    message: "以真心相待音乐与人",
    rating: 4.8,
    sessions: 145,
    avatar: "HB"
  },
  {
    id: 7,
    name: "马多哥",
    education: [
      { degree: "博士", institution: "中国政法大学" },
      { degree: "硕士", institution: "The New School" }
    ],
    bio: "哲学学者，擅长政治思想史，政治理论，福柯研究，罗马历史，马基雅维利研究。在多个期刊上发表文章。",
    specialties: ["艺术中的直言不讳", "政治理论与艺术"],
    categories: ["philosophy"],
    message: "Truth is constituted by courage",
    rating: 4.7,
    sessions: 98,
    avatar: "MD"
  },
  {
    id: 8,
    name: "Ruphus",
    education: [
      { degree: "学士", institution: "知名设计学院" }
    ],
    bio: "行业资深设计师，擅长品牌、视觉、艺术、空间、策划、产品等多元设计。与国内外知名品牌合作，作品获得IDA等各项大奖。",
    specialties: ["品牌设计", "视觉设计", "艺术指导", "空间设计", "产品设计"],
    categories: ["design"],
    message: "设计是解决问题的艺术，让美与功能完美结合。",
    rating: 4.8,
    sessions: 167,
    avatar: "R"
  },
  {
    id: 9,
    name: "杜怡霖",
    education: [
      { degree: "硕士", institution: "南加大" },
      { degree: "学士", institution: "纽约大学" }
    ],
    bio: "影视导演，专注于视觉叙事和电影制作，在独立电影领域有丰富经验。",
    specialties: ["导演", "影视", "影视制作"],
    categories: ["design"],
    message: "用镜头讲述动人的故事，用影像传递真挚的情感。",
    rating: 4.6,
    sessions: 92,
    avatar: "DY"
  },
  {
    id: 10,
    name: "子愚",
    education: [
      { degree: "硕士", institution: "日本某学校" },
      { degree: "学士", institution: "雪城大学" }
    ],
    bio: "跨文化艺术研究者，专注于东西方艺术融合与创新。",
    specialties: ["跨文化艺术", "艺术研究"],
    categories: ["design", "philosophy"],
    message: "艺术无国界，创意连接世界。",
    rating: 4.7,
    sessions: 76,
    avatar: "ZY"
  },
  {
    id: 11,
    name: "海燕",
    education: [
      { degree: "学士", institution: "美国帕森斯设计学院" }
    ],
    bio: "WeArt创始人，致力于艺术教育创新和创意人才培养。",
    specialties: ["艺术教育", "创业管理", "产品设计"],
    categories: ["design"],
    message: "每个人都有独特的创意天赋，关键是找到表达的方式。",
    rating: 4.9,
    sessions: 234,
    avatar: "HY"
  },
  {
    id: 12,
    name: "尤佳欣",
    education: [
      { degree: "硕士", institution: "康奈尔大学" }
    ],
    bio: "数字艺术与交互设计专家，探索科技与艺术的前沿融合。",
    specialties: ["数字艺术", "交互设计", "用户体验"],
    categories: ["design"],
    message: "科技是艺术的新画笔，用它创造未来的美好。",
    rating: 4.8,
    sessions: 143,
    avatar: "YJ"
  }
];

function convertToJSON() {
  try {
    // Ensure data directory exists
    const dataDir = path.join(__dirname, 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Write to JSON file
    const outputPath = path.join(__dirname, 'data', 'mentors.json');
    fs.writeFileSync(outputPath, JSON.stringify(mentorData, null, 2), 'utf8');
    
    console.log(`✅ Successfully created mentors.json with ${mentorData.length} mentors`);
    console.log(`📄 Output file: ${outputPath}`);
    
    // Print summary by category
    console.log('\n📊 Mentor Summary by Category:');
    const categories = ['design', 'music', 'literature', 'philosophy'];
    
    categories.forEach(category => {
      const mentorsInCategory = mentorData.filter(mentor => mentor.categories.includes(category));
      console.log(`\n${category.toUpperCase()}:`);
      mentorsInCategory.forEach(mentor => {
        console.log(`   ${mentor.name}${mentor.nameEn ? ` (${mentor.nameEn})` : ''}${mentor.nameAlt ? ` / ${mentor.nameAlt}` : ''}`);
      });
    });
    
    console.log(`\n🎯 Total: ${mentorData.length} mentors across ${categories.length} categories`);
    
  } catch (error) {
    console.error('❌ Error creating JSON file:', error.message);
    process.exit(1);
  }
}

// Run the conversion
convertToJSON(); 