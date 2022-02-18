import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
import * as React from 'react';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import axios from 'axios';
import { IRecipe } from './interfaces/Recipe.interface';
import { IIngredient } from './interfaces/Ingredient.interface';

const UpdateRecipe: React.FC<{
  recipe: IRecipe;
  ingredients: IIngredient[];
}> = ({ recipe, ingredients }) => {
  const [name, changeName] = React.useState(recipe.name);
  const [description, changeDescription] = React.useState(recipe.description);
  const [recipeIngredients, changeIngredients] = React.useState([
    ...recipe.ingredients,
  ]);
  const [isSubmitAble, changeIsSubmitAble] = React.useState(false);
  const [dropdownValue, changeDropdownValue] = React.useState(
    ingredients[0].id,
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    axios
      .patch<IRecipe>(`http://localhost:3001/recipes/${recipe.id}`, {
        name,
        description,
      })
      .then(response => {
        changeName(response.data.name);
        changeDescription(response.data.description);
        changeIsSubmitAble(false);
      })
      .catch(error => console.log(error));
  };

  React.useEffect((): void => {
    if (
      (name && name !== recipe.name) ||
      (description && description !== recipe.description)
    ) {
      changeIsSubmitAble(true);
    }
  }, [name, description]);

  const handleDropdownValueChange = (e: SelectChangeEvent<string>): void => {
    changeDropdownValue(e.target.value);
  };

  const handleIngredientMinusClick = (id: string): void => {
    const indexOfId = recipeIngredients.findIndex(el => el.id === id);

    if (indexOfId === -1) {
      return;
    }

    const otherIngredients = [
      ...recipeIngredients.slice(0, indexOfId),
      ...recipeIngredients.slice(indexOfId + 1, recipeIngredients.length),
    ];

    axios
      .patch<IRecipe>(`http://localhost:3001/recipes/${recipe.id}`, {
        ingredientIds: otherIngredients.map(({ id }) => id),
      })
      .then(response => {
        changeIngredients(response.data.ingredients);
        changeIsSubmitAble(false);
      })
      .catch(error => console.log(error));
  };

  const handleIngredientAddClick = (
    e: React.MouseEvent<SVGSVGElement, MouseEvent>,
  ): void => {
    const indexOfId = recipeIngredients.findIndex(
      el => el.id === dropdownValue,
    );

    if (indexOfId !== -1) {
      return;
    }

    const ingredient = ingredients.find(el => el.id === dropdownValue);

    axios
      .patch<IRecipe>(`http://localhost:3001/recipes/${recipe.id}`, {
        ingredientIds: [ingredient, ...recipeIngredients].map(({ id }) => id),
      })
      .then(response => {
        changeIngredients(response.data.ingredients);
        changeIsSubmitAble(false);
      })
      .catch(error => console.log(error));
  };

  const handleNameChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ): void => {
    changeName(e.target.value);
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    changeDescription(e.target.value);
  };

  return (
    <form
      style={{
        marginLeft: '3rem',
      }}
      onSubmit={handleSubmit}
    >
      <Typography component="div" variant="h2">
        Recipe
      </Typography>
      <div style={{ marginTop: '3rem' }}>
        <TextField
          inputProps={{ width: '13rem' }}
          style={{ display: 'block' }}
          id="filled-basic"
          label="Name"
          variant="filled"
          required
          onChange={handleNameChange}
        />
        <TextField
          multiline
          rows={10}
          inputProps={{ width: '13rem' }}
          style={{ display: 'block', marginTop: '2rem' }}
          id="filled-basic"
          label="Description"
          variant="filled"
          required
          onChange={handleDescriptionChange}
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
              <Button type="button">
                <RemoveIcon onClick={() => handleIngredientMinusClick(el.id)} />
              </Button>
            </Typography>
          </div>
        ))}
        <Box sx={{ marginTop: '3rem' }}>
          <FormControl sx={{ width: '10rem' }}>
            <InputLabel id="demo-simple-select-label">Ingredient</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={dropdownValue}
              label="Ingredient"
              onChange={handleDropdownValueChange}
            >
              {ingredients.map(el => (
                <MenuItem value={el.id} key={el.id}>
                  {el.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button type="button">
            <AddIcon onClick={handleIngredientAddClick} />
          </Button>
        </Box>
      </div>
    </form>
  );
};

export default UpdateRecipe;
