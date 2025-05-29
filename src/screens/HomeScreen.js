import React from 'react';
import { View, Button, StyleSheet, Text, Alert } from 'react-native';
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

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>
        Welcome{user?.email ? `, ${user.email}` : ''}!
      </Text>
      <Button title="Trim Audio" onPress={() => navigation.navigate('AudioTrimmer')} />
      <Button title="Merge Audio" onPress={() => navigation.navigate('AudioMerger')} />
      <Button title="Trim Video" onPress={() => navigation.navigate('VideoTrimmer')} />
      <Button title="Play Media" onPress={() => navigation.navigate('MediaPlayer')} />
      <View style={{ marginTop: 20 }}>
        <Button title="Sign Out" color="#E53935" onPress={handleSignOut} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    justifyContent: 'center', 
    backgroundColor: '#fff', 
  },
  welcomeText: {
    fontSize: 24,
    marginBottom: 30,
    fontFamily: 'OpenSans-Regular',
    color: '#3D5AFE',
    textAlign: 'center',
  },
});
