import React from 'react';
import { IIngredient } from '../services/interfaces/Ingredient.interface';

export const RecipeTableContext = React.createContext(
  {} as {
    page: number;
    count: number;
    ingredients: IIngredient[];
    selectedValues: string[];
    pickedIngredients: IIngredient[];
    changePage: (i: number) => void;
    handleFilterChange: (i: string | string[]) => void;
    handleSearchChange: (i: string) => void;
  },
);
