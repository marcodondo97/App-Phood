import React, { useState } from 'react';
import {
  IonPage,
  IonContent,
  IonButton,
  IonIcon,
  IonCard,
  IonCardContent,
  IonAlert,
} from '@ionic/react';
import { arrowBack, person, mail, logOut, trash } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { AuthUser, logoutUser, deleteUserAccount } from '../services/auth';
import Navbar from '../components/Navbar';
import './ProfileScreen.css';

interface ProfileScreenProps {
  user?: AuthUser | null;
  onLogout?: () => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ user, onLogout }) => {
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const history = useHistory();

  const handleLogout = async () => {
    try {
      await logoutUser();
      onLogout?.();
      history.push('/login');
    } catch (error) {
      // Silent fail for logout errors
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const result = await deleteUserAccount();
      if (result.success) {
        onLogout?.();
        history.push('/login');
      }
    } catch (error) {
      // Silent fail for delete account errors
    }
  };

  return (
    <IonPage>
      <Navbar title="Profile" showMenu={true} showBack={true} />
      <IonContent className="profile-content">
        <div className="profile-container">

          <IonCard className="profile-info-card">
            <IonCardContent>
              <div className="profile-avatar">
                <IonIcon icon={person} className="avatar-icon" />
              </div>
              <div className="profile-details">
                <div className="detail-item">
                  <IonIcon icon={mail} className="detail-icon" />
                  <span className="detail-text">{user?.email || 'No email'}</span>
                </div>
                <div className="detail-item">
                  <IonIcon icon={person} className="detail-icon" />
                  <span className="detail-text">{user?.userId || 'No user ID'}</span>
                </div>
              </div>
            </IonCardContent>
          </IonCard>

          <div className="profile-actions">
            <IonButton 
              expand="block"
              fill="outline"
              className="logout-button"
              onClick={() => {
                setShowLogoutAlert(true);
              }}
            >
              <IonIcon icon={logOut} slot="start" />
              Sign Out
            </IonButton>

            <IonButton 
              expand="block"
              fill="outline"
              className="delete-button"
              onClick={() => {
                setShowDeleteAlert(true);
              }}
            >
              <IonIcon icon={trash} slot="start" />
              Delete Account
            </IonButton>
          </div>

          <div className="app-info">
            <p className="app-version">Phood v1.0.0</p>
            <IonButton 
              fill="clear"
              className="about-button"
              onClick={() => {
                history.push('/about');
              }}
            >
              About
            </IonButton>
          </div>
        </div>

        <IonAlert
          isOpen={showLogoutAlert}
          onDidDismiss={() => setShowLogoutAlert(false)}
          header="Sign Out"
          message="Are you sure you want to sign out?"
          buttons={[
            {
              text: 'Cancel',
              role: 'cancel'
            },
            {
              text: 'Sign Out',
              handler: handleLogout
            }
          ]}
        />

        <IonAlert
          isOpen={showDeleteAlert}
          onDidDismiss={() => setShowDeleteAlert(false)}
          header="Delete Account"
          message="Are you sure you want to delete your account? This action cannot be undone."
          buttons={[
            {
              text: 'Cancel',
              role: 'cancel'
            },
            {
              text: 'Delete',
              handler: handleDeleteAccount
            }
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default ProfileScreen;
