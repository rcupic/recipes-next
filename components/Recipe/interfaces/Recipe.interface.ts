export interface IRecipe {
  id: string;
  name: string;
  description: string;
  ingredients: { id: string; name: string }[];
}
