import * as AuthActions from './auth.actions';
import { AuthInterface } from '../models/auth.interface';

const initialState: AuthInterface = {
  authenticated: false,
  userEmail: '',
  facebookToken: ''
}

export function authReducer(state = initialState, action: AuthActions.All) {
  switch (action.type) {
    case AuthActions.SIGNIN:
    case AuthActions.SIGNUP:
    return {
      ...state,
      authenticated: true,
      userEmail: action.payload
    }
  case AuthActions.FACEBOOK_LOGIN:
      return {
        ...state,
        authenticated: true,
        userEmail: action.payload.email,
        facebookToken: action.payload.token
      }
    case AuthActions.SET_FACEBOOK_TOKEN:
      return {
        ...state,
        facebookToken: action.payload
      }
    case AuthActions.LOGOUT:
      return {
        ...state,
        authenticated: false,
        userEmail: '',
        facebookToken: ''
      }
    default:
      return state;
  }
}
