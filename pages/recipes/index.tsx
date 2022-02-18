import * as React from 'react';
import { IIngredient } from '../../services/interfaces/Ingredient.interface';
import RecipeTable from '../../components/RecipeTable/RecipeTable';
import { ingredientApiService } from '../../services/IngredientApi.service';

export default function RecipesIndex({
  ingredients,
}: {
  ingredients: IIngredient[];
}): JSX.Element {
  return (
    <div>
      <RecipeTable ingredients={ingredients} />
    </div>
  );
}

export const getServerSideProps = async (): Promise<{
  props: { ingredients: IIngredient[] };
}> => {
  const ingredients = await ingredientApiService.getIngredients();

  return { props: { ingredients } };
};
