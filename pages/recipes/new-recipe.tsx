import axios from 'axios';
import CreateRecipe from '../../components/Recipe/CreateRecipe';
import { IIngredient } from '../../components/Recipe/interfaces/Ingredient.interface';

export default function RecipesIndex({
  ingredients,
}: {
  ingredients: IIngredient[];
}): JSX.Element {
  return <CreateRecipe ingredients={ingredients} />;
}

export const getServerSideProps = async (): Promise<{
  props?: { ingredients: IIngredient[] };
  notFound?: true;
}> => {
  try {
    const { data: ingredientsData } = await axios.get<IIngredient[]>(
      `http://localhost:3001/ingredients`,
    );

    return { props: { ingredients: ingredientsData } };
  } catch (error) {
    return { notFound: true };
  }
};
