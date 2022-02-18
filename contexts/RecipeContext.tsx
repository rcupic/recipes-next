import React from 'react';
import { IIngredient } from '../services/interfaces/Ingredient.interface';

export const RecipeContext = React.createContext(
  {} as {
    ingredients: IIngredient[];
    addIngredient: (i: string) => void;
  },
);
