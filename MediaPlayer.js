import React from 'react';
import Video from 'react-native-video';

export default function MediaPlayer({ source, isVideo = false }) {
  return (
    <Video
      source={{ uri: source }}
      style={{ width: '100%', height: isVideo ? 300 : 50 }}
      controls
      resizeMode="contain"
    />
  );
}
