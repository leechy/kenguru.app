import firebase from 'firebase';

export class AuthService {
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
    return firebase.auth().signInWithPopup(new firebase.auth.FacebookAuthProvider());
  }

  credentialSignIn(accessToken) {
    // for now it's only facebook
    const facebookCredential = firebase.auth.FacebookAuthProvider.credential(accessToken);
    return firebase.auth().signInWithCredential(facebookCredential);
  }
}
