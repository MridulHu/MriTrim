import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { pickMedia } from '../utils/filePicker';
import { FFmpegKit } from 'ffmpeg-kit-react-native';
import Video from 'react-native-video';
import RNFS from 'react-native-fs';

export default function VideoMerger() {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [output, setOutput] = useState(null);

  const pickVideo = async () => {
    const picked = await pickMedia(['video/*']);
    if (picked) {
      setFiles(prev => [...prev, picked]);
      setOutput(null);
    }
  };

  const mergeVideos = async () => {
    if (files.length < 2) {
      Alert.alert('Please select at least 2 videos');
      return;
    }

    try {
      const dir = files[0].uri.replace(/\/[^\/]*$/, '');
      const listFilePath = `${dir}/videolist.txt`;
      let listContent = '';
      files.forEach(f => {
        const path = f.uri.replace('file://', '');
        listContent += `file '${path}'\n`;
      });

      await RNFS.writeFile(listFilePath, listContent, 'utf8');

      const outputPath = `${dir}/merged_video_${Date.now()}.mp4`;

      const cmd = `-f concat -safe 0 -i ${listFilePath} -c copy ${outputPath}`;

      setProcessing(true);
      FFmpegKit.executeAsync(cmd, async session => {
        const returnCode = await session.getReturnCode();

        setProcessing(false);
        if (returnCode.isValueSuccess()) {
          setOutput(`file://${outputPath}`);
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
            {index + 1}. {file.name}
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
