import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import PaginationControlled from '../PaginationControlled/PaginationControlled';
import axios from 'axios';
import { RecipeTableContext } from '../../contexts/RecipeTableContext';
import { Button, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SearchInput from '../SearchInput/SearchInput';
import FilterDropdow from '../FilterDropdown/FilterDropdown';
import { IRecipe } from '../Recipe/interfaces/Recipe.interface';
import { IIngredient } from '../Recipe/interfaces/Ingredient.interface';

const columns: {
  id: string;
  label: string;
  minWidth: number;
  align?: 'right';
}[] = [
  { id: 'name', label: 'Name', minWidth: 100 },
  { id: 'ingredients', label: 'Ingredients', minWidth: 100 },
  {
    id: 'description',
    label: 'Description',
    minWidth: 100,
  },
  {
    id: 'actions',
    label: '',
    minWidth: 10,
    align: 'right',
  },
];

export default function RecipeTable({
  ingredients,
}: {
  ingredients: IIngredient[];
}): JSX.Element {
  const [rows, changeRows] = React.useState<IRecipe[]>([]);
  const [page, changePage] = React.useState(1);
  const [count, changeCount] = React.useState(0);
  const [pickedIngredients, changePickedIngredients] = React.useState<
    IIngredient[]
  >([]);
  const [searchInput, changeSearchInput] = React.useState('');
  const [selectedValues, changeSelectedValues] = React.useState<string[]>([]);

  React.useEffect((): void => {
    refreshTableRows();
  }, [page, pickedIngredients, searchInput]);

  const refreshTableRows = (): void => {
    const params = { page, limit: 5 };

    if (pickedIngredients.length) {
      const ingredientId = pickedIngredients.map(({ id }) => id).join(',');

      Object.assign(params, { ingredientId });
    }

    if (searchInput.length > 2) {
      Object.assign(params, { nameWordStartWith: searchInput });
    }

    axios
      .get<{ rows: IRecipe[]; count: number; pages: number }>(
        'http://localhost:3001/recipes',
        { params },
      )
      .then(response => {
        changeRows(response.data.rows);
        changeCount(response.data.pages);
      })
      .catch(error => console.log(error));
  };

  const handleDelete = (id: string): void => {
    axios
      .delete(`http://localhost:3001/recipes/${id}`)
      .then(() => {
        refreshTableRows();
      })
      .catch(error => console.log(error));
  };

  const handleTableRowClick = (id: string): void => {
    window.location.href = `/recipes/${id}`;
  };

  const handleNewRecipeClick = (
    e: React.MouseEvent<SVGSVGElement, MouseEvent>,
  ): void => {
    window.location.href = '/recipes/new-recipe';
  };

  const handleFilterChange = (value: string[]): void => {
    const selectedIngredients = ingredients.filter(({ id }) =>
      value.includes(id),
    );

    changeSelectedValues(selectedIngredients.map(({ id }) => id));
    changePickedIngredients(selectedIngredients);
  };

  const handleNameChange = (input: string): void => {
    if (input.length > 2) {
      changeSearchInput(input);
    }
  };

  const value = {
    page,
    count,
    ingredients,
    selectedValues,
    pickedIngredients,
    changePage,
    handleFilterChange,
    handleSearchChange: handleNameChange,
  };

  return (
    <RecipeTableContext.Provider value={value}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          maxWidth: '30rem',
          margin: '1rem',
        }}
      >
        <SearchInput />
        <FilterDropdow />
      </div>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ height: '100%' }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map(
                  (column): JSX.Element => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.id === 'actions' ? (
                        <Button type="button">
                          <AddIcon onClick={handleNewRecipeClick} />
                        </Button>
                      ) : (
                        column.label
                      )}
                    </TableCell>
                  ),
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row): JSX.Element => {
                return (
                  <TableRow
                    hover
                    role="button"
                    tabIndex={-1}
                    key={row.id}
                    onClick={e => handleTableRowClick(row.id)}
                  >
                    {columns.map((column): JSX.Element => {
                      if (column.id === 'actions') {
                        return (
                          <TableCell key={column.id} align={column.align}>
                            <IconButton
                              onClick={() => handleDelete(row.id)}
                              id={row.id}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        );
                      }

                      let value = row[column.id];

                      if (Array.isArray(value)) {
                        const names = value.map(({ name }) => name);
                        value = names.join(',');
                      }

                      return (
                        <TableCell key={column.id} align={column.align}>
                          {value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <PaginationControlled />
      </Paper>
    </RecipeTableContext.Provider>
  );
}
