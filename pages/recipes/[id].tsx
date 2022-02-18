import * as React from 'react';
import { IIngredient } from '../../services/interfaces/Ingredient.interface';
import { IRecipe } from '../../services/interfaces/Recipe.interface';
import Recipe from '../../components/Recipe/UpdateRecipe';
import { recipeApiService } from '../../services/RecipeApi.service';
import { ingredientApiService } from '../../services/IngredientApi.service';

export default function RecipesIndex({
  recipe,
  ingredients,
}: {
  recipe: IRecipe;
  ingredients: IIngredient[];
}): JSX.Element {
  return <Recipe recipe={recipe} ingredients={ingredients} />;
}

export const getServerSideProps = async ({
  query: { id },
}: {
  query: { id: string };
}): Promise<{
  props?: { recipe: IRecipe; ingredients: IIngredient[] };
  notFound?: boolean;
}> => {
  try {
    const recipe = await recipeApiService.getRecipeById(id);

    if (!recipe) {
      return { notFound: true };
    }

    const ingredients = await ingredientApiService.getIngredients();

    return { props: { recipe, ingredients } };
  } catch (error) {
    return { notFound: true };
  }
};
