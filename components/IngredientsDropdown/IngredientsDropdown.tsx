import {
  Box,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import React from 'react';
import AddIcon from '@mui/icons-material/Add';
import { RecipeContext } from '../../contexts/RecipeContext';

export default function IngredientsDropdown(): JSX.Element {
  const { ingredients, addIngredient } = React.useContext(RecipeContext);

  const [dropdownValue, changeDropdownValue] = React.useState(
    ingredients[0].id,
  );

  const handleDropdownValueChange = (e: SelectChangeEvent<string>): void => {
    changeDropdownValue(e.target.value);
  };

  const handleIngredientAddClick = (): void => {
    addIngredient(dropdownValue);
  };

  return (
    <Box
      sx={{
        marginTop: '3rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '13rem',
      }}
    >
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
      <IconButton onClick={handleIngredientAddClick}>
        <AddIcon color="primary" />
      </IconButton>
    </Box>
  );
}
