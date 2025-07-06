# WeArt AI Assistant Setup Guide

This guide will help you set up the AI chat functionality using the DeepSeek API.

## Prerequisites

1. Node.js (v16 or higher)
2. A DeepSeek API key

## Getting a DeepSeek API Key

1. Visit [DeepSeek's website](https://www.deepseek.com/)
2. Sign up for an account or log in
3. Navigate to the API section
4. Generate a new API key
5. Copy the API key (you'll need it for the next step)

## Environment Setup

1. Create a `.env` file in your project root directory
2. Add the following variables:

```bash
# DeepSeek API Configuration
DEEPSEEK_API_KEY=your_deepseek_api_key_here
DEEPSEEK_API_URL=https://api.deepseek.com/v1/chat/completions

# Server Configuration
PORT=3000
NODE_ENV=development
```

3. Replace `your_deepseek_api_key_here` with your actual DeepSeek API key

## Installation

1. Install the required dependencies:
```bash
npm install
```

## Running the Application

1. Start the server:
```bash
npm start
```

Or for development with auto-restart:
```bash
npm run dev
```

2. Open your browser and navigate to:
```
http://localhost:3000/ai
```

## Features

- **Real-time Chat**: Send messages and receive AI responses instantly
- **Chat History**: Conversation history is maintained during the session
- **Typing Indicators**: Visual feedback when the AI is processing your message
- **Fallback Responses**: Graceful error handling if the API is unavailable
- **Auto-scroll**: Automatically scrolls to the latest message
- **Responsive Design**: Works on different screen sizes

## Usage

1. Type your art-related question in the input box
2. Press Enter or click the send button
3. Wait for the AI to respond
4. Continue the conversation naturally

## Example Questions

- "How do I start learning oil painting?"
- "What are the basic color theory principles?"
- "Can you recommend some art techniques for beginners?"
- "Tell me about famous Renaissance artists"
- "What supplies do I need for watercolor painting?"

## API Endpoints

- `POST /api/ai/chat` - Send a message to the AI
- `GET /api/ai/suggestions` - Get conversation starter suggestions

## Troubleshooting

### API Key Issues
- Make sure your `.env` file is in the project root
- Verify your DeepSeek API key is correct
- Check that you have sufficient API credits

### Connection Issues
- Ensure your internet connection is stable
- Verify the DeepSeek API URL is correct
- Check server logs for detailed error messages

### Chat Not Working
- Open browser developer tools to check for JavaScript errors
- Ensure the server is running on the correct port
- Verify all dependencies are installed

## Security Notes

- Never commit your `.env` file to version control
- Keep your API key secure and don't share it publicly
- The `.env` file should be added to your `.gitignore`

## Next Steps

Once you have the AI functionality working, you can:
- Integrate it with the main dashboard
- Add user authentication
- Implement conversation saving to a database
- Add more sophisticated conversation management
- Customize the AI's personality and knowledge base 