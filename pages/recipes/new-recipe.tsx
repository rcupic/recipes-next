import React from 'react';
import CreateRecipe from '../../components/Recipe/CreateRecipe';
import { ingredientApiService } from '../../services/IngredientApi.service';
import { IIngredient } from '../../services/interfaces/Ingredient.interface';

export default function RecipesIndex({
  ingredients,
}: {
  ingredients: IIngredient[];
}): JSX.Element {
  return <CreateRecipe ingredients={ingredients} />;
}

export const getServerSideProps = async (): Promise<{
  props: { ingredients: IIngredient[] };
}> => {
  const ingredients = await ingredientApiService.getIngredients();

  return { props: { ingredients } };
};
