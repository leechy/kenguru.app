import { Action } from "@ngrx/store";
import { CategoryInterface } from "../models/category.interface";

export const UPDATE = "UPDATE";
export const RESET = "RESET";
export const PUSH = "PUSH";
export const EXPAND = "EXPAND";
export const COLLAPSE = "COLLAPSE";
export const TOGGLE_EXPANSION = "TOGGLE_EXPANSION";

export class Update implements Action {
  readonly type = UPDATE;
  constructor(public payload: CategoryInterface[]) {}
}

export class Push implements Action {
  readonly type = PUSH;
  constructor(public payload: CategoryInterface) {}
}

export class Expand implements Action {
  readonly type = EXPAND;
  constructor(public payload: CategoryInterface) {}
}

export class Collapse implements Action {
  readonly type = COLLAPSE;
  constructor(public payload: CategoryInterface) {}
}

export class ToggleExpansion implements Action {
  readonly type = TOGGLE_EXPANSION;
  constructor(public payload: CategoryInterface) {}
}

export class Reset implements Action {
  readonly type = RESET;
  constructor() {}
}

export type All = Update | Push | Expand | Collapse | ToggleExpansion | Reset;
