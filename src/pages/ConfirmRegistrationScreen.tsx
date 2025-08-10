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
import { keypad, arrowBack } from 'ionicons/icons';
import { useHistory, useLocation } from 'react-router-dom';
import { confirmRegistration } from '../services/auth';
import './LoginScreen.css';

const ConfirmRegistrationScreen: React.FC = () => {
  const [confirmationCode, setConfirmationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const history = useHistory();
  const location = useLocation<{ email?: string }>();
  
  const email = location.state?.email || '';

  const handleConfirm = async () => {
    if (!confirmationCode) {
      setAlertMessage('Please enter the confirmation code');
      setShowAlert(true);
      return;
    }

    if (!email) {
      setAlertMessage('Email not found. Please try registering again.');
      setShowAlert(true);
      return;
    }

    setLoading(true);
    try {
      const result = await confirmRegistration({ email, confirmationCode });
      
      if (result.success) {
        setAlertMessage('Account confirmed successfully! Please sign in.');
        setShowAlert(true);
        setTimeout(() => {
          history.push('/login');
        }, 2000);
      } else {
        setAlertMessage(result.error || 'Confirmation failed');
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
            <h2 className="login-subtitle">Confirm Account</h2>
            <p className="login-description">
              We sent a confirmation code to {email}
            </p>
          </div>

          <div className="login-form">
            <div className="input-container">
              <IonIcon icon={keypad} className="input-icon" />
              <IonInput
                type="text"
                placeholder="Confirmation Code"
                value={confirmationCode}
                onIonInput={(e) => setConfirmationCode(e.detail.value!)}
                className="custom-input"
              />
            </div>

            <IonButton
              expand="block"
              className="login-button"
              onClick={handleConfirm}
              disabled={loading}
            >
              {loading ? 'Confirming...' : 'Confirm Account'}
            </IonButton>

            <IonButton
              expand="block"
              fill="clear"
              className="register-button"
              onClick={() => history.push('/login')}
            >
              Back to Sign In
            </IonButton>
          </div>
        </div>

        <IonLoading isOpen={loading} message="Confirming account..." />
        
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header={alertMessage.includes('successfully') ? 'Success' : 'Error'}
          message={alertMessage}
          buttons={['OK']}
        />
      </IonContent>
    </IonPage>
  );
};

export default ConfirmRegistrationScreen;
