const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const multer = require('multer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// JWT Secret (in production, use a secure random string from environment variables)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here-change-in-production';

// Initialize user database with better persistence handling
const usersDbPath = path.join(__dirname, 'data', 'users.json');
let users = [];

// Load users from file or create empty array
function loadUsers() {
  try {
    // Create data directory if it doesn't exist
    const dataDir = path.join(__dirname, 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    if (fs.existsSync(usersDbPath)) {
      const userData = fs.readFileSync(usersDbPath, 'utf8');
      users = JSON.parse(userData);
      console.log(`📊 Loaded ${users.length} users from database`);
    } else {
      // Create empty users file
      users = [];
      saveUsers();
      console.log('📊 Created new users database');
    }
  } catch (error) {
    console.error('❌ Error loading user data:', error);
    users = [];
    // Try to save empty array to create the file
    try {
      saveUsers();
    } catch (saveError) {
      console.error('❌ Could not create users file:', saveError);
    }
  }
}

// Save users to file with better error handling
const saveUsers = () => {
  try {
    const dataDir = path.join(__dirname, 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // Create backup of existing data
    if (fs.existsSync(usersDbPath)) {
      const backupPath = usersDbPath + '.backup';
      fs.copyFileSync(usersDbPath, backupPath);
    }
    
    fs.writeFileSync(usersDbPath, JSON.stringify(users, null, 2));
    console.log(`💾 Saved ${users.length} users to database`);
  } catch (error) {
    console.error('❌ Error saving user data:', error);
    
    // Try to restore from backup if save failed
    const backupPath = usersDbPath + '.backup';
    if (fs.existsSync(backupPath)) {
      try {
        fs.copyFileSync(backupPath, usersDbPath);
        console.log('🔄 Restored users from backup');
      } catch (restoreError) {
        console.error('❌ Could not restore from backup:', restoreError);
      }
    }
  }
};

// Initialize users on startup
loadUsers();

// Load mentor data
let mentorData = [];
try {
  const mentorDataPath = path.join(__dirname, 'data', 'mentors.json');
  mentorData = JSON.parse(fs.readFileSync(mentorDataPath, 'utf8'));
} catch (error) {
  console.error('Error loading mentor data:', error);
}

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://assets-persist.lovart.ai", "https://cdnjs.cloudflare.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
      scriptSrcAttr: ["'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Session middleware
app.use(session({
  secret: JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, // Set to true in production with HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Optional authentication middleware (doesn't require token)
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (!err) {
        req.user = user;
      }
    });
  }
  next();
};

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// User Authentication Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email) {
      return res.status(400).json({ 
        error: 'Name and email are required',
        details: { name: !name, email: !email }
      });
    }

    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    // Create new user
    const newUser = {
      id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: password ? await bcrypt.hash(password, 10) : null, // Hash password if provided
      preferences: {
        colorSelection: null,
        pathSelection: null,
        learningGoals: [],
        artMediums: []
      },
      onboardingCompleted: false,
      createdAt: new Date().toISOString(),
      lastLogin: null
    };

    users.push(newUser);
    saveUsers();

    // Create session
    req.session.userId = newUser.id;

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: newUser.id, 
        email: newUser.email,
        name: newUser.name 
      }, 
      JWT_SECRET, 
      { expiresIn: '24h' }
    );

    // Return user data without password
    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: userWithoutPassword,
      token: token
    });

    console.log(`New user registered: ${newUser.email}`);

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error during registration' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    console.log(`🔐 Login attempt for: ${email}`);
    console.log(`📊 Current users in database: ${users.length}`);

    // Find user (case insensitive)
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
    
    if (!user) {
      console.log(`❌ User not found: ${email}`);
      
      // Check if this looks like a valid registration attempt
      if (email.includes('@') && email.includes('.')) {
        return res.status(404).json({ 
          error: 'No account found with this email. Would you like to register instead?',
          suggestion: 'register',
          email: email.toLowerCase().trim()
        });
      }
      
      return res.status(401).json({ error: 'Invalid email format' });
    }

    // Check password if provided
    if (password && user.password) {
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        console.log(`❌ Invalid password for: ${email}`);
        return res.status(401).json({ error: 'Invalid password' });
      }
    }

    // Update last login
    user.lastLogin = new Date().toISOString();
    saveUsers();

    // Create session
    req.session.userId = user.id;

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        name: user.name 
      }, 
      JWT_SECRET, 
      { expiresIn: '24h' }
    );

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;

    console.log(`✅ Login successful for: ${email}`);

    res.json({
      success: true,
      message: 'Login successful',
      user: userWithoutPassword,
      token: token
    });

  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ error: 'Internal server error during login' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Could not log out' });
    }
    res.json({ success: true, message: 'Logged out successfully' });
  });
});

