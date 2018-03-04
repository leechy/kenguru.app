import { Action } from '@ngrx/store';

export const SIGNUP = 'SIGNUP';
export const SIGNIN = 'SIGNIN';
export const FACEBOOK_LOGIN = 'FACEBOOK_LOGIN';
export const SET_FACEBOOK_TOKEN = 'SET_FACEBOOK_TOKEN';
export const ANONYMOUS_LOGIN = 'ANONYMOUS_LOGIN';
export const LOGOUT = 'LOGOUT';

export class SignUp implements Action {
  readonly type = SIGNUP;
  constructor(public payload: string) {}
}

export class SignIn implements Action {
  readonly type = SIGNIN;
  constructor(public payload: string) {}
}

export class FacebookLogin implements Action {
  readonly type = FACEBOOK_LOGIN;
  constructor(public payload: { uid: string, email: string, token: string }) {}
}

export class SetFacebookToken implements Action {
  readonly type = SET_FACEBOOK_TOKEN;
  constructor(public payload: string) {}
}

export class AnonymousLogin implements Action {
  readonly type = ANONYMOUS_LOGIN;
  constructor(public payload: string) {}
}

export class Logout implements Action {
  readonly type = LOGOUT;
}

export type All = SignUp | SignIn | FacebookLogin | SetFacebookToken | AnonymousLogin | Logout;
