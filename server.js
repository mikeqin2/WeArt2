const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'WeArt Dashboard API is running' });
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
});