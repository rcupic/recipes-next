import axios, { AxiosInstance } from 'axios';
import { IIngredient } from './interfaces/Ingredient.interface';

class IngredientApiService {
  axiosIngredientApiService: AxiosInstance;

  constructor() {
    this.axiosIngredientApiService = axios.create({
      baseURL: 'http://localhost:3001/ingredients',
    });
  }

  public getIngredients = async (): Promise<IIngredient[]> => {
    try {
      const {
        data: { payload },
      } = await this.axiosIngredientApiService.get<{
        payload: IIngredient[];
      }>('/');

      return payload;
    } catch (error) {
      console.log(error);
      return [];
    }
  };
}

export const ingredientApiService = new IngredientApiService();