// Get current user profile
app.get('/api/auth/profile', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const { password: _, ...userWithoutPassword } = user;
  res.json({ user: userWithoutPassword });
});

// Update user preferences during onboarding
app.post('/api/auth/preferences', authenticateToken, (req, res) => {
  try {
    const { colorSelection, pathSelection, learningGoals, artMediums } = req.body;
    
    const user = users.find(u => u.id === req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update preferences
    if (colorSelection) user.preferences.colorSelection = colorSelection;
    if (pathSelection) user.preferences.pathSelection = pathSelection;
    if (learningGoals) user.preferences.learningGoals = learningGoals;
    if (artMediums) user.preferences.artMediums = artMediums;

    // Mark onboarding as completed if all required preferences are set
    if (user.preferences.colorSelection && 
        user.preferences.pathSelection && 
        user.preferences.learningGoals.length > 0 && 
        user.preferences.artMediums.length > 0) {
      user.preferences.onboardingCompleted = true;
    }

    saveUsers();

    const { password: _, ...userWithoutPassword } = user;
    res.json({ 
      success: true, 
      message: 'Preferences updated successfully',
      user: userWithoutPassword 
    });

  } catch (error) {
    console.error('Error updating preferences:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Configure multer for file uploads
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename: userId_timestamp_originalname
    const userId = req.user ? req.user.userId : 'anonymous';
    const timestamp = Date.now();
    const originalName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, `${userId}_${timestamp}_${originalName}`);
  }
});

const fileFilter = (req, file, cb) => {
  // Accept only PDF, DOC, DOCX, and image files
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'image/jpg'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, DOC, DOCX, and image files are allowed.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Resume upload endpoint
app.post('/api/upload/resume', authenticateToken, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Find user and update with resume info
    const user = users.find(u => u.id === req.user.userId);
    if (!user) {
      // Clean up uploaded file if user not found
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ error: 'User not found' });
    }

    // Save resume info to user
    user.resume = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: req.file.path,
      size: req.file.size,
      mimetype: req.file.mimetype,
      uploadedAt: new Date().toISOString()
    };

    saveUsers();

    const { password: _, ...userWithoutPassword } = user;
    res.json({
      success: true,
      message: 'Resume uploaded successfully',
      user: userWithoutPassword,
      file: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size
      }
    });

    console.log(`Resume uploaded for user: ${user.email}, file: ${req.file.originalname}`);

  } catch (error) {
    console.error('Resume upload error:', error);
    
    // Clean up uploaded file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ error: 'Internal server error during file upload' });
  }
});

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'WeArt Dashboard API is running',
    userCount: users.length,
    timestamp: new Date().toISOString()
  });
});

// Debug endpoint to check users (remove in production)
app.get('/api/debug/users', (req, res) => {
  res.json({
    count: users.length,
    users: users.map(u => ({ id: u.id, name: u.name, email: u.email, createdAt: u.createdAt }))
  });
});

// Get all users (admin only - for debugging)
app.get('/api/users', (req, res) => {
  const userSummary = users.map(user => ({
    id: user.id,
    name: user.name,
    email: user.email,
    onboardingCompleted: user.onboardingCompleted,
    createdAt: user.createdAt
  }));
  
  res.json({
    total: users.length,
    users: userSummary
  });
});

