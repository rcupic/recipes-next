import * as React from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { RecipeTableContext } from '../../contexts/RecipeTableContext';

export default function PaginationControlled(): JSX.Element {
  const { page, changePage, count } = React.useContext(RecipeTableContext);

  const handleChange = (
    event: React.ChangeEvent<unknown>,
    value: number,
  ): void => {
    changePage(value);
  };

  return (
    <Stack spacing={2} sx={{ alignItems: 'center' }}>
      <Pagination count={count} page={page} onChange={handleChange} />
    </Stack>
  );
}
