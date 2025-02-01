export interface RecipeI {
  id: string; // it can be something like (71f, 902k, 692, etc.)
  title: string;
  description: string;
  ingredients: string[];
  instructions: string;
  imageUrl: string;
  isFavorite?: boolean;
}
