import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, ActivityIndicator } from 'react-native';
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
      Alert.alert('Permission Needed', 'Please grant media library permissions.');
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
    try {
      const res = await analyzeVideo(video);
      setResult(res);
      if (res.error) {
        Alert.alert('Notice', res.error);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to analyze video');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setVideo(null);
    setResult(null);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🛡️ Deepfake Detector</Text>
      <Text style={styles.subtitle}>AI-Powered Video Authentication</Text>

      {video && (
        <Video
          source={{ uri: video }}
          style={styles.video}
          useNativeControls
          resizeMode="contain"
        />
      )}

      <TouchableOpacity style={styles.btn} onPress={pickVideo} disabled={loading}>
        <Text style={styles.btnText}>
          📹 {video ? 'Choose Different Video' : 'Select Video'}
        </Text>
      </TouchableOpacity>

      {video && !result && (
        <TouchableOpacity 
          style={[styles.btn, styles.analyzeBtn]} 
          onPress={analyze}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>🔍 Analyze Video</Text>
          )}
        </TouchableOpacity>
      )}

      {result && (
        <TouchableOpacity style={[styles.btn, styles.resetBtn]} onPress={reset}>
          <Text style={styles.btnText}>🔄 Analyze Another</Text>
        </TouchableOpacity>
      )}

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B5CF6" />
          <Text style={styles.loadingText}>Analyzing video...</Text>
        </View>
      )}

      {result && (
        <View style={styles.resultCard}>
          <View style={[
            styles.resultHeader,
            { backgroundColor: result.prediction === 'FAKE' ? '#EF4444' : '#10B981' }
          ]}>
            <Text style={styles.resultIcon}>
              {result.prediction === 'REAL' ? '✅' : '⚠️'}
            </Text>
            <Text style={styles.resultTitle}>{result.prediction}</Text>
          </View>

          <View style={styles.resultBody}>
            <Text style={styles.label}>Confidence Score</Text>
            <View style={styles.confidenceBar}>
              <View 
                style={[styles.confidenceFill, { 
                  width: `${result.confidence * 100}%`,
                  backgroundColor: result.confidence > 0.7 ? '#10B981' : '#F59E0B'
                }]} 
              />
            </View>
            <Text style={styles.confidenceText}>
              {(result.confidence * 100).toFixed(1)}%
            </Text>

            {result.details && (
              <View style={styles.detailsSection}>
                <Text style={styles.label}>Analysis Details</Text>
                
                {result.details.faceScore !== undefined && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Face Analysis:</Text>
                    <Text style={styles.detailValue}>
                      {(result.details.faceScore * 100).toFixed(0)}%
                    </Text>
                  </View>
                )}

                {result.details.audioScore !== undefined && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Audio Analysis:</Text>
                    <Text style={styles.detailValue}>
                      {(result.details.audioScore * 100).toFixed(0)}%
                    </Text>
                  </View>
                )}

                {result.details.frameScore !== undefined && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Frame Consistency:</Text>
                    <Text style={styles.detailValue}>
                      {(result.details.frameScore * 100).toFixed(0)}%
                    </Text>
                  </View>
                )}
              </View>
            )}

            {result.error && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{result.error}</Text>
              </View>
            )}
          </View>
        </View>
      )}
    </ScrollView>
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
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 30,
    color: '#6b7280',
  },
  video: {
    width: '100%',
    height: 200,
    backgroundColor: '#000',
    marginBottom: 20,
    borderRadius: 12,
  },
  btn: {
    backgroundColor: '#8B5CF6',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  analyzeBtn: {
    backgroundColor: '#10B981',
  },
  resetBtn: {
    backgroundColor: '#6B7280',
  },
  btnText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6b7280',
  },
  resultCard: {
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    marginBottom: 30,
  },
  resultHeader: {
    padding: 20,
    alignItems: 'center',
  },
  resultIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  resultBody: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginTop: 12,
  },
  confidenceBar: {
    height: 12,
    backgroundColor: '#e5e7eb',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  confidenceFill: {
    height: '100%',
    borderRadius: 6,
  },
  confidenceText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginTop: 4,
  },
  detailsSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  errorBox: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  errorText: {
    fontSize: 13,
    color: '#92400E',
  },
});
