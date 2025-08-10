import React from 'react';
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardContent,
} from '@ionic/react';
import Navbar from '../components/Navbar';
import './AboutScreen.css';

const AboutScreen: React.FC = () => {

  return (
    <IonPage>
      <Navbar title="About" showMenu={true} showBack={true} />
      <IonContent className="about-content">
        <div className="about-container">

          <IonCard className="about-card">
            <IonCardContent>
              <div className="about-logo">
                <h2 className="logo-text">Phood</h2>
              </div>
              
              <p className="about-description">
                Phood is an AI-powered food recognition app that helps you identify dishes 
                and discover amazing recipes. Simply take a photo of your food and let our 
                advanced machine learning algorithms do the rest!
              </p>

              <div className="features-list">
                <h3>Features:</h3>
                <ul>
                  <li>🤖 AI-powered food recognition</li>
                  <li>📱 Easy photo capture</li>
                  <li>🍳 Detailed recipe instructions</li>
                  <li>📋 Complete ingredient lists</li>
                  <li>⏱️ Cooking time estimates</li>
                  <li>👥 Serving size information</li>
                </ul>
              </div>

              <div className="app-info">
                <p><strong>Version:</strong> 1.0.0</p>
                <p><strong>Developer:</strong> Marco Dondo</p>
                <p><strong>Last Updated:</strong> {new Date().getFullYear()}</p>
              </div>
            </IonCardContent>
          </IonCard>


        </div>
      </IonContent>
    </IonPage>
  );
};

export default AboutScreen;
