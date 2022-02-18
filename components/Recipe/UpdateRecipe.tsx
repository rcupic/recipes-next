import { Button, IconButton, TextField, Typography } from '@mui/material';
import * as React from 'react';
import RemoveIcon from '@mui/icons-material/Remove';
import { IRecipe } from '../../services/interfaces/Recipe.interface';
import { IIngredient } from '../../services/interfaces/Ingredient.interface';
import { recipeApiService } from '../../services/RecipeApi.service';
import IngredientsDropdown from '../IngredientsDropdown/IngredientsDropdown';
import { RecipeContext } from '../../contexts/RecipeContext';

export default function UpdateRecipe({
  recipe,
  ingredients,
}: {
  recipe: IRecipe;
  ingredients: IIngredient[];
}) {
  const [name, changeName] = React.useState(recipe.name);
  const [description, changeDescription] = React.useState(recipe.description);
  const [recipeIngredients, changeIngredients] = React.useState([
    ...recipe.ingredients,
  ]);
  const [isSubmitAble, changeIsSubmitAble] = React.useState(false);
  const [nameFieldError, changeNameFieldError] = React.useState('');
  const [descriptionFieldError, changeDescriptionFieldError] =
    React.useState('');

  const value = React.useMemo(
    () => ({
      ingredients,
      addIngredient: (dropdownValue: string): void => {
        const indexOfId = recipeIngredients.findIndex(
          el => el.id === dropdownValue,
        );

        if (indexOfId !== -1) {
          return;
        }

        const ingredient = ingredients.find(el => el.id === dropdownValue);

        if (ingredient) {
          recipeApiService
            .updateRecipe(recipe.id, {
              ingredientIds: [ingredient, ...recipeIngredients].map(
                el => el.id,
              ),
            })
            .then(updatedRecipe => {
              changeIngredients(updatedRecipe.ingredients);
              changeIsSubmitAble(false);
            })
            .catch(error => console.log(error));
        }
      },
    }),
    [ingredients, recipe.id, recipeIngredients],
  );

  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    recipeApiService
      .updateRecipe(recipe.id, { name, description })
      .then(updatedRecipe => {
        changeName(updatedRecipe.name);
        changeDescription(updatedRecipe.description);
        changeIsSubmitAble(false);
      })
      .catch(error => console.log(error));
  };

  React.useEffect((): void => {
    if (
      (name && name !== recipe.name && name.length > 1) ||
      (description &&
        description !== recipe.description &&
        description.length > 1)
    ) {
      changeIsSubmitAble(true);
      changeNameFieldError('');
      changeDescriptionFieldError('');
    } else {
      if (name) {
        if (name.length < 2) {
          changeNameFieldError('Minimum 2 characters');
          changeIsSubmitAble(false);
        } else if (nameFieldError) {
          changeNameFieldError('');
        }
      }
      if (description) {
        if (description.length < 2) {
          changeDescriptionFieldError('Minimum 2 characters');
          changeIsSubmitAble(false);
        } else if (descriptionFieldError) {
          changeDescriptionFieldError('');
        }
      }
    }
  }, [
    name,
    description,
    recipe.name,
    recipe.description,
    nameFieldError,
    descriptionFieldError,
  ]);

  const handleIngredientMinusClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ): void => {
    const indexOfId = recipeIngredients.findIndex(
      el => el.id === e.currentTarget.dataset.recipeId,
    );

    if (indexOfId === -1) {
      return;
    }

    const otherIngredients = [
      ...recipeIngredients.slice(0, indexOfId),
      ...recipeIngredients.slice(indexOfId + 1, recipeIngredients.length),
    ];

    recipeApiService
      .updateRecipe(recipe.id, {
        ingredientIds: otherIngredients.map(el => el.id),
      })
      .then(updatedRecipe => {
        changeIngredients(updatedRecipe.ingredients);
        changeIsSubmitAble(false);
      })
      .catch(error => console.log(error));
  };

  const handleNameOnChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ): void => {
    changeName(e.target.value);
  };

  const handleDescriptionOnChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    changeDescription(e.target.value);
  };

  return (
    <form
      style={{
        marginLeft: '3rem',
        marginBottom: '3rem',
      }}
      onSubmit={handleOnSubmit}
    >
      <Typography component="div" variant="h2">
        Recipe
      </Typography>
      <div style={{ marginTop: '3rem' }}>
        <TextField
          error={!!nameFieldError}
          helperText={nameFieldError}
          inputProps={{ width: '13rem' }}
          style={{ display: 'block' }}
          id="filled-basic"
          label="Name"
          value={name}
          variant="filled"
          onChange={handleNameOnChange}
        />
        <TextField
          error={!!descriptionFieldError}
          helperText={descriptionFieldError}
          multiline
          rows={10}
          inputProps={{ width: '13rem' }}
          style={{ display: 'block', marginTop: '2rem' }}
          id="filled-basic"
          label="Description"
          value={description}
          variant="filled"
          onChange={handleDescriptionOnChange}
        />
        {isSubmitAble ? (
          <Button type="submit">SAVE</Button>
        ) : (
          <Button type="submit" disabled>
            SAVE
          </Button>
        )}
      </div>

      <div style={{ marginTop: '3rem' }}>
        <Typography component="div" variant="h3">
          Ingredients
        </Typography>
        {recipeIngredients.map(el => (
          <div key={el.id}>
            <Typography component="div" variant="body1" sx={{ width: '10rem' }}>
              {el.name}
              <IconButton
                data-recipe-id={el.id}
                onClick={handleIngredientMinusClick}
              >
                <RemoveIcon color="primary" />
              </IconButton>
            </Typography>
          </div>
        ))}
        <RecipeContext.Provider value={value}>
          <IngredientsDropdown />
        </RecipeContext.Provider>
      </div>
    </form>
  );
}
