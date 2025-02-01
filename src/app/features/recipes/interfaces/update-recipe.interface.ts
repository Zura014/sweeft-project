export interface UpdateRecipeI {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string;
  imageUrl: string;
  isFavorite?: boolean;
}
