import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Button, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useRouter } from 'next/router';
import PaginationControlled from '../PaginationControlled/PaginationControlled';
import { RecipeTableContext } from '../../contexts/RecipeTableContext';
import SearchInput from '../SearchInput/SearchInput';
import FilterDropdow from '../FilterDropdown/FilterDropdown';
import { IRecipe } from '../../services/interfaces/Recipe.interface';
import { IIngredient } from '../../services/interfaces/Ingredient.interface';
import { recipeApiService } from '../../services/RecipeApi.service';

const columns: {
  id: 'name' | 'ingredients' | 'description' | 'actions';
  label: string;
  width: number;
  align?: 'right';
}[] = [
  { id: 'name', label: 'Name', width: 100 },
  { id: 'ingredients', label: 'Ingredients', width: 100 },
  {
    id: 'description',
    label: 'Description',
    width: 100,
  },
  {
    id: 'actions',
    label: '',
    width: 10,
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

  const router = useRouter();

  const refreshTableRows = React.useCallback(() => {
    const params = { page, limit: 5 };

    if (pickedIngredients.length) {
      const ingredientId = pickedIngredients.map(({ id }) => id).join(',');

      Object.assign(params, { ingredientId });
    }

    if (searchInput.length > 2) {
      Object.assign(params, { nameWordStartWith: searchInput });
    }

    recipeApiService
      .getRecipes(params)
      .then(response => {
        changeRows(response.rows);
        changeCount(response.pages);
      })
      .catch(error => console.log(error));
  }, [page, searchInput, pickedIngredients]);

  React.useEffect((): void => {
    refreshTableRows();
  }, [page, pickedIngredients, searchInput, refreshTableRows]);

  const handleDelete = (id: string): void => {
    recipeApiService
      .deleteRecipe(id)
      .then(refreshTableRows)
      .catch(error => console.log(error));
  };

  const handleTableRowOnClick = (
    e: React.MouseEvent<HTMLTableRowElement, MouseEvent>,
  ): void => {
    router.push(`/recipes/${e.currentTarget.dataset.recipeId}`);
  };

  const handleNewRecipeOnClick = (): void => {
    router.push(`/recipes/new-recipe`);
  };

  const handleDeleteButtonOnClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ): void => {
    e.stopPropagation();
    handleDelete(e.currentTarget.dataset.recipeId as string);
  };

  const value = React.useMemo(
    () => ({
      page,
      count,
      ingredients,
      selectedValues,
      pickedIngredients,
      changePage,
      handleFilterChange: (filterValue: string | string[]) => {
        const selectedIngredients = ingredients.filter(({ id }) =>
          filterValue.includes(id),
        );

        changeSelectedValues(selectedIngredients.map(({ id }) => id));
        changePickedIngredients(selectedIngredients);
      },
      handleSearchChange: (input: string): void => {
        if (input.length > 2) {
          changeSearchInput(input);
          changePage(1);
        } else if (input.length === 0) {
          changeSearchInput('');
          changePage(1);
        }
      },
    }),
    [page, count, ingredients, selectedValues, pickedIngredients],
  );

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
                      style={{ width: column.width }}
                    >
                      {column.id === 'actions' ? (
                        <Button type="button">
                          <AddIcon onClick={handleNewRecipeOnClick} />
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
              {rows.map(
                (row): JSX.Element => (
                  <TableRow
                    hover
                    role="button"
                    tabIndex={-1}
                    key={row.id}
                    data-recipe-id={row.id}
                    onClick={handleTableRowOnClick}
                  >
                    {columns.map(
                      (column: {
                        id: 'name' | 'ingredients' | 'description' | 'actions';
                        label: string;
                        width: number;
                        align?: 'right' | undefined;
                      }): JSX.Element => {
                        if (column.id === 'actions') {
                          return (
                            <TableCell
                              key={column.id}
                              align={column.align}
                              sx={{ width: column.width }}
                            >
                              <IconButton
                                data-recipe-id={row.id}
                                onClick={handleDeleteButtonOnClick}
                                id={row.id}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          );
                        }

                        let displayValue = row[column.id];

                        if (Array.isArray(displayValue)) {
                          const names = displayValue.map(({ name }) => name);
                          displayValue = names.join(',');
                        }

                        return (
                          <TableCell key={column.id} align={column.align}>
                            {displayValue}
                          </TableCell>
                        );
                      },
                    )}
                  </TableRow>
                ),
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <PaginationControlled />
      </Paper>
    </RecipeTableContext.Provider>
  );
}
