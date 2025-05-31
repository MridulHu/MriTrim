import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import Video from 'react-native-video';

const MediaPlayer = ({ source }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  return (
    <View style={styles.container}>
      {loading && !error && (
        <ActivityIndicator size="large" color="#3D5AFE" style={styles.loader} />
      )}
      {error && (
        <Text style={styles.errorText}>Failed to load video: {error}</Text>
      )}
      <Video
        source={{ uri: source }}
        style={styles.video}
        controls
        resizeMode="contain"
        onLoad={() => setLoading(false)}
        onError={(e) => {
          setLoading(false);
          setError(e.error.errorString || 'Unknown error');
        }}
        onBuffer={({ isBuffering }) => setLoading(isBuffering)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#000',
    alignSelf: 'stretch',
    height: 220,
    justifyContent: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  loader: {
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 10,
  },
  errorText: {
    color: '#ff4444',
    textAlign: 'center',
    padding: 12,
  },
});

export default MediaPlayer;
