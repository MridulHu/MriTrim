import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

export default function HomeScreen({ navigation }) {
  const user = auth().currentUser;

  const handleSignOut = async () => {
    try {
      const isSignedIn = await GoogleSignin.isSignedIn();
      if (isSignedIn) {
        await GoogleSignin.signOut();
      }
      await auth().signOut();
      navigation.replace('Login');
    } catch (error) {
      Alert.alert('Error signing out', error.message);
    }
  };

  const NavButton = ({ title, onPress, style, textStyle }) => (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.button, style]}
    >
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.welcomeText}>
        Welcome{user?.email ? `, ${user.email}` : ''}!
      </Text>

      <NavButton
        title="Trim Audio"
        onPress={() => navigation.navigate('AudioTrimmer')}
      />
      <NavButton
        title="Merge Audio"
        onPress={() => navigation.navigate('AudioMerger')}
      />
      <NavButton
        title="Trim Video"
        onPress={() => navigation.navigate('VideoTrimmer')}
      />
      <NavButton
        title="Play Media"
        onPress={() => navigation.navigate('MediaPlayer')}
      />

      <NavButton
        title="Sign Out"
        onPress={handleSignOut}
        style={styles.signOutButton}
        textStyle={styles.signOutButtonText}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f0f4ff',
    padding: 24,
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: 26,
    marginBottom: 40,
    fontFamily: 'OpenSans-Regular',
    color: '#3D5AFE',
    textAlign: 'center',
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#3D5AFE',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#3D5AFE',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'OpenSans-Regular',
    textAlign: 'center',
  },
  signOutButton: {
    backgroundColor: '#E53935',
    marginTop: 40,
    shadowColor: '#E53935',
  },
  signOutButtonText: {
    fontWeight: '700',
  },
});
