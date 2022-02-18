import {
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import React from 'react';
import { RecipeTableContext } from '../../contexts/RecipeTableContext';

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 48 * 4.5 + 8,
      width: 250,
    },
  },
};

export default function FilterDropdow(): JSX.Element {
  const { selectedValues, handleFilterChange, ingredients, pickedIngredients } =
    React.useContext(RecipeTableContext);

  const handleChange = (e: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = e;

    handleFilterChange(value);
  };

  return (
    <div>
      <FormControl
        sx={{
          width: '10rem',
          marginTop: '1rem',
        }}
      >
        <InputLabel id="demo-multiple-checkbox-label">Ingredients</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={selectedValues}
          onChange={handleChange}
          input={<OutlinedInput label="Ingredients" />}
          renderValue={() => 'Ingredient'}
          MenuProps={MenuProps}
        >
          {ingredients.map(({ id, name }) => {
            const checked = !!pickedIngredients.find(
              ({ id: pId }) => pId === id,
            );

            return (
              <MenuItem key={id} value={id} sx={{ height: '2rem' }}>
                <Checkbox checked={checked} />
                <ListItemText primary={name} />
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </div>
  );
}
