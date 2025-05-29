import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import AudioTrimmer from '../screens/AudioTrimmer';
import AudioMerger from '../screens/AudioMerger';
import VideoTrimmer from '../screens/VideoTrimmer';
import MediaPlayer from '../screens/MediaPlayer';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="AudioTrimmer" component={AudioTrimmer} options={{ title: 'Trim Audio' }} />
      <Stack.Screen name="AudioMerger" component={AudioMerger} options={{ title: 'Merge Audio' }} />
      <Stack.Screen name="VideoTrimmer" component={VideoTrimmer} options={{ title: 'Trim Video' }} />
      <Stack.Screen name="MediaPlayer" component={MediaPlayer} options={{ title: 'Play Media' }} />
    </Stack.Navigator>
  );
}
