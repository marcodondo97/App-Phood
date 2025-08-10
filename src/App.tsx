import React, { useState, useEffect } from 'react';
import { IonApp, IonRouterOutlet, IonSpinner, setupIonicReact, IonMenu, IonContent, IonList, IonItem, IonLabel, IonIcon } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route, Redirect, useHistory } from 'react-router-dom';
import { informationCircle, person } from 'ionicons/icons';
import { menuController } from '@ionic/core/components';

import { Amplify } from 'aws-amplify';
import { SETTINGS } from './config/settings';

// Pages
import LoginScreen from './pages/LoginScreen';
import RegisterScreen from './pages/RegisterScreen';
import ConfirmRegistrationScreen from './pages/ConfirmRegistrationScreen';
import HomeScreen from './pages/HomeScreen';
import AnalyzeScreen from './pages/AnalyzeScreen';
import RecipeScreen from './pages/RecipeScreen';
import AboutScreen from './pages/AboutScreen';
import ProfileScreen from './pages/ProfileScreen';

// Components
import GlobalMenu from './components/GlobalMenu';

// Services
import { AuthUser, checkAuthStatus } from './services/auth';

// Styles
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import './theme/variables.css';

setupIonicReact();

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: SETTINGS.aws.cognito.userPoolId,
      userPoolClientId: SETTINGS.aws.cognito.userPoolClientId,
    }
  }
});

const App: React.FC = () => {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const status = await checkAuthStatus();
        setCurrentUser(status.isAuthenticated && status.user ? status.user : null);
      } catch (error) {

        setCurrentUser(null);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    initAuth();
  }, []);

  const handleLoginSuccess = (user: AuthUser) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  if (isCheckingAuth) {
    return (
      <IonApp>
        <div className="ion-padding" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <IonSpinner name="crescent"></IonSpinner>
        </div>
      </IonApp>
    );
  }

  const isSignedIn = Boolean(currentUser);

  if (!isSignedIn) {
    return (
      <IonApp>
        <IonReactRouter>
          <IonRouterOutlet id="main-content">
            <Route path="/login" render={() => <LoginScreen onLoginSuccess={handleLoginSuccess} />} />
            <Route path="/register" component={RegisterScreen} />
            <Route path="/confirm-registration" component={ConfirmRegistrationScreen} />
            <Route exact path="/" render={() => <Redirect to="/login" />} />
          </IonRouterOutlet>
        </IonReactRouter>
      </IonApp>
    );
  }

  return (
    <IonApp>
      <IonReactRouter>
        <GlobalMenu />
        <IonRouterOutlet id="main-content">
          <Route path="/home" render={() => <HomeScreen user={currentUser} />} />
          <Route path="/analyze" component={AnalyzeScreen} />
          <Route path="/recipe" component={RecipeScreen} />
          <Route path="/about" component={AboutScreen} />
          <Route path="/profile" render={() => <ProfileScreen user={currentUser} onLogout={handleLogout} />} />
          <Route exact path="/" render={() => <Redirect to="/home" />} />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
