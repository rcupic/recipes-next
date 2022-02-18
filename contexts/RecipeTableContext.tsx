import React from 'react';
import { IIngredient } from '../components/Recipe/interfaces/Ingredient.interface';

export const RecipeTableContext = React.createContext(
  {} as {
    page: number;
    count: number;
    ingredients: IIngredient[];
    selectedValues: string[];
    pickedIngredients: IIngredient[];
    changePage: (i: number) => void;
    handleFilterChange: (i: any) => void;
    handleSearchChange: (i: string) => void;
  },
);
