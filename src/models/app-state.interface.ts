import { CategoryInterface } from './category.interface';
import { AuthInterface } from './auth.interface';

export interface AppState {
  categories: [CategoryInterface[]],
  auth: AuthInterface
}
