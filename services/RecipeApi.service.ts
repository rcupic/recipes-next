import axios, { AxiosInstance } from 'axios';
import { IRecipe } from './interfaces/Recipe.interface';

class RecipeApiService {
  axiosRecipeApiService: AxiosInstance;

  constructor() {
    this.axiosRecipeApiService = axios.create({
      baseURL: 'http://localhost:3001/recipes',
    });
  }

  public getRecipes = async (params: {
    page?: number;
    limit?: number;
    ingredientId?: string[];
    nameWordStartWith?: string;
  }): Promise<{
    rows: IRecipe[];
    count: number;
    pages: number;
  }> => {
    try {
      const {
        data: { payload },
      } = await this.axiosRecipeApiService.get<{
        payload: {
          rows: IRecipe[];
          count: number;
          pages: number;
        };
      }>('/', { params });

      return payload;
    } catch (error) {
      console.log(error);
      return { rows: [], count: 0, pages: 0 };
    }
  };

  public getRecipeById = async (id: string): Promise<IRecipe | null> => {
    try {
      const {
        data: { payload },
      } = await this.axiosRecipeApiService.get<{ payload: IRecipe }>(`/${id}`);

      return payload;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  public deleteRecipe = async (id: string): Promise<void> => {
    try {
      await this.axiosRecipeApiService.delete(`/${id}`);
    } catch (error) {
      console.log(error);
    }
  };

  public createRecipe = async (values: {
    name: string;
    description: string;
    ingredientIds: string[];
  }): Promise<IRecipe> => {
    const {
      data: { payload },
    } = await this.axiosRecipeApiService.post<{ payload: IRecipe }>(
      '/',
      values,
    );

    return payload;
  };

  public updateRecipe = async (
    id: string,
    values: {
      name?: string;
      description?: string;
      ingredientIds?: string[];
    },
  ): Promise<IRecipe> => {
    const {
      data: { payload },
    } = await this.axiosRecipeApiService.patch<{
      payload: IRecipe;
    }>(`/${id}`, values);

    return payload;
  };
}

export const recipeApiService = new RecipeApiService();
