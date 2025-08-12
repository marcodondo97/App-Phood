# Phood - AI Food Recognition App

## 1) Introduction

**Phood** is an innovative mobile application that combines artificial intelligence with culinary passion. The app allows users to automatically identify foods through photographs and obtain detailed recipes in real-time.

The application has been developed using modern technologies to ensure a smooth and intuitive user experience, offering advanced food recognition features through AI.

---

## 2) Description

Phood transforms the way we interact with food through technology:

- **AI Recognition**: Take a photo of your dish and the AI will automatically identify the ingredients
- **Instant Recipes**: Receive complete recipes with ingredients, measurements, and step-by-step instructions
- **Secure Authentication**: Protected login system with AWS Cognito
- **Responsive Design**: Interface optimized for mobile devices
- **Optimized Performance**: Fast loading and intelligent caching

The application is designed to be used by both expert chefs and cooking beginners, offering a personalized and accessible experience.

### Technologies Used

#### Frontend Framework  
<div align="left">
  <img src="docs/img/react-logo.png" alt="React" width="80" height="80"/>
  <img src="docs/img/ionic-logo.png" alt="Ionic" width="80" height="80"/>
</div>

- **React 19.0.0**: Modern JavaScript framework for building interactive user interfaces  
- **TypeScript 5.1.6**: Typed language that extends JavaScript for more robust and maintainable code  
- **Ionic React 8.5.0**: Framework for cross-platform hybrid application development  
- **React Router 5.3.4**: Routing management and navigation between application pages  

#### Third-Party Technologies

##### Cloud & Authentication  
<div align="left">
  <img src="docs/img/cognito-logo.png" alt="AWS Cognito" width="130" height="130"/>
</div>

- **[AWS Cognito](https://aws.amazon.com/cognito/)**: User authentication and management service  
  - Secure user account management  
  - Multi-factor authentication  
  - Integration with AWS Amplify for React  
- **AWS Amplify 6.15.5**: Framework for full-stack application development  
- **Amazon Cognito Identity Provider**: Advanced identity management  

##### AI & Machine Learning  
<div align="left">
  <img src="docs/img/clarifai-logo.png" alt="Clarifai" width="80" height="80"/>
</div>

- **[Clarifai API](https://www.clarifai.com/)**: Artificial intelligence platform for image recognition  
  - Specialized model for food recognition  
  - Real-time image analysis  
  - Return of concepts with confidence levels  

##### Mobile Development  
<div align="left">
  <img src="docs/img/capacitor-logo.png" alt="Capacitor" width="80" height="80"/>
</div>

- **[Capacitor 7.4.2](https://capacitorjs.com/)**: Framework for native app development  
  - **@capacitor/camera**: Device camera access  
  - **@capacitor/filesystem**: Local file management  
  - **@capacitor/preferences**: User preferences storage  
  - **@capacitor/haptics**: Tactile feedback  
  - **@capacitor/status-bar**: Status bar management  
  - **@capacitor/keyboard**: Virtual keyboard management  

##### Recipe Database  
<div align="left">
  <img src="docs/img/mealdb-logo.png" alt="TheMealDB" width="80" height="80"/>
</div>

- **[TheMealDB API](https://www.themealdb.com/)**: Free international recipe database  
  - Over 500+ recipes from around the world  
  - Detailed ingredients with precise measurements  
  - Step-by-step instructions  
  - Nutritional information and categories  

##### Utility Libraries  
- **base-64**: Base64 encoding and decoding for images  
- **react-router-dom**: Advanced routing for React  



### Getting start 

```bash
# Clone the repository
git clone [repository-url]
cd phood-capacitor

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your credentials

# Start in development mode
npm run dev

# Build for production
npm run build

# Sync with Capacitor
npm run sync
```

##Deploy
<div align="left">
  <img src="docs/img/appflow-logo.png" alt="AWS Amplify" width="150" />
</div>
<a href="https://ionic.io/appflow" target="_blank" rel="noopener noreferrer">Ionic Appflow</a> is a powerful cloud-based DevOps platform designed specifically for Ionic apps. It simplifies app development by offering features like automated builds, live updates, and easy deployment to app stores. With seamless integration into your existing workflow, Appflow accelerates your release cycles and ensures your Ionic applications stay up-to-date and performant across all platforms.

1. Go to Ionic Appflow sign up with GitHub, and connect your repository.  
2. Select the last commit or the branch you want to build from.  
3. Add environment variables as defined in your `.env` file.  
4. Upload your Android keystore for signing the APK.  
5. Configure the build settings and select Android APK build.  
6. Start the build and download the generated APK once completed.


## Userflow
<div align="center">
<table>
  <tr>
    <td><img src="docs/img/phood-workflow.png" alt="Phood App User Flow" width="500"/></td>
    <td><img src="docs/img/phood-usage.gif" alt="Phood App Usage Demo" width="200"/></td>
  </tr>
</table>
</div>


---
