import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

// Email/password sign-in
export const signIn = (email, password) => {
  return auth().signInWithEmailAndPassword(email.trim(), password);
};

// Email/password sign-up
export const signUp = (email, password) => {
  return auth().createUserWithEmailAndPassword(email.trim(), password);
};

// Sign out
export const signOut = () => {
  return auth().signOut();
};

// Google OAuth sign-in
export const googleSignIn = async () => {
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  const { idToken } = await GoogleSignin.signIn();
  const googleCredential = auth.GoogleAuthProvider.credential(idToken);
  return auth().signInWithCredential(googleCredential);
};
