import { categoriesReducer } from "./categories.reducers";
import { authReducer } from './auth.reducers';
import { settingsReducer } from './settings.reducers';

export const reducers = {
  categories: categoriesReducer,
  auth: authReducer,
  settings: settingsReducer
};
