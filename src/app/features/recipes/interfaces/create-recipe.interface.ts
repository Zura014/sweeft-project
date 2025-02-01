export interface CreateRecipeI {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string;
  imageUrl: string;
  isFavorite?: boolean;
}
