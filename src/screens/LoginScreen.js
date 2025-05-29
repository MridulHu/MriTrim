import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

// Configure Google Signin once (you can move this outside the component if you prefer)
GoogleSignin.configure({
  webClientId: '876586289935-foh9k9dfop8phuk1go03b8a4st4o0ita.apps.googleusercontent.com',
  offlineAccess: true,
});

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Optional: You can check if user is already signed in with Google here
  useEffect(() => {
    const checkSignedIn = async () => {
      const isSignedIn = await GoogleSignin.isSignedIn();
      if (isSignedIn) {
        navigation.replace('Home');
      }
    };
    checkSignedIn();
  }, [navigation]);

  const handleLogin = async () => {
    try {
      await auth().signInWithEmailAndPassword(email.trim(), password);
      navigation.replace('Home');
    } catch (error) {
      alert(error.message);
    }
  };

  // Google sign-in handler
  const onGoogleButtonPress = async () => {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const { idToken } = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      await auth().signInWithCredential(googleCredential);
      navigation.replace('Home');
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert('Cancelled', 'Google sign-in was cancelled');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert('In Progress', 'Google sign-in already in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Error', 'Google Play Services not available or outdated');
      } else {
        Alert.alert('Error', error.message);
      }
    }
  };

  // Sign out handler (optional, if you want to add sign out here or another screen)
  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      await auth().signOut();
      Alert.alert('Signed out');
    } catch (error) {
      Alert.alert('Error signing out', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>

      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Password"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button title="Login" onPress={handleLogin} />

      <View style={{ marginVertical: 12 }}>
        <Button
          title="Sign In with Google"
          color="#DB4437"
          onPress={onGoogleButtonPress}
        />
      </View>


      {/* Optional sign out button for testing */}
      {/* <Button title="Sign Out" onPress={signOut} color="#888" /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    fontFamily: 'OpenSans-Regular',
    color: '#3D5AFE',
    textAlign: 'center',
  },
  input: {
    height: 48,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    fontFamily: 'OpenSans-Regular',
  },
  link: {
    marginTop: 16,
    color: '#3D5AFE',
    textAlign: 'center',
    fontFamily: 'OpenSans-Regular',
  },
});
