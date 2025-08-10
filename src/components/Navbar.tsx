import React from 'react';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonIcon,
  IonMenuButton,
  IonButton
} from '@ionic/react';
import { arrowBack } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import './Navbar.css';

interface NavbarProps {
  title?: string;
  showMenu?: boolean;
  showBack?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ title = "Phood", showMenu = true, showBack = false }) => {
  const history = useHistory();

  const handleBackClick = () => {
    history.goBack();
  };

  return (
    <IonHeader>
      <IonToolbar color="primary" className="custom-toolbar">
        {showBack && (
          <IonButton 
            fill="clear" 
            slot="start"
            onClick={handleBackClick}
            className="back-button-navbar"
          >
            <IonIcon icon={arrowBack} />
          </IonButton>
        )}
        
        <IonTitle className="navbar-title">
          {title}
        </IonTitle>
        
        {showMenu && (
          <IonMenuButton 
            slot="end" 
            className="menu-button-custom"
          />
        )}
      </IonToolbar>
    </IonHeader>
  );
};

export default Navbar;
