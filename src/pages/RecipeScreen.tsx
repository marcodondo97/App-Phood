import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonContent,
  IonButton,
  IonIcon,
  IonCard,
  IonCardContent,
  IonSpinner,
} from '@ionic/react';
import { arrowBack, time, people, star } from 'ionicons/icons';
import { useHistory, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './RecipeScreen.css';

interface MealDBRecipe {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strInstructions: string;
  strCategory: string;
  strArea: string;
  [key: string]: string;
}

const RecipeScreen: React.FC = () => {
  const history = useHistory();
  const location = useLocation<{ dishName?: string }>();
  const [recipe, setRecipe] = useState<MealDBRecipe | null>(null);
  const [loading, setLoading] = useState(true);
  
  const dishName = location.state?.dishName || 'Unknown Dish';

  useEffect(() => {
    fetchRecipe();
  }, [dishName]);

  const fetchRecipe = async () => {
    try {
      setLoading(true);
      

      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(dishName)}`);
      const data = await response.json();
      
      if (data.meals && data.meals.length > 0) {
        setRecipe(data.meals[0]);
      } else {

        const firstWord = dishName.split(' ')[0];
        const fallbackResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(firstWord)}`);
        const fallbackData = await fallbackResponse.json();
        
        if (fallbackData.meals && fallbackData.meals.length > 0) {
          setRecipe(fallbackData.meals[0]);
        }
      }
    } catch (error) {
      // Silent fail for recipe fetch errors
    } finally {
      setLoading(false);
    }
  };

  const getIngredients = (recipe: MealDBRecipe) => {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = recipe[`strIngredient${i}`];
      const measure = recipe[`strMeasure${i}`];
      if (ingredient && ingredient.trim()) {
        ingredients.push(`${measure ? measure.trim() + ' ' : ''}${ingredient.trim()}`);
      }
    }
    return ingredients;
  };



  if (loading) {
    return (
      <IonPage className="recipe-page">
        <Navbar title="Recipe" />
        <IonContent className="recipe-content">
          <div className="recipe-container">
            <div className="loading-container">
              <div className="pizza-spinner">
                <img src="/pizza-icon.svg" alt="Pizza" className="pizza-icon" />
              </div>
              <h3>Loading recipe...</h3>
              <p>Getting the best recipe for {dishName}</p>
            </div>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  if (!recipe) {
    return (
      <IonPage className="recipe-page">
        <Navbar title="Recipe" showMenu={true} showBack={true} />
        <IonContent className="recipe-content">
          <div className="recipe-container">
            <div className="loading-container">
              <h3>Recipe not found</h3>
              <p>Sorry, we couldn't find a recipe for "{dishName}"</p>
            </div>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  const ingredients = getIngredients(recipe);
  const instructions = recipe.strInstructions.split('\r\n').filter(step => step.trim());

  return (
    <IonPage className="recipe-page">
      <Navbar title="Recipe" showMenu={true} showBack={true} />
      <IonContent className="recipe-content">
        <div className="recipe-container">

          {recipe && recipe.strMealThumb && (
            <div className="recipe-image-container">
              <img 
                src={recipe.strMealThumb} 
                alt={recipe.strMeal}
                className="recipe-image"
              />
              <div className="recipe-image-overlay">
                {recipe.strCategory && (
                  <span className="recipe-category">{recipe.strCategory}</span>
                )}
                {recipe.strArea && (
                  <span className="recipe-origin">{recipe.strArea} Cuisine</span>
                )}
              </div>
            </div>
          )}

          <IonCard className="recipe-info-card">
            <IonCardContent>
              <div className="recipe-meta">
                <div className="meta-item">
                  <IonIcon icon={star} className="meta-icon" />
                  <span>4.5</span>
                </div>
                <div className="meta-item">
                  <IonIcon icon={time} className="meta-icon" />
                  <span>30 min</span>
                </div>
                <div className="meta-item">
                  <IonIcon icon={people} className="meta-icon" />
                  <span>4 servings</span>
                </div>
              </div>
            </IonCardContent>
          </IonCard>

          <IonCard className="ingredients-card">
            <IonCardContent>
              <h2 className="section-title">Ingredients</h2>
              <ul className="ingredients-list">
                {ingredients.map((ingredient, index) => (
                  <li key={index} className="ingredient-item">
                    {ingredient}
                  </li>
                ))}
              </ul>
            </IonCardContent>
          </IonCard>

          <IonCard className="instructions-card">
            <IonCardContent>
              <h2 className="section-title">Instructions</h2>
              <ol className="instructions-list">
                {instructions.map((instruction, index) => (
                  <li key={index} className="instruction-item">
                    {instruction}
                  </li>
                ))}
              </ol>
            </IonCardContent>
          </IonCard>

          <IonButton 
            expand="block"
            className="try-again-button"
            onClick={() => history.push('/home')}
          >
            Try Another Recipe
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default RecipeScreen;
