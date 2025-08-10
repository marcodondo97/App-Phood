import React, { useEffect } from 'react';
import {
  IonMenu,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
} from '@ionic/react';
import { informationCircle, person } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { menuController } from '@ionic/core/components';
import './Navbar.css';

const GlobalMenu: React.FC = () => {
  const history = useHistory();

  useEffect(() => {
    const handleMenuStateChange = () => {

      menuController.isOpen().then(isOpen => {
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
          if (isOpen) {

            const focusedElement = mainContent.querySelector(':focus') as HTMLElement;
            if (focusedElement) {
              focusedElement.blur();
            }

            mainContent.setAttribute('inert', '');
          } else {

            mainContent.removeAttribute('inert');
          }
        }
      });
    };


    document.addEventListener('ionMenuDidOpen', handleMenuStateChange);
    document.addEventListener('ionMenuDidClose', handleMenuStateChange);

    return () => {
      document.removeEventListener('ionMenuDidOpen', handleMenuStateChange);
      document.removeEventListener('ionMenuDidClose', handleMenuStateChange);
    };
  }, []);

  const handleMenuClick = (path: string) => {
    // Close menu before navigating
    menuController.close().then(() => {
      history.push(path);
    });
  };

  return (
    <IonMenu 
      side="end" 
      contentId="main-content" 
      className="custom-menu"
    >
      <IonContent>
        <div className="menu-header">
          <h3>Menu</h3>
        </div>
        <IonList className="menu-list">
          <IonItem 
            button={true}
            detail={false}
            onClick={() => handleMenuClick('/about')}
            className="menu-item clickable-item"
          >
            <IonIcon icon={informationCircle} slot="start" color="primary" />
            <IonLabel>About</IonLabel>
          </IonItem>
          
          <IonItem 
            button={true}
            detail={false}
            onClick={() => handleMenuClick('/profile')}
            className="menu-item clickable-item"
          >
            <IonIcon icon={person} slot="start" color="primary" />
            <IonLabel>Profile</IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default GlobalMenu;
