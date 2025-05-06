# ChatAlimi - Educational AI Chat Assistant

ChatAlimi is an educational AI assistant designed to help students improve their written productions. It provides feedback, suggestions, and guidance in French to help students enhance their writing skills.

## Features

- **Interactive Chat Interface**: Engage in real-time conversations with an AI tutor
- **Image Support**: Upload and analyze images for feedback
- **Multi-language Support**: Toggle between French and Arabic interface
- **Text Formatting**: Displays bold, italic, and underlined text for emphasis
- **Responsive Design**: Works on desktop and mobile devices

## Technical Implementation

- React-based frontend with React Router for navigation
- Azure AI Inference SDK for connecting to AI models
- Support for multimodal interactions (text and images)
- Responsive design using Bootstrap

## Image Handling

The application supports both sending and receiving images:

### Sending Images
- Users can upload images up to 5MB in size
- Supported formats: JPG, PNG, GIF, WEBP
- Images are converted to base64 format before sending to the API

### Receiving Images
- The AI can respond with images to illustrate concepts
- Images are displayed inline with text responses
- The application processes multimodal responses in this format:

```json
[
  {
    "type": "text",
    "text": "Here is some text explanation"
  },
  {
    "type": "image_url",
    "image_url": {
      "url": "data:image/jpeg;base64,..."
    }
  }
]
```

## Browser Compatibility

For best results, use one of these browsers:
- Chrome/Chromium
- Firefox
- Edge
- Safari (limited image upload support)

## Setup Instructions

This project uses the Azure AI Inference SDK with GitHub's model API. You'll need to set up a GitHub token to use it.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## License

This project is proprietary and intended for educational purposes.

## Credits

Developed for the Tunisian Ministry of Education.

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

## Azure AI Chat Integration

This project now integrates with the Azure AI Inference SDK to provide intelligent chat responses using GitHub's AI models.

### Setting up GitHub Token

To use the chat functionality, you'll need to create a personal access token (PAT) in your GitHub settings:

1. Go to your GitHub settings -> Developer settings -> Personal access tokens -> Fine-grained tokens
2. Click "Generate new token"
3. Give it a name and set the expiration
4. For Repository access, select "Public repositories (read-only)"
5. Under Permissions, select "models:read" - this is required for the AI model access
6. Generate the token and copy it

### Environment Variables

Create a `.env.local` file in the root of your project with the following content:

```
REACT_APP_GITHUB_TOKEN=your_github_token_here
```

Replace `your_github_token_here` with the token you generated.

### Alternative: Use in Development

Alternatively, you can set the environment variable directly in your terminal:

**Bash:**
```bash
export REACT_APP_GITHUB_TOKEN="your-github-token-here"
npm start
```

**PowerShell:**
```powershell
$Env:REACT_APP_GITHUB_TOKEN="your-github-token-here"
npm start
```

**Windows Command Prompt:**
```cmd
set REACT_APP_GITHUB_TOKEN=your-github-token-here
npm start
```