// Mentor API endpoints
app.get('/api/mentors', (req, res) => {
  try {
    const { 
      category, 
      education, 
      institution, 
      search, 
      nameSearch,
      limit = 50,
      offset = 0 
    } = req.query;

    let filteredMentors = [...mentorData];

    // Filter by category
    if (category && category !== 'all') {
      filteredMentors = filteredMentors.filter(mentor => 
        mentor.categories.includes(category)
      );
    }

    // Filter by education level
    if (education) {
      const educationLevels = Array.isArray(education) ? education : [education];
      filteredMentors = filteredMentors.filter(mentor =>
        mentor.education.some(edu => educationLevels.includes(edu.degree))
      );
    }

    // Filter by institution
    if (institution) {
      const institutions = Array.isArray(institution) ? institution : [institution];
      filteredMentors = filteredMentors.filter(mentor =>
        mentor.education.some(edu => 
          institutions.some(inst => edu.institution.toLowerCase().includes(inst.toLowerCase()))
        )
      );
    }

    // Global search
    if (search) {
      const searchTerm = search.toLowerCase();
      filteredMentors = filteredMentors.filter(mentor =>
        mentor.name.toLowerCase().includes(searchTerm) ||
        (mentor.nameEn && mentor.nameEn.toLowerCase().includes(searchTerm)) ||
        (mentor.nameAlt && mentor.nameAlt.toLowerCase().includes(searchTerm)) ||
        mentor.bio.toLowerCase().includes(searchTerm) ||
        mentor.specialties.some(specialty => specialty.toLowerCase().includes(searchTerm)) ||
        mentor.education.some(edu => 
          edu.institution.toLowerCase().includes(searchTerm) ||
          edu.degree.toLowerCase().includes(searchTerm)
        )
      );
    }

    // Name-specific search
    if (nameSearch) {
      const nameSearchTerm = nameSearch.toLowerCase();
      filteredMentors = filteredMentors.filter(mentor =>
        mentor.name.toLowerCase().includes(nameSearchTerm) ||
        (mentor.nameEn && mentor.nameEn.toLowerCase().includes(nameSearchTerm)) ||
        (mentor.nameAlt && mentor.nameAlt.toLowerCase().includes(nameSearchTerm))
      );
    }

    // Pagination
    const startIndex = parseInt(offset);
    const endIndex = startIndex + parseInt(limit);
    const paginatedMentors = filteredMentors.slice(startIndex, endIndex);

    res.json({
      mentors: paginatedMentors,
      total: filteredMentors.length,
      page: Math.floor(startIndex / limit) + 1,
      totalPages: Math.ceil(filteredMentors.length / limit)
    });
  } catch (error) {
    console.error('Error fetching mentors:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single mentor
app.get('/api/mentors/:id', (req, res) => {
  try {
    const mentorId = parseInt(req.params.id);
    const mentor = mentorData.find(m => m.id === mentorId);
    
    if (!mentor) {
      return res.status(404).json({ error: 'Mentor not found' });
    }
    
    res.json(mentor);
  } catch (error) {
    console.error('Error fetching mentor:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get mentor categories
app.get('/api/mentors/meta/categories', (req, res) => {
  try {
    const categories = [...new Set(mentorData.flatMap(mentor => mentor.categories))];
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get education levels
app.get('/api/mentors/meta/education-levels', (req, res) => {
  try {
    const educationLevels = [...new Set(mentorData.flatMap(mentor => 
      mentor.education.map(edu => edu.degree)
    ))];
    res.json(educationLevels);
  } catch (error) {
    console.error('Error fetching education levels:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get institutions
app.get('/api/mentors/meta/institutions', (req, res) => {
  try {
    const institutions = [...new Set(mentorData.flatMap(mentor => 
      mentor.education.map(edu => edu.institution)
    ))].sort();
    res.json(institutions);
  } catch (error) {
    console.error('Error fetching institutions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// AI Chat Routes
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { 
      message, 
      chatHistory = [], 
      maxTokens, 
      temperature,
      isOnboardingIntro = false 
    } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    console.log('🤖 AI Chat Request received:', { 
      messageLength: message.length, 
      hasHistory: chatHistory.length > 0,
      isOnboarding: isOnboardingIntro
    });

    // Check if API key is available
    if (!process.env.DEEPSEEK_API_KEY || process.env.DEEPSEEK_API_KEY === 'test-key' || process.env.DEEPSEEK_API_KEY === 'test-key-placeholder') {
      console.log('📝 No valid DeepSeek API key found, using intelligent fallback response');
      
      // Create contextual responses based on keywords
      const lowerMessage = message.toLowerCase();
      let response = "Hello! I'm your WeArt AI Assistant. ";
      
      // Check for onboarding/learning plan requests
      if (lowerMessage.includes('learning plan') || lowerMessage.includes('personalized') || isOnboardingIntro) {
        response = `🎨 **Welcome to Your Personalized WeArt Journey!**

Based on your interests and goals, here's your customized learning path:

## 📚 Your 8-Week Art Learning Roadmap

**Week 1-2: Foundation Building**
• Master fundamental techniques and basic principles
• Practice daily exercises (15-30 minutes)
• Study inspiring artists in your chosen medium
• *Milestone: Complete 10 foundational exercises*

**Week 3-4: Skill Development** 
• Learn intermediate techniques and methods
• Experiment with different styles and approaches
• Build your artistic vocabulary and visual library
• *Milestone: Create 3 complete artworks*

**Week 5-6: Personal Style Discovery**
• Develop your unique artistic voice
• Study artists who inspire your direction
• Practice advanced techniques and composition
• *Milestone: Complete one significant personal project*

**Week 7-8: Portfolio & Sharing**
• Refine your best work and build a portfolio
• Learn about presentation and critique
• Connect with art communities and share your progress
• *Milestone: Launch your artistic showcase*

## 🎯 Immediate Next Steps

1. **Today**: Set up your creative workspace and gather materials
2. **This Week**: Practice fundamental exercises daily (20-30 minutes)
3. **Connect**: Join art communities and find inspiration

Your artistic journey is unique and exciting! What aspect of this plan interests you most? 🌟`;
      } else if (lowerMessage.includes('color') || lowerMessage.includes('colour')) {
        response += "Color theory is fundamental to art! The primary colors are red, blue, and yellow. When mixed, they create secondary colors: orange (red+yellow), green (blue+yellow), and purple (red+blue). Understanding warm vs cool colors, color harmony, and contrast can greatly improve your artwork composition. Would you like to explore specific color techniques or palettes?";
      } else if (lowerMessage.includes('painting') || lowerMessage.includes('paint')) {
        response += "There are many painting techniques to explore! For beginners, I recommend starting with acrylic paints as they're easier to work with than oils. Key techniques include wet-on-wet, dry brush, glazing, and impasto. Practice basic brush strokes and color mixing first. What type of painting interests you most - landscapes, portraits, or abstracts?";
      } else if (lowerMessage.includes('drawing') || lowerMessage.includes('sketch')) {
        response += "Drawing is the foundation of all visual art! Start with basic shapes and practice gesture drawing to capture movement. Focus on observation skills, understanding light and shadow, and proportions. Regular practice with different subjects will improve your skills significantly. What would you like to draw?";
      } else if (lowerMessage.includes('digital') || lowerMessage.includes('photoshop') || lowerMessage.includes('tablet')) {
        response += "Digital art opens up amazing possibilities! Popular software includes Photoshop, Procreate, and Clip Studio Paint. Start with basic brush settings and layer management. The fundamentals of traditional art still apply - composition, color theory, and form are just as important in digital mediums. What digital art style interests you?";
      } else if (lowerMessage.includes('beginner') || lowerMessage.includes('start') || lowerMessage.includes('learn')) {
        response += "Starting your art journey is exciting! I recommend beginning with basic drawing exercises, studying fundamental concepts like perspective and proportion, and practicing regularly. Don't worry about making perfect art immediately - focus on learning and enjoying the process. What art medium would you like to explore first?";
      } else if (lowerMessage.includes('artist') || lowerMessage.includes('famous')) {
        response += "Art history is rich with inspiring artists! Some masters to study include Leonardo da Vinci (Renaissance), Van Gogh (Post-Impressionism), Picasso (Cubism), and Monet (Impressionism). Each brought unique techniques and perspectives that changed art forever. Which art movement or style interests you most?";
      } else if (lowerMessage.includes('technique') || lowerMessage.includes('how to')) {
        response += "I'd love to help you with specific techniques! Whether you're interested in brush techniques, shading methods, composition rules, or medium-specific skills, there's always something new to learn. What particular technique or skill would you like to master?";
      } else {
        response += "I'm here to help with all your art-related questions! I can assist with techniques, color theory, art history, composition, and creative guidance. Whether you're a complete beginner or looking to refine your skills, I'm excited to be part of your artistic journey. What specific aspect of art would you like to explore today? 🎨";
      }
      
      console.log('✅ Fallback response generated successfully');
      
      return res.json({
        response: response,
        timestamp: new Date().toISOString(),
        demo: true,
        source: 'intelligent_fallback'
      });
    }

    // Set defaults based on request type
    const finalMaxTokens = maxTokens || (isOnboardingIntro ? 2048 : 1000);
    const finalTemperature = temperature || 0.7;

    console.log(`Using maxTokens: ${finalMaxTokens}, temperature: ${finalTemperature}, isOnboarding: ${isOnboardingIntro}`);

    // Prepare messages for DeepSeek API
    const messages = [
      {
        role: 'system',
        content: 'You are WeArt AI Assistant, a knowledgeable and friendly art mentor. You help users with art techniques, art history, course recommendations, and creative guidance. Keep responses informative yet conversational, and focus on art-related topics. When appropriate, mention specific techniques, famous artists, or suggest practical exercises.'
      },
      ...chatHistory.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      })),
      {
        role: 'user',
        content: message
      }
    ];

    console.log('Making request to DeepSeek API...');

    // Make request to DeepSeek API with timeout and explicit proxy bypass
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000); // Increased timeout

    // Create axios instance with no proxy
    const axiosInstance = axios.create({
      proxy: false,
      timeout: 45000
    });

    const deepseekResponse = await axiosInstance.post(
      process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1/chat/completions',
      {
        model: 'deepseek-chat',
        messages: messages,
        max_tokens: finalMaxTokens,     
        temperature: finalTemperature,  
        stream: false
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json'
        },
        signal: controller.signal
      }
    );

    clearTimeout(timeoutId);

    const aiResponse = deepseekResponse.data.choices[0].message.content;
    console.log('DeepSeek API response received successfully');

    res.json({
      response: aiResponse,
      timestamp: new Date().toISOString(),
      source: 'deepseek_api'
    });

  } catch (error) {
    console.error('Error calling DeepSeek API:', error.message);
    
    // Provide different fallback responses based on error type
    let fallbackResponse = "I'm sorry, I'm having trouble connecting to my knowledge base right now. Please try again in a moment.";
    
    if (error.code === 'ECONNABORTED' || error.name === 'AbortError') {
      fallbackResponse = "The request is taking longer than expected. Please try with a shorter question or try again in a moment.";
    } else if (error.response?.status === 401) {
      fallbackResponse = "I'm here to help with your art questions! While I'm having some connection issues, feel free to ask me about art techniques, color theory, or creative guidance.";
    } else if (error.response?.status === 429) {
      fallbackResponse = "I'm quite popular today! Please wait a moment and try again. In the meantime, what art topic interests you most?";
    }
    
    res.status(200).json({
      response: fallbackResponse,
      error: 'AI service temporarily unavailable',
      timestamp: new Date().toISOString(),
      source: 'error_fallback'
    });
  }
});

// Get AI chat suggestions
app.get('/api/ai/suggestions', (req, res) => {
  const suggestions = [
    "How do I start learning oil painting?",
    "What are the basic color theory principles?",
    "Can you recommend some art techniques for beginners?",
    "Tell me about famous Renaissance artists",
    "What supplies do I need for watercolor painting?",
    "How do I improve my drawing skills?",
    "What's the difference between impressionism and expressionism?",
    "Can you suggest some digital art tutorials?"
  ];
  
  res.json({ suggestions });
});

// Mock API endpoints for dashboard data
app.get('/api/user/stats', (req, res) => {
  res.json({
    streak: 3,
    xp: 1290,
    progress: 60,
    coursesCompleted: 12,
    artworksCreated: 47,
    communityEngagement: 85
  });
});

app.get('/api/trending-prompts', (req, res) => {
  res.json([
    { id: 1, title: "A futuristic cityscape", category: "Architecture", popularity: 95 },
    { id: 2, title: "Portrait of a young woman", category: "Portrait", popularity: 87 },
    { id: 3, title: "A serene mountain lake", category: "Landscape", popularity: 92 },
    { id: 4, title: "An enchanted forest", category: "Fantasy", popularity: 89 }
  ]);
});

app.get('/api/courses', (req, res) => {
  res.json([
    {
      id: 1,
      title: "Landscape Painting Basics",
      instructor: "Sarah Johnson",
      progress: 35,
      image: "/assets/images/landscape-course.jpg",
      rating: 4.8,
      lessons: 12,
      duration: "4.5 hours"
    },
    {
      id: 2,
      title: "Digital Character Design",
      instructor: "Mike Chen",
      progress: 0,
      image: "/assets/images/character-course.jpg",
      rating: 4.9,
      lessons: 15,
      duration: "6 hours"
    },
    {
      id: 3,
      title: "Color Theory Masterclass",
      instructor: "Emma Davis",
      progress: 0,
      image: "/assets/images/color-course.jpg",
      rating: 4.7,
      lessons: 8,
      duration: "3 hours"
    }
  ]);
});

// Serve the main application
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Dashboard route (same as root)
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
  
// Course page routes
app.get('/course', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'course.html'));
});

app.get('/course.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'course.html'));
});

// Mentor page routes
app.get('/mentor', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'mentor.html'));
});

app.get('/mentor.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'mentor.html'));
});

// Explore page routes
app.get('/explore', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'explore.html'));
});

app.get('/explore.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'explore.html'));
});

// Page routes for the onboarding flow
app.get('/intro', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'intro.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/color-selection', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'color_selection.html'));
});

app.get('/path-selection', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'path_selection.html'));
});

app.get('/learning-goal-selection', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'learning_goal_selection.html'));
});

app.get('/art-medium-selection', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'art_medium_selection.html'));
});

// Authentication page routes
// app.get('/auth', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'auth.html'));
// });

// app.get('/signin', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'auth.html'));
// });

// app.get('/signup', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'auth.html'));
// });

// Handle SPA routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🎨 WeArt Dashboard server is running on port ${PORT}`);
  console.log(`🌐 Visit: http://localhost:${PORT}`);
  console.log(`📚 Loaded ${mentorData.length} mentors`);
});