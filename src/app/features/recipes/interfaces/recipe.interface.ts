export interface RecipeI {
  id: string; // Unique identifier for the recipe
  title: string; // Name of the recipe
  description: string; // Brief description of the recipe
  ingredients: string[]; // List of ingredients required
  instructions: string; // Cooking instructions
  imageUrl: string; // URL of the recipe image
  isFavorite: boolean; // Flag to indicate if the recipe is marked as a favorite
}
