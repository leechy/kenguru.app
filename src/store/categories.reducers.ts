import { Action } from "@ngrx/store";
import * as CategoryActions from "./categories.actions";
import { CategoryInterface } from '../models/category.interface';

export type Action = CategoryActions.All;

const initialState: [CategoryInterface[]] = [[]];

export function categoriesReducer(state = initialState, action: CategoryActions.All) {
  var catId = null;
  switch (action.type) {
    // Tree expansion in the menu
    case CategoryActions.EXPAND:
      let newExpandedState = [...state];
      catId = action.payload.id;
      newExpandedState[0].forEach(category => {
        if (category.id == catId) category.expanded = true;
      });
      return newExpandedState;
    case CategoryActions.COLLAPSE:
      let newCollapsedState = [...state];
      catId = action.payload.id;
      newCollapsedState[0].forEach(category => {
        if (category.id == catId) category.expanded = false;
      });
      return newCollapsedState;
    case CategoryActions.TOGGLE_EXPANSION:
      let newToggledState = [...state];
      catId = action.payload.id;
      newToggledState[0].forEach(category => {
        if (category.id == catId) category.expanded = !category.expanded;
      });
      return newToggledState;
    // Clear the list
    case CategoryActions.RESET:
      return [];
    // Update the whole list at once
    case CategoryActions.UPDATE:
      return [...action.payload];
    // Add a new category
    case CategoryActions.PUSH:
      let newCategory = action.payload;
      let newState = [...state];
      if (!newState[newCategory.parent]) {
        newState[newCategory.parent] = [];
      }
      newState[newCategory.parent].push(newCategory);
      return newState;
    default:
      return state;
  }
}
