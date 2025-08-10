import React, { useState } from 'react';
import {
  IonPage,
  IonContent,
  IonButton,
  IonInput,
  IonText,
  IonIcon,
  IonLoading,
  IonAlert,
} from '@ionic/react';
import { mail, lockClosed, eye, eyeOff } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { loginUser } from '../services/auth';
import './LoginScreen.css';

interface LoginScreenProps {
  onLoginSuccess: (user: any) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const history = useHistory();

  const handleLogin = async () => {
    if (!email || !password) {
      setAlertMessage('Please fill in all fields');
      setShowAlert(true);
      return;
    }

    setLoading(true);
    try {
      const result = await loginUser({ email, password });
      
      if (result.success && result.user) {
        onLoginSuccess(result.user);
        history.push('/home');
      } else {
        setAlertMessage(result.error || 'Please check your credentials');
        setShowAlert(true);
      }
    } catch (error) {
      setAlertMessage('An unexpected error occurred');
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonContent className="login-content">
        <div className="login-container">
          <div className="login-header">
            <h1 className="login-logo">Phood</h1>
            <h2 className="login-subtitle">Welcome back!</h2>
            <p className="login-description">Sign in to continue discovering recipes</p>
          </div>

          <div className="login-form">
            <div className="input-container">
              <IonIcon icon={mail} className="input-icon" />
              <IonInput
                type="email"
                placeholder="Email"
                value={email}
                onIonInput={(e) => setEmail(e.detail.value!)}
                className="custom-input"
              />
            </div>

            <div className="input-container">
              <IonIcon icon={lockClosed} className="input-icon" />
              <IonInput
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onIonInput={(e) => setPassword(e.detail.value!)}
                className="custom-input"
              />
              <IonIcon
                icon={showPassword ? eyeOff : eye}
                className="eye-icon"
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>

            <IonButton
              expand="block"
              className="login-button"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </IonButton>

            <div className="divider">
              <div className="divider-line"></div>
              <span className="divider-text">or</span>
              <div className="divider-line"></div>
            </div>

            <IonButton
              expand="block"
              fill="clear"
              className="register-button"
              onClick={() => history.push('/register')}
            >
              Create new account
            </IonButton>
          </div>
        </div>

        <IonLoading isOpen={loading} message="Signing in..." />
        
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header="Error"
          message={alertMessage}
          buttons={['OK']}
        />
      </IonContent>
    </IonPage>
  );
};

export default LoginScreen;
