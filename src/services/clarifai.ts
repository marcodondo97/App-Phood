import { CLARIFAI } from '../config/clarifaiConfig';
import { SETTINGS } from '../config/settings';

export async function predictFoodConcepts(base64Image: string): Promise<Array<{ name: string; value: number }>> {
  const PAT = CLARIFAI.PAT;
  const USER_ID = CLARIFAI.USER_ID;
  const APP_ID = CLARIFAI.APP_ID;
  const MODEL_ID = CLARIFAI.MODEL_ID;
  const MODEL_VERSION_ID = CLARIFAI.MODEL_VERSION_ID;

  try {
    const cleanBase64 = base64Image.replace(/^data:image\/[a-z]+;base64,/, '');

    const raw = JSON.stringify({
        "user_app_id": {
            "user_id": USER_ID,
            "app_id": APP_ID
        },
        "inputs": [
            {
                "data": {
                    "image": {
                        "base64": cleanBase64
                    }
                }
            }
        ]
    });

    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Key ' + PAT
        },
        body: raw
    };

    const originalUrl = `https://api.clarifai.com/v2/models/${MODEL_ID}/versions/${MODEL_VERSION_ID}/outputs`;
    
    const proxies = [
      `${SETTINGS.corsProxies[0]}${originalUrl}`,
      `${SETTINGS.corsProxies[1]}${encodeURIComponent(originalUrl)}`,
      `${SETTINGS.corsProxies[2]}${encodeURIComponent(originalUrl)}`
    ];
    
    let response: Response | null = null;
    let lastError: Error | null = null;
    
    for (const proxyUrl of proxies) {
      try {
        response = await fetch(proxyUrl, requestOptions);
        if (response.ok) {
          break;
        }
      } catch (error) {
        lastError = error as Error;
        response = null;
      }
    }
    
    if (!response) {
      throw lastError || new Error('All CORS proxies failed');
    }
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Clarifai API error: ${response.status} - ${errorText}`);
    }

    const result = await response.text();
    const resultData = JSON.parse(result);
    if (!resultData.outputs || resultData.outputs.length === 0) {
      throw new Error('No outputs received from Clarifai');
    }
    
    const output = resultData.outputs[0];
    if (!output.data || !output.data.concepts) {
      throw new Error('No concepts found in Clarifai response');
    }
    
    const concepts = output.data.concepts;
    const foodConcepts: Array<{ name: string; value: number }> = [];
    
    for (const concept of concepts) {
      if (concept.name && concept.value && concept.value > 0.1) {
        foodConcepts.push({
          name: concept.name,
          value: concept.value
        });
      }
    }
    
    if (foodConcepts.length === 0) {
      throw new Error('No food concepts detected with sufficient confidence');
    }
    
    return foodConcepts.sort((a, b) => b.value - a.value);
  } catch (error) {
    throw error;
  }
}

