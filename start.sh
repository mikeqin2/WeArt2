#!/bin/bash

echo "🎨 Starting WeArt Dashboard..."
echo "================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Kill any existing processes on port 3000
echo "🔍 Checking for existing processes on port 3000..."
if lsof -ti:3000 > /dev/null 2>&1; then
    echo "⚠️  Port 3000 is in use. Stopping existing processes..."
    kill -9 $(lsof -ti:3000) 2>/dev/null || true
    sleep 2
fi

# Start the server
echo "🚀 Starting WeArt Dashboard server..."
NO_PROXY="*" http_proxy="" https_proxy="" HTTP_PROXY="" HTTPS_PROXY="" node server.js &

# Wait a moment for server to start
sleep 3

# Check if server is running
if curl -s http://localhost:3000/api/health > /dev/null 2>&1; then
    echo "✅ WeArt Dashboard is running!"
    echo "🌐 Open your browser and visit: http://localhost:3000"
    echo ""
    echo "📊 API endpoints available:"
    echo "   • http://localhost:3000/api/health"
    echo "   • http://localhost:3000/api/user/stats"
    echo "   • http://localhost:3000/api/trending-prompts"
    echo "   • http://localhost:3000/api/courses"
    echo ""
    echo "⏹️  To stop the server, press Ctrl+C or run: pkill -f 'node server.js'"
else
    echo "❌ Failed to start WeArt Dashboard. Check for errors above."
    exit 1
fi 