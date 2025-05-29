import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import Slider from '@react-native-community/slider';
import { pickMedia } from '../utils/filePicker';
import { FFmpegKit } from 'ffmpeg-kit-react-native';
import Video from 'react-native-video';

export default function AudioTrimmer() {
  const [file, setFile] = useState(null);
  const [duration, setDuration] = useState(0);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [output, setOutput] = useState(null);

  const pickAudio = async () => {
    const picked = await pickMedia(['audio/*']);
    if (picked) {
      setFile(picked);
      setOutput(null);
      setStart(0);
      setEnd(0);
      setDuration(0);
    }
  };

  // On media load, get duration
  const onLoad = (meta) => {
    const d = meta.duration || 0;
    setDuration(d);
    setEnd(d);
  };

  const trimAudio = async () => {
    if (!file) {
      Alert.alert('No file', 'Please pick an audio file first');
      return;
    }
    if (start >= end) {
      Alert.alert('Invalid times', 'Start time must be less than end time');
      return;
    }

    const inputPath = file.uri.replace('file://', '');
    const outputPath = `${inputPath.substring(0, inputPath.lastIndexOf('/'))}/trimmed_audio_${Date.now()}.mp3`;

    const cmd = `-i ${inputPath} -ss ${start} -to ${end} -c copy ${outputPath}`;

    setProcessing(true);
    FFmpegKit.executeAsync(cmd, async session => {
      const returnCode = await session.getReturnCode();

      setProcessing(false);
      if (returnCode.isValueSuccess()) {
        setOutput(`file://${outputPath}`);
      } else {
        Alert.alert('Error', 'Failed to trim audio');
      }
    });
  };

  return (
    <View style={styles.container}>
      <Button title="Pick Audio" onPress={pickAudio} />
      {file && <Text style={styles.filename}>Picked: {file.name}</Text>}

      {file && (
        <>
          <Text>Duration: {duration.toFixed(2)} sec</Text>
          <Text>Start Time: {start.toFixed(2)} sec</Text>
          <Slider
            style={{ width: '100%', height: 40 }}
            minimumValue={0}
            maximumValue={duration}
            value={start}
            onValueChange={value => {
              if (value < end) setStart(value);
            }}
            minimumTrackTintColor="#1fb28a"
            maximumTrackTintColor="#d3d3d3"
            thumbTintColor="#1a9274"
          />

          <Text>End Time: {end.toFixed(2)} sec</Text>
          <Slider
            style={{ width: '100%', height: 40 }}
            minimumValue={0}
            maximumValue={duration}
            value={end}
            onValueChange={value => {
              if (value > start) setEnd(value);
            }}
            minimumTrackTintColor="#b80e0e"
            maximumTrackTintColor="#d3d3d3"
            thumbTintColor="#b80e0e"
          />

          <Video
            source={{ uri: file.uri }}
            audioOnly
            paused={true}
            onLoad={onLoad}
            style={{ height: 0, width: 0 }} // hidden video for metadata only
          />

          <Button title="Trim Audio" onPress={trimAudio} disabled={processing} />
          {processing && <ActivityIndicator size="large" style={{ marginTop: 10 }} />}

          {output && (
            <>
              <Text style={{ marginTop: 20 }}>Trimmed Audio:</Text>
              <Video
                source={{ uri: output }}
                audioOnly
                controls
                style={{ width: '100%', height: 50 }}
              />
            </>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  filename: { marginVertical: 10, fontWeight: 'bold' },
});
