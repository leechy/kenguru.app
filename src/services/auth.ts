import firebase from 'firebase';

export class AuthService {

  anonymousLogin() {
    return firebase.auth().signInAnonymously();
  }

  signup(email: string, password: string) {
    return firebase.auth().createUserWithEmailAndPassword(email, password);
  }

  signin(email: string, password: string) {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }

  logout() {
    firebase.auth().signOut();
  }

  facebookLogin() {
    const provider = new firebase.auth.FacebookAuthProvider();
    return firebase.auth().signInWithPopup(provider);
  }

  credentialSignIn(accessToken) {
    // for now it's only facebook
    const facebookCredential = firebase.auth.FacebookAuthProvider.credential(accessToken);
    return firebase.auth().signInWithCredential(facebookCredential);
  }
}
