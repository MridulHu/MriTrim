import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { pickMedia } from '../utils/filePicker'; // Your media picker utility
import { FFmpegKit } from 'ffmpeg-kit-react-native';
import Video from 'react-native-video';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';

export default function AudioMerger() {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [output, setOutput] = useState(null);

  const pickAudio1 = async () => {
    try {
      const picked = await pickMedia(['audio/*']);
      if (picked) {
        setFile1(picked);
        setOutput(null);
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to pick first audio');
    }
  };

  const pickAudio2 = async () => {
    try {
      const picked = await pickMedia(['audio/*']);
      if (picked) {
        setFile2(picked);
        setOutput(null);
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to pick second audio');
    }
  };

  const mergeAudio = async () => {
    if (!file1 || !file2) {
      Alert.alert('Error', 'Please select both audio files before merging');
      return;
    }

    try {
      // Remove 'file://' prefix if present
      const path1 = file1.uri.replace('file://', '');
      const path2 = file2.uri.replace('file://', '');

      // Output file path (same directory as first file)
      const dirPath = path1.substring(0, path1.lastIndexOf('/'));
      const outputPath = `${dirPath}/merged_audio_${Date.now()}.mp3`;

      // Create a file list for ffmpeg concat
      // Paths must be absolute and properly escaped if spaces exist
      // Wrap paths in single quotes and escape existing single quotes by replacing with '\''
      const escapePath = (p) => p.replace(/'/g, "'\\''");

      const listContent = `file '${escapePath(path1)}'\nfile '${escapePath(path2)}'\n`;

      // Write the file list (filelist.txt) to the same directory
      const listFilePath = `${dirPath}/filelist.txt`;

      await RNFS.writeFile(listFilePath, listContent, 'utf8');

      // ffmpeg command for concat demuxer:
      // -safe 0 disables safe filename checks (required if filenames have special chars)
      const cmd = `-f concat -safe 0 -i ${listFilePath} -c copy ${outputPath}`;

      setProcessing(true);

      FFmpegKit.executeAsync(cmd, async (session) => {
        const returnCode = await session.getReturnCode();

        setProcessing(false);

        if (returnCode.isValueSuccess()) {
          setOutput(`file://${outputPath}`);
        } else {
          Alert.alert('Error', 'Failed to merge audio files');
        }
      });
    } catch (e) {
      setProcessing(false);
      Alert.alert('Error', e.message || 'Unknown error occurred');
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Pick First Audio" onPress={pickAudio1} />
      {file1 && <Text style={styles.filename}>File 1: {file1.name || file1.uri}</Text>}

      <Button title="Pick Second Audio" onPress={pickAudio2} />
      {file2 && <Text style={styles.filename}>File 2: {file2.name || file2.uri}</Text>}

      <Button title="Merge Audio" onPress={mergeAudio} disabled={processing} />

      {processing && <ActivityIndicator size="large" style={{ marginTop: 10 }} />}

      {output && (
        <>
          <Text style={{ marginTop: 20 }}>Merged Audio:</Text>
          <Video
            source={{ uri: output }}
            audioOnly
            controls
            style={{ width: '100%', height: 50 }}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  filename: { marginVertical: 10, fontWeight: 'bold' },
});
