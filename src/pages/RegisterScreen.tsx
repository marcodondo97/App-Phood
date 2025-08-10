import React, { useState } from 'react';
import {
  IonPage,
  IonContent,
  IonButton,
  IonInput,
  IonIcon,
  IonLoading,
  IonAlert,
} from '@ionic/react';
import { mail, lockClosed, arrowBack } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { registerUser } from '../services/auth';
import './LoginScreen.css';

const RegisterScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const history = useHistory();

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      setAlertMessage('Please fill in all fields');
      setShowAlert(true);
      return;
    }

    if (password !== confirmPassword) {
      setAlertMessage('Passwords do not match');
      setShowAlert(true);
      return;
    }

    if (password.length < 8) {
      setAlertMessage('Password must be at least 8 characters long');
      setShowAlert(true);
      return;
    }

    setLoading(true);
    try {
      const result = await registerUser({ email, password });
      
      if (result.success) {
        history.push('/confirm-registration', { email });
      } else {
        setAlertMessage(result.error || 'Registration failed');
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
            <IonButton 
              fill="clear" 
              onClick={() => history.goBack()}
              style={{ alignSelf: 'flex-start', margin: '0 0 20px 0' }}
            >
              <IonIcon icon={arrowBack} />
            </IonButton>
            <h1 className="login-logo">Phood</h1>
            <h2 className="login-subtitle">Create Account</h2>
            <p className="login-description">Join us to discover amazing recipes</p>
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
                type="password"
                placeholder="Password"
                value={password}
                onIonInput={(e) => setPassword(e.detail.value!)}
                className="custom-input"
              />
            </div>

            <div className="input-container">
              <IonIcon icon={lockClosed} className="input-icon" />
              <IonInput
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onIonInput={(e) => setConfirmPassword(e.detail.value!)}
                className="custom-input"
              />
            </div>

            <IonButton
              expand="block"
              className="login-button"
              onClick={handleRegister}
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </IonButton>

            <IonButton
              expand="block"
              fill="clear"
              className="register-button"
              onClick={() => history.push('/login')}
            >
              Already have an account? Sign In
            </IonButton>
          </div>
        </div>

        <IonLoading isOpen={loading} message="Creating account..." />
        
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

export default RegisterScreen;
