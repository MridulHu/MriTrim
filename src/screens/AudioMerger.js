import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import { FFmpegKit } from 'ffmpeg-kit-react-native';
import Video from 'react-native-video';
import RNFS from 'react-native-fs';

// <-- Updated import from new package
import DocumentPicker, { pick, keepLocalCopy } from '@react-native-documents/picker';

export default function AudioMerger() {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [output, setOutput] = useState(null);

  // Request storage/media permission at runtime
  const requestStoragePermission = async () => {
    if (Platform.OS !== 'android') return true;

    try {
      if (Platform.Version >= 33) {
        // Android 13+
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO,
          {
            title: 'Permission to access audio files',
            message: 'App needs access to your audio files',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        // Android 12 and below
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'Permission to access storage',
            message: 'App needs access to your storage to pick audio files',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const pickAudio = async (setFile) => {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      Alert.alert(
        'Permission Denied',
        'You need to grant storage permission to pick audio files'
      );
      return;
    }

    try {
      // Use new 'pick' function which returns an array of files
      const results = await pick({
        type: [DocumentPicker.types.audio],
      });

      if (results && results.length > 0) {
        const file = results[0];

        // Use keepLocalCopy to copy the file locally (optional but recommended)
        const [localCopy] = await keepLocalCopy({
          files: [{ uri: file.uri, fileName: file.name ?? 'fallbackName' }],
          destination: 'documentDirectory',
        });

        setFile(localCopy);
        setOutput(null);
      }
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        Alert.alert('Error', 'Failed to pick audio file');
      }
    }
  };

  const pickAudio1 = () => pickAudio(setFile1);
  const pickAudio2 = () => pickAudio(setFile2);

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

      // Escape single quotes in paths
      const escapePath = (p) => p.replace(/'/g, "'\\''");

      const listContent = `file '${escapePath(path1)}'\nfile '${escapePath(path2)}'\n`;
      const listFilePath = `${dirPath}/filelist.txt`;

      await RNFS.writeFile(listFilePath, listContent, 'utf8');

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
      {file1 && <Text style={styles.filename}>File 1: {file1.fileName || file1.uri}</Text>}

      <Button title="Pick Second Audio" onPress={pickAudio2} />
      {file2 && <Text style={styles.filename}>File 2: {file2.fileName || file2.uri}</Text>}

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
  filename: { marginVertical: 10, fontWeight: 'bold' },
});
