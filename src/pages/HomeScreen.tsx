import React, { useState } from 'react';
import {
  IonPage,
  IonContent,
  IonButton,
  IonIcon,
  IonAlert,
  IonLoading,
} from '@ionic/react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { camera, images } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { AuthUser } from '../services/auth';
import Navbar from '../components/Navbar';
import './HomeScreen.css';

interface HomeScreenProps {
  user?: AuthUser | null;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ user }) => {
  const [busy, setBusy] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const history = useHistory();

  const takePhoto = async () => {
    if (busy) return;
    
    try {
      setBusy(true);
      
      const image = await Camera.getPhoto({
        quality: 50,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera
      });
      
      setBusy(false);
      

      if (image.base64String && image.base64String.length > 100) {

        const photoData = image.base64String.startsWith('data:') 
          ? image.base64String 
          : `data:image/jpeg;base64,${image.base64String}`;
        
        history.push('/analyze', { photoBase64: photoData });
      } else {
        setAlertMessage('Photo capture failed. Please try again.');
        setShowAlert(true);
      }
      
    } catch (error) {
      setBusy(false);
      setAlertMessage('Failed to access camera. Please try again.');
      setShowAlert(true);
    }
  };

  const pickImage = async () => {
    if (busy) return;
    
    try {
      setBusy(true);
      
      const image = await Camera.getPhoto({
        quality: 50,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Photos
      });
      
      setBusy(false);
      

      if (image.base64String && image.base64String.length > 100) {

        const photoData = image.base64String.startsWith('data:') 
          ? image.base64String 
          : `data:image/${image.format || 'jpeg'};base64,${image.base64String}`;
        
        history.push('/analyze', { photoBase64: photoData });
      } else {
        setAlertMessage('Image selection failed. Please try again.');
        setShowAlert(true);
      }
      
    } catch (error) {
      setBusy(false);
      setAlertMessage('Failed to access gallery. Please try again.');
      setShowAlert(true);
    }
  };

  return (
    <IonPage>
      <Navbar title="Phood" />
      <IonContent className="home-content">
        <div className="home-container">


          <div className="hero-section">
            <div className="hero-image-container">
              <img 
                src="/pizza-hero.jpg" 
                alt="Food recognition" 
                className="hero-image"
                onError={(e) => {
                  // Fallback if image doesn't exist
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="hero-overlay">
                <h2 className="hero-title">Identify your dish</h2>
                <p className="hero-subtitle">Get ingredients and recipe ideas</p>
              </div>
            </div>
          </div>

          <div className="actions-container">
            <IonButton
              expand="block"
              className="primary-button"
              onClick={takePhoto}
              disabled={busy}
            >
              <IonIcon icon={camera} slot="start" />
              {busy ? 'Opening Camera...' : 'Take Photo'}
            </IonButton>

            <IonButton
              expand="block"
              fill="outline"
              className="secondary-button"
              onClick={pickImage}
              disabled={busy}
            >
              <IonIcon icon={images} slot="start" />
              {busy ? 'Opening Gallery...' : 'Gallery'}
            </IonButton>
          </div>
        </div>

        <IonLoading isOpen={busy} message="Loading..." />
        
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

export default HomeScreen;
