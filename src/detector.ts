import * as FileSystem from 'expo-file-system';

// Add your API key here after signing up at https://scanner.deepware.ai/
const API_KEY = ''; // TODO: Add your API key

interface DetectionResult {
  prediction: 'REAL' | 'FAKE';
  confidence: number;
  details?: {
    faceScore?: number;
    audioScore?: number;
    frameScore?: number;
  };
  error?: string;
}

export async function analyzeVideo(uri: string): Promise<DetectionResult> {
  try {
    // Check if API key is configured
    if (!API_KEY) {
      console.log('No API key configured, using fallback analysis');
      return fallbackAnalysis();
    }

    // Get file info
    const fileInfo = await FileSystem.getInfoAsync(uri);
    if (!fileInfo.exists) {
      throw new Error('Video file not found');
    }

    // Read video as base64
    const videoBase64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Call deepfake detection API (DeepWare example)
    const response = await fetch('https://api.deepware.ai/v1/scan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        video: videoBase64,
      }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      prediction: data.isFake ? 'FAKE' : 'REAL',
      confidence: data.confidence || 0,
      details: {
        faceScore: data.faceScore,
        audioScore: data.audioScore,
        frameScore: data.frameScore,
      },
    };

  } catch (error) {
    console.error('Detection error:', error);
    return fallbackAnalysis();
  }
}

// Fallback when API is not available (NOT ACCURATE - for demo only)
function fallbackAnalysis(): DetectionResult {
  // This is just a simulation - NOT real detection
  const confidence = 0.5 + Math.random() * 0.3;
  const isFake = Math.random() > 0.5;
  
  return {
    prediction: isFake ? 'FAKE' : 'REAL',
    confidence: confidence,
    details: {
      faceScore: 0.6 + Math.random() * 0.3,
      audioScore: 0.5 + Math.random() * 0.4,
      frameScore: 0.7 + Math.random() * 0.2,
    },
    error: '⚠️ Using demo mode. Configure API key for real detection.',
  };
}
