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

const CreateRecipe: React.FC<{ ingredients: IIngredient[] }> = ({
  ingredients,
}) => {
  const [name, changeName] = React.useState('');
  const [description, changeDescription] = React.useState('');
  const [recipeIngredients, changeRecipeIngredients] = React.useState<
    IIngredient[]
  >([]);
  const [isSubmitAble, changeIsSubmitAble] = React.useState(false);
  const [dropdownValue, changeDropdownValue] = React.useState(
    ingredients[0].id,
  );

  const handleSubmit = (): void => {
    axios
      .post<IRecipe>(`http://localhost:3001/recipes`, {
        name,
        description,
        ingredientIds: recipeIngredients.map(({ id }) => id),
      })
      .then(response => {
        window.location.href = `/recipes/${response.data.id}`;
        changeIsSubmitAble(false);
      })
      .catch(error => console.log(error));
  };

  React.useEffect((): void => {
    if (name && description) {
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

    changeRecipeIngredients(otherIngredients);
  };

  const handleIngredientAddClick = (): void => {
    const indexOfId = recipeIngredients.findIndex(
      el => el.id === dropdownValue,
    );

    if (indexOfId !== -1) {
      return;
    }

    const ingredient = ingredients.find(el => el.id === dropdownValue);

    changeRecipeIngredients([ingredient, ...recipeIngredients]);
  };

  return (
    <form
      style={{
        marginLeft: '3rem',
      }}
      onSubmit={e => {
        e.preventDefault();
        return handleSubmit();
      }}
    >
      <Typography component="div" variant="h2">
        Recipe
      </Typography>
      <div style={{ marginTop: '3rem', marginBottom: '3rem' }}>
        <TextField
          inputProps={{ width: '13rem' }}
          sx={{ display: 'block' }}
          id="filled-basic"
          label="Name"
          variant="filled"
          required
          onChange={e => changeName(e.target.value)}
        />
        <TextField
          inputProps={{ width: '13rem' }}
          sx={{ marginTop: '2rem', display: 'block' }}
          multiline
          rows={10}
          style={{ display: 'block' }}
          id="filled-basic"
          label="Description"
          variant="filled"
          required
          onChange={e => changeDescription(e.target.value)}
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
            <AddIcon onClick={() => handleIngredientAddClick()} />
          </Button>
        </Box>
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
};

export default CreateRecipe;
