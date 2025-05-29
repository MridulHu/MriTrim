import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { pickMedia } from '../utils/filePicker';
import { FFmpegKit } from 'ffmpeg-kit-react-native';
import Video from 'react-native-video';

export default function AudioMerger() {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [output, setOutput] = useState(null);

  const pickAudio1 = async () => {
    const picked = await pickMedia([DocumentPicker.types.audio]);
    if (picked) {
      setFile1(picked);
      setOutput(null);
    }
  };

  const pickAudio2 = async () => {
    const picked = await pickMedia([DocumentPicker.types.audio]);
    if (picked) {
      setFile2(picked);
      setOutput(null);
    }
  };

  const mergeAudio = async () => {
    if (!file1 || !file2) {
      Alert.alert('Select both audio files');
      return;
    }

    const inputPath1 = file1.uri.replace('file://', '');
    const inputPath2 = file2.uri.replace('file://', '');
    const outputPath = `${inputPath1.substring(0, inputPath1.lastIndexOf('/'))}/merged_audio.mp3`;

    // Create a file list for ffmpeg concat input
    const listFilePath = `${inputPath1.substring(0, inputPath1.lastIndexOf('/'))}/filelist.txt`;
    const fs = require('react-native-fs');

    const listContent = `file '${inputPath1}'\nfile '${inputPath2}'\n`;

    try {
      await fs.writeFile(listFilePath, listContent, 'utf8');
    } catch (e) {
      Alert.alert('Error writing file list for merging', e.message);
      return;
    }

    // FFmpeg command to concat audio files
    const cmd = `-f concat -safe 0 -i ${listFilePath} -c copy ${outputPath}`;

    setProcessing(true);
    FFmpegKit.executeAsync(cmd, async session => {
      const returnCode = await session.getReturnCode();

      setProcessing(false);
      if (returnCode.isValueSuccess()) {
        setOutput(`file://${outputPath}`);
      } else {
        Alert.alert('Error', 'Failed to merge audio');
      }
    });
  };

  return (
    <View style={styles.container}>
      <Button title="Pick First Audio" onPress={pickAudio1} />
      {file1 && <Text>File 1: {file1.name}</Text>}
      <Button title="Pick Second Audio" onPress={pickAudio2} />
      {file2 && <Text>File 2: {file2.name}</Text>}

      <Button title="Merge Audio" onPress={mergeAudio} disabled={processing} />
      {processing && <ActivityIndicator size="large" style={{ marginTop: 10 }} />}

      {output && (
        <>
          <Text style={{ marginTop: 20 }}>Merged Audio:</Text>
          <Video source={{ uri: output }} audioOnly controls style={{ width: '100%', height: 50 }} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
});
