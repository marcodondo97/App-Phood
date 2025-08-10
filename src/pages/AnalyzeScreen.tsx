import React, { useState, useEffect, useMemo } from 'react';
import {
  IonPage,
  IonContent,
  IonButton,
  IonIcon,
  IonLoading,
  IonAlert,
  IonCard,
  IonCardContent,
  IonSpinner,
} from '@ionic/react';
import { arrowBack, chevronForward } from 'ionicons/icons';
import { useHistory, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { predictFoodConcepts } from '../services/clarifai';
import './AnalyzeScreen.css';

const AnalyzeScreen: React.FC = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [results, setResults] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const history = useHistory();
  const location = useLocation<{ photoBase64?: string }>();
  
  const photoBase64 = location.state?.photoBase64;
  

  const isValidPhoto = photoBase64 && 
    typeof photoBase64 === 'string' && 
    photoBase64.length > 100;
  

  const cacheKey = useMemo(() => {
    const createImageHash = (base64String: string): string => {
      if (!base64String || base64String.length < 100) return '';
      

      const start = base64String.substring(50, 100);
      const middle = base64String.substring(Math.floor(base64String.length / 2), Math.floor(base64String.length / 2) + 50);
      const end = base64String.substring(base64String.length - 100, base64String.length - 50);
      

      const combined = start + middle + end + base64String.length;
      let hash = 0;
      for (let i = 0; i < combined.length; i++) {
        const char = combined.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
      }
      return Math.abs(hash).toString(36);
    };
    
    return isValidPhoto ? `analyze_results_${createImageHash(photoBase64)}` : null;
  }, [photoBase64, isValidPhoto]);

  useEffect(() => {
    
               // If we don't have a valid photo, don't analyze but allow viewing cached results
      if (!isValidPhoto) {
        // Check if there are existing results (for example when returning from recipe)
        if (results.length === 0) {
          setAlertMessage('No image to analyze. Please take a photo from the home screen.');
          setShowAlert(true);
          // Don't redirect automatically - let the user decide
        }
        return;
      }

      // If we have a valid photo, proceed with analysis
      if (cacheKey) {
        // Check cache first
        const cachedResults = sessionStorage.getItem(cacheKey);
        if (cachedResults) {
          try {
            const parsed = JSON.parse(cachedResults);
            if (parsed && parsed.length > 0) {
              setResults(parsed);
              setResult(parsed[0]);
              // Don't set selectedIndex - keep -1 (no visual selection)
              return;
            }
          } catch (error) {
            sessionStorage.removeItem(cacheKey);
          }
        }
        
        if (results.length === 0 && !analyzing) {
          // Only analyze if there are no existing results
          analyzeImage();
        }
      }
  }, [photoBase64, isValidPhoto, cacheKey]);

     const analyzeImage = async () => {
     // Rigorous validation before analysis
    if (!isValidPhoto) {
      setAlertMessage('Invalid image data. Please take a new photo.');
      setShowAlert(true);
      setTimeout(() => history.replace('/home'), 2000);
      return;
    }

    // Double check: don't analyze if results already exist
    if (results.length > 0) {
      return;
    }
    setAnalyzing(true);
    setResults([]);
    setResult(null);
    
    try {
      // Use Clarifai API to analyze the image
      const concepts = await predictFoodConcepts(photoBase64);
      
      if (concepts && concepts.length > 0) {
        // Get top 5 food concepts with highest confidence
        const sortedConcepts = concepts
          .sort((a, b) => b.value - a.value)
          .slice(0, 5);
        
        const foodNames = sortedConcepts.map(concept => {
          // Capitalize first letter and format food names
          return concept.name
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
        });
        
        setResults(foodNames);
        setResult(foodNames[0]); // Set the first result as main
        // Don't set selectedIndex - keep -1 (no visual selection)
        
        // Save to cache to avoid re-analysis
        if (cacheKey && foodNames.length > 0) {
          try {
            sessionStorage.setItem(cacheKey, JSON.stringify(foodNames));
          } catch (cacheError) {
            // Silent fail for cache errors
          }
        }
      } else {
        // If no concepts detected, show an error
        throw new Error('No food items detected in the image');
      }
    } catch (error) {
      // Show the REAL error to the user - no fake results!
      let errorMessage = 'Failed to analyze image with Clarifai';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setAlertMessage(`Clarifai Error: ${errorMessage}`);
      setShowAlert(true);
    } finally {
      setAnalyzing(false);
    }
  };

     const handleResultClick = (dishName: string, index: number) => {
     setSelectedIndex(index); // Update selection
     setResult(dishName); // Update main result
     history.push('/recipe', { dishName });
   };



  const goToRecipe = () => {
    if (result) {
      history.push('/recipe', { dishName: result });
    }
  };

  return (
    <IonPage>
      <Navbar title="Analyze Food" showMenu={true} showBack={true} />
      <IonContent className="analyze-content">
        <div className="analyze-container">

          {isValidPhoto && (
            <div className="image-container">
              <img 
                src={photoBase64.startsWith('data:') ? photoBase64 : `data:image/jpeg;base64,${photoBase64}`}
                alt="Food to analyze"
                className="analyze-image"
                                onError={(e) => {
                  // Don't hide the image, show a placeholder instead
                  e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBFcnJvcjwvdGV4dD48L3N2Zz4=';
                }}
              />
            </div>
          )}

          {!isValidPhoto && results.length === 0 && !analyzing && (
            <IonCard className="result-card">
              <IonCardContent>
                <div className="result-content">
                  <h3>No Image to Analyze</h3>
                  <p>Please take a photo from the home screen to analyze food.</p>
                  <IonButton 
                    expand="block"
                    onClick={() => history.push('/home')}
                    className="primary-button"
                  >
                    Take Photo
                  </IonButton>
                </div>
              </IonCardContent>
            </IonCard>
          )}

          {analyzing && (
            <IonCard className="result-card">
              <IonCardContent>
                <div className="analyzing-content">
                  <div className="pizza-spinner">
                    <img src="/pizza-icon.svg" alt="Pizza" className="pizza-icon" />
                  </div>
                  <h3 className="analyzing-title">Analyzing your delicious dish...</h3>
                  <p className="analyzing-subtitle">Our AI is identifying the ingredients and finding the best recipe for you!</p>
                </div>
              </IonCardContent>
            </IonCard>
          )}

          {results.length > 0 && !analyzing && (
            <IonCard className="result-card">
              <IonCardContent>
                <div className="result-content">
                  <p className="results-hint">Tap to see recipe:</p>
                  <div className="results-list">
                    {results.map((dish, index) => (
                      <div 
                        key={index}
                        className={`result-item ${index === selectedIndex ? 'primary' : ''}`}
                        onClick={() => handleResultClick(dish, index)}
                      >
                        <span className="result-rank">#{index + 1}</span>
                        <span className="result-name">{dish}</span>
                        <IonIcon icon={chevronForward} className="result-arrow" />
                      </div>
                    ))}
                  </div>
                </div>
              </IonCardContent>
            </IonCard>
          )}


        </div>

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => {
            setShowAlert(false);
          }}
          header="Error"
          message={alertMessage}
          buttons={[
            {
              text: 'Stay Here',
              role: 'cancel',
              handler: () => {
                setShowAlert(false);
              }
            },
            {
              text: 'Take Photo',
              handler: () => {
                setShowAlert(false);
                history.replace('/home');
              }
            }
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default AnalyzeScreen;
