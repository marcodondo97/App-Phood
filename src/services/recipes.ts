export type MealDbMeal = {
  strMeal: string;
  strMealThumb: string;
  strArea: string;
  strInstructions: string;
  [key: string]: string;
};



export async function fetchRecipeFromMealDb(query: string): Promise<MealDbMeal | null> {
  try {
    const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query)}`;
    const response = await fetch(url, { method: 'GET' });
    if (!response.ok) return null;
    const json = await response.json();
    const meal = json?.meals?.[0] ?? null;
    return meal;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to recipe service');
    }
    throw error;
  }
}







export function extractIngredientsWithMeasures(meal: MealDbMeal): string[] {
  const items: string[] = [];
  for (let i = 1; i <= 20; i += 1) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    const normalized = `${ingredient ?? ''}`.trim();
    const normalizedMeasure = `${measure ?? ''}`.trim();
    if (normalized) {
      const combined = normalizedMeasure ? `${normalized} ${normalizedMeasure}` : normalized;
      if (combined && combined !== 'null null') items.push(combined);
    }
  }
  return items;
}




export async function fetchRecipeFromMultipleSources(query: string): Promise<{
  title: string;
  img: string;
  origin?: string;
  ingredients: string[];
  instructions: string;
  source: string;
} | null> {
  try {
    // Use only TheMealDB (always working and free)
    const mealDbResult = await fetchRecipeFromMealDb(query);
    if (mealDbResult) {
      return {
        title: mealDbResult.strMeal,
        img: mealDbResult.strMealThumb,
        origin: mealDbResult.strArea,
        ingredients: extractIngredientsWithMeasures(mealDbResult),
        instructions: mealDbResult.strInstructions,
        source: 'TheMealDB'
      };
    }

    return null;
  } catch (error) {
    return null;
  }
}


