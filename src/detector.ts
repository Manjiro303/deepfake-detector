export async function analyzeVideo(uri: string) {
  // Simulate processing
  await new Promise(r => setTimeout(r, 2000));
  
  return {
    prediction: Math.random() > 0.5 ? 'REAL' : 'FAKE',
    confidence: 0.75 + Math.random() * 0.2,
  };
}
