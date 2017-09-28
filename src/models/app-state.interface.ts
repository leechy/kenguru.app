import { CategoryInterface } from './category.interface';
import { AuthInterface } from './auth.interface';
import { SettingsInterface } from './settings.interface'

export interface AppState {
  categories: [CategoryInterface[]],
  auth: AuthInterface,
  settings: SettingsInterface
}
