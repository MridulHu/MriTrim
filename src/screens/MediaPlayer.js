import React from 'react';
import { View } from 'react-native';
import Video from 'react-native-video';

const MediaPlayer = ({ source }) => {
  return (
    <View>
      <Video
        source={{ uri: source }}
        style={{ width: '100%', height: 200 }}
        controls
        resizeMode="contain"
      />
    </View>
  );
};

export default MediaPlayer;
