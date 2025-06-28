 # WeArt Dashboard

A modern, responsive web dashboard for artists and creators built with HTML, CSS, JavaScript, and Node.js/Express.

![WeArt Dashboard](https://via.placeholder.com/800x400/667eea/ffffff?text=WeArt+Dashboard)

## 🎨 Features

- **Modern UI Design**: Dark theme with glassmorphism effects
- **Responsive Layout**: Works on desktop, tablet, and mobile devices
- **Interactive Elements**: Hover effects, animations, and transitions
- **Progress Tracking**: Visual progress indicators and statistics
- **Course Management**: Continue learning section with progress bars
- **Trending Content**: Dynamic trending prompts display
- **Search Functionality**: Real-time search capabilities
- **API Integration**: RESTful API endpoints for data management

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone or download this project**
   ```bash
   # If using git
   git clone <repository-url>
   cd weart-dashboard
   
   # Or extract the downloaded files
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Production Deployment

1. **Start the production server**
   ```bash
   npm start
   ```

2. **Set environment variables** (optional)
   - Copy `.env.example` to `.env`
   - Modify settings as needed

## 📁 Project Structure

```
weart-dashboard/
├── public/                 # Static files served by Express
│   ├── css/
│   │   └── style.css      # Main stylesheet
│   ├── js/
│   │   └── script.js      # Client-side JavaScript
│   ├── assets/
│   │   └── images/        # Image assets
│   └── index.html         # Main HTML file
├── server.js              # Express server
├── package.json           # Dependencies and scripts
└── README.md             # This file
```

## 🛠️ Development

### Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with auto-reload
- `npm test` - Run tests (placeholder)

### API Endpoints

The application includes several mock API endpoints:

- `GET /api/health` - Health check
- `GET /api/user/stats` - User statistics
- `GET /api/trending-prompts` - Trending prompts data
- `GET /api/courses` - Course information

### Customization

#### Colors and Theming

The main color palette is defined in `public/css/style.css`:

```css
/* Primary gradient */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Background gradient */  
background: linear-gradient(135deg, #0f0f23 0%, #1a1b3a 50%, #2d1b69 100%);

/* Accent colors */
--accent-blue: #22d3ee;
--accent-purple: #667eea;
```

#### Adding New Sections

1. Add HTML structure in `public/index.html`
2. Add styles in `public/css/style.css`
3. Add JavaScript functionality in `public/js/script.js`
4. Create API endpoint in `server.js` if needed

## 🎯 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## 📱 Responsive Breakpoints

- Desktop: 1200px+
- Tablet: 768px - 1199px
- Mobile: < 768px

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### Customizing the Dashboard

#### Adding New Categories

1. Edit the categories section in `index.html`
2. Add corresponding styles in `style.css`
3. Update the JavaScript handlers in `script.js`

#### Modifying User Stats

Update the API endpoint in `server.js`:

```javascript
app.get('/api/user/stats', (req, res) => {
  res.json({
    streak: 5,        // Day streak
    xp: 2450,        // Experience points
    progress: 75,     // Overall progress percentage
    // ... other stats
  });
});
```

## 🚀 Deployment Options

### Option 1: Heroku

1. Install Heroku CLI
2. Create a new Heroku app
3. Deploy:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   heroku create your-app-name
   git push heroku main
   ```

### Option 2: Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Deploy: `vercel`
3. Follow the prompts

### Option 3: Traditional Hosting

1. Run `npm install --production`
2. Upload all files to your server
3. Start with `node server.js`
4. Use a process manager like PM2 for production

### Option 4: Docker

Create a `Dockerfile`:

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

Build and run:
```bash
docker build -t weart-dashboard .
docker run -p 3000:3000 weart-dashboard
```

## 🔒 Security Considerations

The application includes basic security middleware:

- Helmet.js for security headers
- CORS configuration
- Input sanitization (expand as needed)

For production deployment, consider adding:
- Rate limiting
- Authentication/authorization
- HTTPS enforcement
- Database security (when applicable)

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**
   - Change the PORT in `.env` or kill the process using port 3000

2. **Assets not loading**
   - Ensure the `public` directory structure is correct
   - Check file permissions

3. **API endpoints not working**
   - Verify the server is running
   - Check browser console for network errors

### Performance Optimization

- Images are optimized and lazy-loaded
- CSS uses efficient selectors
- JavaScript is modular and efficient
- Consider adding a CDN for production

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the project
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section above
- Review the code comments for implementation details

---

**Made with ❤️ for the creative community**