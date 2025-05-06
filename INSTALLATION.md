# ChatAlimi Installation Guide

This guide provides step-by-step instructions to set up and run the ChatAlimi application on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- npm (v7 or higher)
- Git

## Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/chatalimi.git
   cd chatalimi
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure GitHub Token**
   
   You need to create a GitHub token with `models:read` permission:
   
   a. Go to GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens
   b. Generate a new token with appropriate permissions
   c. Create a `.env.local` file in the project root with:
   ```
   REACT_APP_GITHUB_TOKEN=your_github_token_here
   ```

4. **Start the development server**
   ```bash
   npm start
   ```
   
   This will launch the application at [http://localhost:3000](http://localhost:3000).

## Application Structure

- `src/components/` - Contains React components
- `src/services/` - Contains API services
- `src/assets/` - Contains static assets like images and styles

## Features

- **Chat Interface**: Engage with the AI assistant
- **Image Uploads**: Share images for analysis
- **Multimodal Responses**: Receive text and image responses from the AI

## Troubleshooting

### Common Issues

1. **Token Authentication Errors**
   - Ensure your GitHub token is valid and has the correct permissions
   - Check the token is correctly set in the .env.local file

2. **Image Upload Problems**
   - Verify your browser supports the File and Blob APIs
   - Check image size (max 5MB)
   - Supported formats: JPG, PNG, GIF, WEBP

3. **Styling Issues**
   - Ensure Bootstrap is properly loaded
   - Check for console errors related to CSS

## Support

For issues or questions, please file an issue in the GitHub repository.

## License

This project is proprietary and intended for educational purposes. 