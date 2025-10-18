import fetch from 'node-fetch';

const HF_TOKEN = process.env.HF_TOKEN;
const API_ENDPOINT = 'https://api-inference.huggingface.co/models/stabilityai/stable-video-diffusion-img2vid-xt';

/**
 * Generate video from text prompt using Hugging Face Stable Video Diffusion
 * @route POST /api/video/generate
 * @param {Object} req.body - { prompt: string }
 * @returns {Buffer} MP4 video buffer
 */
export const generateVideo = async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { prompt } = req.body;

    // Validation
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Invalid request. Please provide a "prompt" field in the request body.',
        example: { prompt: 'A beautiful sunset over the ocean' }
      });
    }

    if (prompt.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Prompt cannot be empty'
      });
    }

    if (!HF_TOKEN) {
      return res.status(500).json({
        success: false,
        error: 'Server configuration error: HF_TOKEN is not set'
      });
    }

    console.log(`\n🎬 Generating video for prompt: "${prompt}"`);
    console.log(`⏳ Requesting from Hugging Face API...`);

    // Prepare request payload with optimal parameters
    const payload = {
      inputs: prompt,
      parameters: {
        num_frames: 24,           // 24 frames for smooth motion
        fps: 12,                  // 12 FPS for cinematic look
        resolution: "512x512",    // Optimal resolution for SVD
        motion_bucket_id: 127,    // Higher = more motion
        noise_aug_strength: 0.02  // Lower = more stable
      },
      options: {
        wait_for_model: true,     // Wait if model is loading
        use_cache: false          // Get fresh generation
      }
    };

    // Call Hugging Face API
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    // Handle API errors
    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `API returned status ${response.status}`;

      // Specific error handling
      if (response.status === 404) {
        console.error('❌ Model not found error (404)');
        console.log('💡 Suggestion: The model might be in sleep mode. Try again after 1–2 minutes or duplicate the model space on Hugging Face.');
        errorMessage = 'Model not found. The model might be unavailable or in sleep mode.';
      } else if (response.status === 503) {
        console.error('❌ Model not loaded error (503)');
        console.log('💡 Suggestion: The model might be in sleep mode. Try again after 1–2 minutes or duplicate the model space on Hugging Face.');
        errorMessage = 'Model is currently loading. Please wait 1-2 minutes and try again.';
      } else if (response.status === 401) {
        console.error('❌ Authentication error (401)');
        errorMessage = 'Invalid Hugging Face API token';
      } else if (response.status === 429) {
        console.error('❌ Rate limit exceeded (429)');
        errorMessage = 'Rate limit exceeded. Please wait a few minutes before trying again.';
      } else {
        console.error(`❌ API Error: ${errorText}`);
      }

      return res.status(response.status).json({
        success: false,
        error: errorMessage,
        details: errorText,
        suggestion: response.status === 503 || response.status === 404 
          ? 'The model might be in sleep mode. Try again after 1–2 minutes or duplicate the model space on Hugging Face.'
          : null
      });
    }

    // Get video buffer
    const videoBuffer = await response.buffer();

    // Validate response
    if (!videoBuffer || videoBuffer.length === 0) {
      console.error('❌ Empty response from API');
      console.log('💡 Suggestion: The model might be in sleep mode. Try again after 1–2 minutes or duplicate the model space on Hugging Face.');
      
      return res.status(500).json({
        success: false,
        error: 'Received empty response from Hugging Face API',
        suggestion: 'The model might be in sleep mode. Try again after 1–2 minutes or duplicate the model space on Hugging Face.'
      });
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    const sizeInMB = (videoBuffer.length / (1024 * 1024)).toFixed(2);

    console.log(`✅ Video generated successfully!`);
    console.log(`📊 Size: ${sizeInMB} MB | Duration: ${duration}s`);
    console.log(`📝 Prompt: "${prompt}"\n`);

    // Return video as MP4
    res.set({
      'Content-Type': 'video/mp4',
      'Content-Length': videoBuffer.length,
      'Content-Disposition': `attachment; filename="generated-video-${Date.now()}.mp4"`,
      'X-Generation-Time': `${duration}s`,
      'X-Video-Size': `${sizeInMB}MB`
    });

    return res.status(200).send(videoBuffer);

  } catch (error) {
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    
    console.error('❌ Error generating video:', error.message);
    console.error('Stack:', error.stack);
    
    // Check if it's a network/timeout error
    if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
      console.log('💡 Suggestion: The model might be in sleep mode. Try again after 1–2 minutes or duplicate the model space on Hugging Face.');
    }

    return res.status(500).json({
      success: false,
      error: 'Failed to generate video',
      message: error.message,
      duration: `${duration}s`,
      suggestion: 'The model might be in sleep mode. Try again after 1–2 minutes or duplicate the model space on Hugging Face.'
    });
  }
};
