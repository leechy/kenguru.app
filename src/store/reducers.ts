import { categoriesReducer } from "./categories.reducers";
import { authReducer } from './auth.reducers';

export const reducers = {
  categories: categoriesReducer,
  auth: authReducer
};
