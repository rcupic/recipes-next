import { Button, IconButton, TextField, Typography } from '@mui/material';
import * as React from 'react';
import RemoveIcon from '@mui/icons-material/Remove';
import { useRouter } from 'next/router';
import { recipeApiService } from '../../services/RecipeApi.service';
import { IIngredient } from '../../services/interfaces/Ingredient.interface';
import { RecipeContext } from '../../contexts/RecipeContext';
import IngredientsDropdown from '../IngredientsDropdown/IngredientsDropdown';

export default function CreateRecipe({
  ingredients,
}: {
  ingredients: IIngredient[];
}) {
  const [name, changeName] = React.useState('');
  const [description, changeDescription] = React.useState('');
  const [recipeIngredients, changeRecipeIngredients] = React.useState<
    IIngredient[]
  >([]);
  const [isSubmitAble, changeIsSubmitAble] = React.useState(false);
  const [nameFieldError, changeNameFieldError] = React.useState('');
  const [descriptionFieldError, changeDescriptionFieldError] =
    React.useState('');

  const router = useRouter();

  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    recipeApiService
      .createRecipe({
        name,
        description,
        ingredientIds: recipeIngredients.map(({ id }) => id),
      })
      .then(createdRecipe => {
        router.push(`/recipes/${createdRecipe.id}`);
        changeIsSubmitAble(false);
      })
      .catch(error => console.log(error));
  };

  React.useEffect((): void => {
    if (name && name.length > 1 && description && description.length > 1) {
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
  }, [name, description, nameFieldError, descriptionFieldError]);

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

    changeRecipeIngredients(otherIngredients);
  };

  const handleDescriptionOnChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    changeDescription(e.target.value);
  };

  const handleNameOnChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    changeName(e.target.value);
  };

  const value = React.useMemo(
    () => ({
      ingredients,
      addIngredient: (dropdownValue: string) => {
        const indexOfId = recipeIngredients.findIndex(
          el => el.id === dropdownValue,
        );

        if (indexOfId !== -1) {
          return;
        }

        const ingredient = ingredients.find(el => el.id === dropdownValue);

        if (ingredient) {
          changeRecipeIngredients([ingredient, ...recipeIngredients]);
        }
      },
    }),
    [ingredients, recipeIngredients],
  );

  return (
    <form
      style={{
        marginLeft: '3rem',
      }}
      onSubmit={handleOnSubmit}
    >
      <Typography component="div" variant="h2">
        Recipe
      </Typography>
      <div
        style={{
          margin: '3rem 0rem 3rem 0rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '23rem',
        }}
      >
        <TextField
          error={!!nameFieldError}
          helperText={nameFieldError}
          inputProps={{ width: '13rem' }}
          sx={{ display: 'block' }}
          id="filled-basic"
          label="Name"
          variant="filled"
          required
          onChange={handleNameOnChange}
        />
        <TextField
          error={!!descriptionFieldError}
          helperText={descriptionFieldError}
          inputProps={{ width: '13rem' }}
          sx={{ display: 'block' }}
          multiline
          rows={10}
          style={{ display: 'block' }}
          id="filled-basic"
          label="Description"
          variant="filled"
          required
          onChange={handleDescriptionOnChange}
        />
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
      <div style={{ marginTop: '3rem', marginBottom: '3rem' }}>
        {isSubmitAble ? (
          <Button type="submit">CREATE</Button>
        ) : (
          <Button type="submit" disabled>
            CREATE
          </Button>
        )}
      </div>
    </form>
  );
}
