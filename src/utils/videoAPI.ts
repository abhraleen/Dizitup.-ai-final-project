// Video Generation API Integration
// Supports multiple providers with free tiers

export interface VideoAPIConfig {
  provider: 'runwayml' | 'huggingface' | 'replicate' | 'stability' | 'did';
  apiKey: string;
}

export interface VideoGenerationRequest {
  prompt: string;
  videoFile?: File;
  duration?: number;
  aspectRatio?: string;
  fps?: number;
}

export interface VideoGenerationResponse {
  success: boolean;
  videoUrl?: string;
  jobId?: string;
  error?: string;
}

// Runway ML API Integration
export const runwayMLAPI = async (
  apiKey: string,
  request: VideoGenerationRequest
): Promise<VideoGenerationResponse> => {
  try {
    const endpoint = 'https://api.runwayml.com/v1/generate';
    
    const formData = new FormData();
    formData.append('prompt', request.prompt);
    if (request.videoFile) {
      formData.append('video', request.videoFile);
    }
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Runway ML API error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      success: true,
      videoUrl: data.output_url,
      jobId: data.id,
    };
  } catch (error) {
    console.error('Runway ML API Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

// HuggingFace API Integration (100% FREE)
export const huggingFaceAPI = async (
  apiKey: string,
  request: VideoGenerationRequest
): Promise<VideoGenerationResponse> => {
  try {
    const model = 'damo-vilab/text-to-video-ms-1.7b';
    const endpoint = `https://api-inference.huggingface.co/models/${model}`;
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: request.prompt,
        parameters: {
          num_frames: request.duration || 16,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`HuggingFace API error: ${response.statusText}`);
    }

    const blob = await response.blob();
    const videoUrl = URL.createObjectURL(blob);
    
    return {
      success: true,
      videoUrl,
    };
  } catch (error) {
    console.error('HuggingFace API Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

// Replicate API Integration (Free credits on signup)
export const replicateAPI = async (
  apiKey: string,
  request: VideoGenerationRequest
): Promise<VideoGenerationResponse> => {
  try {
    // Step 1: Create prediction
    const createResponse = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: 'stable-video-diffusion-model-version-id', // Replace with actual model version
        input: {
          prompt: request.prompt,
          num_frames: request.duration || 25,
        },
      }),
    });

    if (!createResponse.ok) {
      throw new Error(`Replicate API error: ${createResponse.statusText}`);
    }

    const prediction = await createResponse.json();
    
    // Step 2: Poll for completion
    let status = 'processing';
    let result = null;
    
    while (status === 'processing' || status === 'starting') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const statusResponse = await fetch(
        `https://api.replicate.com/v1/predictions/${prediction.id}`,
        {
          headers: {
            'Authorization': `Token ${apiKey}`,
          },
        }
      );
      
      result = await statusResponse.json();
      status = result.status;
    }
    
    if (status === 'succeeded') {
      return {
        success: true,
        videoUrl: result.output,
        jobId: prediction.id,
      };
    } else {
      throw new Error(`Generation failed: ${status}`);
    }
  } catch (error) {
    console.error('Replicate API Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

// Stability AI API Integration
export const stabilityAIAPI = async (
  apiKey: string,
  request: VideoGenerationRequest
): Promise<VideoGenerationResponse> => {
  try {
    const formData = new FormData();
    if (request.videoFile) {
      formData.append('image', request.videoFile);
    }
    formData.append('cfg_scale', '1.8');
    formData.append('motion_bucket_id', '127');
    
    const response = await fetch(
      'https://api.stability.ai/v2beta/image-to-video',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`Stability AI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      success: true,
      videoUrl: data.video,
      jobId: data.id,
    };
  } catch (error) {
    console.error('Stability AI API Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

// D-ID API Integration (Talking head videos)
export const dIDAPI = async (
  apiKey: string,
  request: VideoGenerationRequest
): Promise<VideoGenerationResponse> => {
  try {
    const response = await fetch('https://api.d-id.com/talks', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        script: {
          type: 'text',
          input: request.prompt,
        },
        config: {
          fluent: true,
          pad_audio: 0,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`D-ID API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Poll for completion
    let status = 'created';
    let result = null;
    
    while (status !== 'done') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const statusResponse = await fetch(
        `https://api.d-id.com/talks/${data.id}`,
        {
          headers: {
            'Authorization': `Basic ${apiKey}`,
          },
        }
      );
      
      result = await statusResponse.json();
      status = result.status;
      
      if (status === 'error') {
        throw new Error('Video generation failed');
      }
    }
    
    return {
      success: true,
      videoUrl: result.result_url,
      jobId: data.id,
    };
  } catch (error) {
    console.error('D-ID API Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

// Main API caller that routes to the correct provider
export const generateVideo = async (
  config: VideoAPIConfig,
  request: VideoGenerationRequest
): Promise<VideoGenerationResponse> => {
  switch (config.provider) {
    case 'runwayml':
      return runwayMLAPI(config.apiKey, request);
    case 'huggingface':
      return huggingFaceAPI(config.apiKey, request);
    case 'replicate':
      return replicateAPI(config.apiKey, request);
    case 'stability':
      return stabilityAIAPI(config.apiKey, request);
    case 'did':
      return dIDAPI(config.apiKey, request);
    default:
      return {
        success: false,
        error: 'Unknown provider',
      };
  }
};

// Get API key from localStorage
export const getStoredAPIKey = (provider: string = 'runwayml'): string | null => {
  return localStorage.getItem(`dizitup_${provider}_api_key`);
};

// Save API key to localStorage
export const saveAPIKey = (provider: string, apiKey: string): void => {
  localStorage.setItem(`dizitup_${provider}_api_key`, apiKey);
};

// Clear API key from localStorage
export const clearAPIKey = (provider: string): void => {
  localStorage.removeItem(`dizitup_${provider}_api_key`);
};
