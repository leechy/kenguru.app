import { Action } from "@ngrx/store";
import * as CategoryActions from "../actions/category";
export type Action = CategoryActions.All;

export interface Category {
  id: number;
  description: string;
  name: string;
  slug: string;
  count: number;
  expanded: boolean;
}

export interface AppState {
  categories: [Category];
}

export function categoriesReducer(state = [], action) {
  var catId = null;
  switch (action.type) {
    // Tree expansion in the menu
    case CategoryActions.EXPAND:
      catId = action.payload.id;
      state[0].forEach(category => {
        if (category.id == catId) category.expanded = true;
      });
      return state;
    case CategoryActions.COLLAPSE:
      catId = action.payload.id;
      state[0].forEach(category => {
        if (category.id == catId) category.expanded = false;
      });
      return state;
    case CategoryActions.TOGGLE_EXPANSION:
      catId = action.payload.id;
      state[0].forEach(category => {
        if (category.id == catId) category.expanded = !category.expanded;
      });
      return state;
    // Clear the list
    case CategoryActions.RESET:
      return [];
    // Update the whole list at once
    case CategoryActions.UPDATE:
        return [...action.payload];
    // Add a new category
    case CategoryActions.PUSH:
      let cat = action.payload;
      if (!state[cat.parent]) {
        state[cat.parent] = [];
      }
      state[cat.parent].push(cat);
      return state;
    default:
      return state;
  }
}
