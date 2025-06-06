import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  Platform,
} from 'react-native';
import DocumentPicker, { types } from '@react-native-documents/picker';
import { FFmpegKit } from 'ffmpeg-kit-react-native';
import Video from 'react-native-video';
import RNFS from 'react-native-fs';
import { v4 as uuidv4 } from 'uuid';

export default function VideoMerger() {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [output, setOutput] = useState(null);

  // Pick media function using @react-native-documents/picker
  const pickMedia = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [types.video],
      });
      // pick returns an array, get first item
      return res[0];
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled picker
        return null;
      } else {
        Alert.alert('Error', 'Failed to pick a video');
        return null;
      }
    }
  };

  // Copy content URI (Android) to local file for ffmpeg
  const copyContentUriToFile = async uri => {
    try {
      const fileName = `video_${uuidv4()}.mp4`;
      const destPath = `${RNFS.TemporaryDirectoryPath}/${fileName}`;

      const exists = await RNFS.exists(destPath);
      if (exists) await RNFS.unlink(destPath);

      await RNFS.copyFile(uri, destPath);
      return `file://${destPath}`;
    } catch (err) {
      console.warn('Error copying content URI:', err);
      return uri; // fallback
    }
  };

  const pickVideo = async () => {
    const picked = await pickMedia();
    if (picked) {
      let fileUri = picked.uri;

      if (Platform.OS === 'android' && fileUri.startsWith('content://')) {
        fileUri = await copyContentUriToFile(fileUri);
      }

      // Avoid duplicates by uri
      if (files.some(f => f.uri === fileUri)) {
        Alert.alert('Duplicate', 'This video is already selected.');
        return;
      }

      setFiles(prev => [...prev, { ...picked, uri: fileUri }]);
      setOutput(null);
    }
  };

  const mergeVideos = async () => {
    if (files.length < 2) {
      Alert.alert('Please select at least 2 videos');
      return;
    }

    try {
      const dir = RNFS.TemporaryDirectoryPath;
      const listFilePath = `${dir}/videolist.txt`;

      let listContent = '';
      files.forEach(f => {
        const path = f.uri.replace('file://', '');
        listContent += `file '${path}'\n`;
      });

      await RNFS.writeFile(listFilePath, listContent, 'utf8');

      const outputPath = `${dir}/merged_video_${Date.now()}.mp4`;

      const cmd = `-f concat -safe 0 -i "${listFilePath}" -c copy "${outputPath}"`;

      setProcessing(true);
      FFmpegKit.executeAsync(cmd, async session => {
        const returnCode = await session.getReturnCode();

        setProcessing(false);
        if (returnCode.isValueSuccess()) {
          setOutput(`file://${outputPath}`);
          Alert.alert('Success', 'Videos merged successfully!');
        } else {
          Alert.alert('Error', 'Failed to merge videos');
        }
      });
    } catch (e) {
      Alert.alert('Error', e.message);
      setProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Pick Video" onPress={pickVideo} />
      <ScrollView style={{ maxHeight: 150, marginVertical: 10 }}>
        {files.map((file, index) => (
          <Text key={index} style={styles.filename}>
            {index + 1}. {file.name || file.uri.split('/').pop()}
          </Text>
        ))}
      </ScrollView>
      <Button title="Merge Videos" onPress={mergeVideos} disabled={processing} />
      {processing && <ActivityIndicator size="large" style={{ marginTop: 10 }} />}

      {output && (
        <>
          <Text style={{ marginTop: 20 }}>Merged Video:</Text>
          <Video
            source={{ uri: output }}
            controls
            style={{ width: '100%', height: 250 }}
            resizeMode="contain"
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  filename: { marginVertical: 5 },
});
