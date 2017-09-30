import { Action } from '@ngrx/store';
import { ChildrenInterface } from '../models/settings.interface'

export const SET_TEXT_SIZE = 'SET_TEXT_SIZE';
export const SET_BIRTH_DATE = 'SET_BIRTH_DATE';
export const REMOVE_BIRTH_DATE = 'REMOVE_BIRTH_DATE';
export const ADD_CHILD = 'ADD_CHILD';
export const ADD_CHILDREN = 'ADD_CHILDREN';
export const UPDATE_CHILD = 'UPDATE_CHILD';
export const REMOVE_CHILD = 'REMOVE_CHILD';
export const IS_WELCOME_SCREEN_SHOWN = 'IS_WELCOME_SCREEN_SHOWN';

export class SetTextSize implements Action {
  readonly type = SET_TEXT_SIZE;
  constructor(public payload: number) {}
}

export class SetBirthDate implements Action {
  readonly type = SET_BIRTH_DATE;
  constructor(public payload: string) {}
}

export class RemoveBirthDate implements Action {
  readonly type = REMOVE_BIRTH_DATE;
}

export class AddChildren implements Action {
  readonly type = ADD_CHILDREN;
  constructor(public payload: ChildrenInterface[]) {}
}

export class AddChild implements Action {
  readonly type = ADD_CHILD;
  constructor(public payload: ChildrenInterface) {}
}

export class UpdateChild implements Action {
  readonly type = UPDATE_CHILD;
  constructor(public payload: { id: number, child: ChildrenInterface } ) {}
}

export class RemoveChild implements Action {
  readonly type = REMOVE_CHILD;
  constructor(public payload: number) {}
}

export class IsWelcomeScreenShown implements Action {
  readonly type = IS_WELCOME_SCREEN_SHOWN;
  constructor(public payload: boolean) {}
}

export type All = SetTextSize | SetBirthDate | RemoveBirthDate | AddChildren | AddChild | UpdateChild | RemoveChild | IsWelcomeScreenShown;
