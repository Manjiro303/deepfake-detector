import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Video } from 'expo-av';
import { analyzeVideo } from './detector';

export default function App() {
  const [video, setVideo] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickVideo = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
    });

    if (!result.canceled) {
      setVideo(result.assets[0].uri);
      setResult(null);
    }
  };

  const analyze = async () => {
    if (!video) return;
    setLoading(true);
    const res = await analyzeVideo(video);
    setResult(res);
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛡️ Deepfake Detector</Text>

      {video && (
        <Video
          source={{ uri: video }}
          style={styles.video}
          useNativeControls
          resizeMode="contain"
        />
      )}

      <TouchableOpacity style={styles.btn} onPress={pickVideo}>
        <Text style={styles.btnText}>📹 Choose Video</Text>
      </TouchableOpacity>

      {video && (
        <TouchableOpacity 
          style={[styles.btn, styles.analyzeBtn]} 
          onPress={analyze}
          disabled={loading}
        >
          <Text style={styles.btnText}>
            {loading ? '⏳ Analyzing...' : '🔍 Analyze'}
          </Text>
        </TouchableOpacity>
      )}

      {result && (
        <View style={styles.result}>
          <Text style={styles.resultText}>
            {result.prediction === 'REAL' ? '✅' : '❌'} {result.prediction}
          </Text>
          <Text>Confidence: {(result.confidence * 100).toFixed(1)}%</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  video: {
    width: '100%',
    height: 200,
    backgroundColor: '#000',
    marginBottom: 20,
  },
  btn: {
    backgroundColor: '#8B5CF6',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  analyzeBtn: {
    backgroundColor: '#10B981',
  },
  btnText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  result: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
