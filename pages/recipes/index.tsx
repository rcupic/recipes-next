import axios from 'axios';
import * as React from 'react';
import { IIngredient } from '../../components/Recipe/interfaces/Ingredient.interface';
import RecipeTable from '../../components/RecipeTable/RecipeTable';

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
  props?: { ingredients: IIngredient[] };
}> => {
  try {
    const { data: ingredientsData } = await axios.get<IIngredient[]>(
      `http://localhost:3001/ingredients`,
    );

    return { props: { ingredients: ingredientsData } };
  } catch (error) {
    return { props: { ingredients: [] } };
  }
};
