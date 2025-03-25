import axios from 'axios';
import { env } from 'process';

// OpenWeatherMap API configuration
// Using a direct API key for development - in production, use environment variables
const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Interface for weather data
export interface WeatherData {
  description: string;
  temperature: number;
  icon: string;
}

export const extractLocationFromText = (text: string): string | null => {
  // Enhanced location extraction logic
  const locationKeywords = ['in', 'at', 'near', 'around', 'on'];
  const words = text.split(' ');
  
  for (let i = 0; i < words.length; i++) {
    if (locationKeywords.includes(words[i].toLowerCase()) && i < words.length - 1) {
      // Get the location phrase (up to 2 words after the keyword)
      let location = words[i + 1].replace(/[.,!?;:]/g, '');
      
      // If there's another word and it's not a keyword, include it (for "New York", etc.)
      if (i + 2 < words.length && !locationKeywords.includes(words[i + 2].toLowerCase())) {
        location += ' ' + words[i + 2].replace(/[.,!?;:]/g, '');
      }
      
      return location;
    }
  }
  
  return null;
};

// Function to get weather data for a location
export const getWeatherByLocation = async (location: string): Promise<WeatherData | null> => {
  try {
    console.log(`Fetching weather for location: ${location}`);
    
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        q: location,
        appid: API_KEY,
        units: 'metric' // Use metric units for temperature in Celsius
      }
    });
    
    console.log('Weather API response:', response.data);
    
    const weatherData: WeatherData = {
      description: response.data.weather[0].description,
      temperature: response.data.main.temp,
      icon: `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
    };
    
    return weatherData;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
};

// Function to handle the entire weather fetching process
export const processWeatherForTodo = async (todoText: string): Promise<{ location: string; weather: WeatherData } | null> => {
  // Try to extract location from text
  const extractedLocation = extractLocationFromText(todoText);
  
  console.log(`Extracted location: ${extractedLocation}`);
  
  if (!extractedLocation) {
    return null;
  }
  
  try {
    const weatherData = await getWeatherByLocation(extractedLocation);
    
    if (weatherData) {
      return {
        location: extractedLocation,
        weather: weatherData
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error processing weather for todo:', error);
    return null;
  }
};