import { IconButton, InputBase, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import React from 'react';
import { RecipeTableContext } from '../../contexts/RecipeTableContext';

export default function SearchInput(): JSX.Element {
  const { handleSearchChange } = React.useContext(RecipeTableContext);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    handleSearchChange(e.target.value);
  };

  return (
    <Paper
      component="form"
      sx={{
        p: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: '15rem',
        height: '4rem',
        boxShadow: 'none',
        borderBottom: 'solid rgba(0, 0, 0, 0.5)',
        borderRadius: '0px',
      }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search Recipes"
        inputProps={{ 'aria-label': 'search recipes' }}
        onChange={handleChange}
      />
      <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
        <SearchIcon />
      </IconButton>
    </Paper>
  );
}
