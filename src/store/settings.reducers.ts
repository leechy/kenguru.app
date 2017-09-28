import * as SettingsActions from './settings.actions';
import { SettingsInterface } from '../models/settings.interface';

const initialState: SettingsInterface = {
  textSize: 3,
  birthDate: null,
  children: []
}

export function settingsReducer(state = initialState, action: SettingsActions.All) {
  const children = [...state.children];
  switch (action.type) {
    case SettingsActions.SET_TEXT_SIZE:
    return {
      ...state,
      textSize: action.payload
    }
    case SettingsActions.SET_BIRTH_DATE:
    return {
      ...state,
      birthDate: action.payload
    }
  case SettingsActions.REMOVE_BIRTH_DATE:
    return {
      ...state,
      birthDate: null
    }
  case SettingsActions.ADD_CHILDREN:
    return {
      ...state,
      children: [...action.payload]
    }
  case SettingsActions.ADD_CHILD:
  console.log('ADD_CHILD', children, action.payload);
    children.push(action.payload);
    return {
      ...state,
      children: children
    }
  case SettingsActions.UPDATE_CHILD:
    console.log('UPDATE_CHILD', children, action.payload.id, action.payload.child);
    children[action.payload.id] = action.payload.child;
    return {
      ...state,
      children: children
    }
  case SettingsActions.REMOVE_CHILD:
  console.log('REMOVE_CHILD', children, action.payload);
    children.splice(action.payload, 1);
    return {
      ...state,
      children: children
    }
  default:
    return state;
  }

}