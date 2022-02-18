import axios from 'axios';
import * as React from 'react';
import { IIngredient } from '../../components/Recipe/interfaces/Ingredient.interface';
import { IRecipe } from '../../components/Recipe/interfaces/Recipe.interface';
import Recipe from '../../components/Recipe/UpdateRecipe';

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
}): Promise<{
  props?: { recipe: IRecipe; ingredients: IIngredient[] };
  notFound?: boolean;
}> => {
  try {
    const { data } = await axios.get<IRecipe>(
      `http://localhost:3001/recipes/${id}`,
    );
    const { data: ingredientsData } = await axios.get<IIngredient[]>(
      `http://localhost:3001/ingredients`,
    );

    return { props: { recipe: data, ingredients: ingredientsData } };
  } catch (error) {
    return { notFound: true };
  }
};
