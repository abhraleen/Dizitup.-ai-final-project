# 🔗 Frontend Integration Guide

## Connecting React Frontend to Video Backend API

### Overview

This guide shows how to integrate the video generation backend with your existing React/Vite frontend.

---

## 📦 Installation (Backend)

### Step 1: Install Backend Dependencies

```bash
cd server
npm install
```

### Step 2: Start Backend Server

```bash
npm start
```

Backend will run on: `http://localhost:3001`

---

## 🎨 Frontend Integration

### Option A: Update Existing VideoEditingInterface

Update your `src/components/VideoEditingInterface.tsx` to use the backend:

```typescript
// Add this function to replace the HuggingFace API call
const callBackendAPI = async (prompt: string): Promise<boolean> => {
  setIsApiLoading(true);
  
  try {
    toast({
      title: "Connecting to Backend",
      description: "Sending request to video generation server...",
    });

    const response = await fetch('http://localhost:3001/api/video/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Server error: ${response.status}`);
    }

    // Get video blob
    const videoBlob = await response.blob();
    const videoUrl = URL.createObjectURL(videoBlob);
    
    setGeneratedVideoUrl(videoUrl);
    
    toast({
      title: "Video Generated!",
      description: "Your AI video is ready to download!",
    });

    setIsApiLoading(false);
    return true;

  } catch (error) {
    console.error('Backend API Error:', error);
    setIsApiLoading(false);
    
    toast({
      title: "Generation Failed",
      description: error instanceof Error ? error.message : "Failed to generate video",
      variant: "destructive",
    });
    
    return false;
  }
};
```

---

### Option B: Create New Backend Service

Create `src/services/videoBackendService.ts`:

```typescript
import { toast } from "@/hooks/use-toast";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

export interface VideoGenerationResponse {
  success: boolean;
  videoUrl?: string;
  error?: string;
}

export const generateVideoFromBackend = async (
  prompt: string
): Promise<VideoGenerationResponse> => {
  try {
    // Health check first
    const healthCheck = await fetch(`${BACKEND_URL}/health`);
    if (!healthCheck.ok) {
      throw new Error('Backend server is not responding');
    }

    // Generate video
    const response = await fetch(`${BACKEND_URL}/api/video/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.error || errorData.suggestion || 'Unknown error'
      };
    }

    // Get video blob
    const videoBlob = await response.blob();
    const videoUrl = URL.createObjectURL(videoBlob);

    return {
      success: true,
      videoUrl
    };

  } catch (error) {
    console.error('Video generation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to connect to backend'
    };
  }
};
```

**Usage in component:**

```typescript
import { generateVideoFromBackend } from '@/services/videoBackendService';

const handleGenerate = async () => {
  const result = await generateVideoFromBackend(aiPrompt);
  
  if (result.success && result.videoUrl) {
    setGeneratedVideoUrl(result.videoUrl);
    toast({
      title: "Success!",
      description: "Video generated successfully"
    });
  } else {
    toast({
      title: "Error",
      description: result.error,
      variant: "destructive"
    });
  }
};
```

---

## 🔧 Environment Configuration

### Add to `.env` (Frontend Root)

```env
VITE_BACKEND_URL=http://localhost:3001
```

### Access in Code

```typescript
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
```

---

## 🚀 Running Both Servers

### Terminal 1: Frontend (Vite)

```bash
npm run dev
```

Runs on: `http://localhost:8080`

### Terminal 2: Backend (Express)

```bash
cd server
npm start
```

Runs on: `http://localhost:3001`

---

## 🎯 Complete Integration Example

### Updated `VideoEditingInterface.tsx`

```typescript
const startProcessing = async () => {
  // ... validation code ...
  
  setGeneratedVideoUrl(null);
  setIsProcessing(true);
  
  try {
    // Call backend instead of direct HuggingFace API
    const response = await fetch('http://localhost:3001/api/video/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: aiPrompt })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Generation failed');
    }

    const videoBlob = await response.blob();
    const videoUrl = URL.createObjectURL(videoBlob);
    
    setGeneratedVideoUrl(videoUrl);
    setCompleted(true);
    
    toast({
      title: "Video Ready!",
      description: "Your AI-generated video is ready to download"
    });

  } catch (error) {
    console.error('Error:', error);
    toast({
      title: "Generation Failed",
      description: error.message,
      variant: "destructive"
    });
  } finally {
    setIsProcessing(false);
  }
};
```

---

## 📊 Error Handling

### Frontend Should Handle These States

```typescript
interface GenerationState {
  idle: 'Ready to generate';
  loading: 'Generating video...';
  success: 'Video generated!';
  error_503: 'Model is loading, please wait 1-2 minutes';
  error_404: 'Model not found, try again later';
  error_429: 'Rate limited, please wait';
  error_network: 'Cannot connect to backend server';
}
```

### Example Error Handler

```typescript
const handleBackendError = (status: number, message: string) => {
  switch (status) {
    case 503:
      return {
        title: "Model Loading",
        description: "The AI model is warming up. Please wait 1-2 minutes and try again.",
        retry: true
      };
    
    case 404:
      return {
        title: "Model Unavailable",
        description: "The video generation model is temporarily unavailable. Try again in a few minutes.",
        retry: true
      };
    
    case 429:
      return {
        title: "Rate Limited",
        description: "Too many requests. Please wait a few minutes before trying again.",
        retry: true
      };
    
    case 400:
      return {
        title: "Invalid Request",
        description: message,
        retry: false
      };
    
    default:
      return {
        title: "Generation Failed",
        description: message || "An unexpected error occurred",
        retry: true
      };
  }
};
```

---

## 🔒 CORS Configuration

Backend is already configured to accept requests from `http://localhost:8080`.

If you need to change the frontend URL:

**Update `server/.env`:**
```env
CLIENT_URL=http://localhost:8080
```

Or allow multiple origins in `server/server.js`:

```javascript
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:3000'],
  credentials: true
}));
```

---

## 🧪 Testing Integration

### 1. Test Backend Health

```bash
curl http://localhost:3001/health
```

### 2. Test Backend Video Generation

```bash
curl -X POST http://localhost:3001/api/video/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "test"}' \
  -o test.mp4
```

### 3. Test Frontend Connection

In your browser console (F12):

```javascript
fetch('http://localhost:3001/api/video/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ prompt: 'test' })
})
.then(r => r.blob())
.then(blob => console.log('Success! Size:', blob.size))
.catch(err => console.error('Error:', err));
```

---

## 📱 Production Deployment

### Backend (Server)

Deploy to:
- **Railway**: Automatic deployment from Git
- **Render**: Free tier available
- **Heroku**: Add `Procfile`: `web: node server.js`

### Frontend Updates

Update environment variable to production backend URL:

```env
VITE_BACKEND_URL=https://your-backend.railway.app
```

---

## 🎯 Advantages of Using Backend

### ✅ Pros

- **Security**: API token hidden from frontend
- **Better Error Handling**: Centralized error management
- **Caching**: Can implement caching in backend
- **Rate Limiting**: Control API usage
- **Preprocessing**: Can add image processing, validation
- **Monitoring**: Better logging and analytics
- **Scalability**: Easy to scale backend independently

### ⚠️ Cons

- **Extra Server**: Need to run two servers in development
- **Deployment**: Need to deploy backend separately
- **Latency**: Extra network hop (minimal)

---

## 🚀 Quick Migration Checklist

- [ ] Install backend dependencies (`cd server && npm install`)
- [ ] Start backend server (`npm start` in server folder)
- [ ] Add `VITE_BACKEND_URL` to frontend `.env`
- [ ] Create `videoBackendService.ts` or update existing API calls
- [ ] Replace direct HuggingFace calls with backend calls
- [ ] Test integration locally
- [ ] Update error handling for backend responses
- [ ] Deploy backend to production
- [ ] Update frontend env vars for production

---

## 📞 Need Help?

### Common Issues

**"Cannot connect to backend"**
- Ensure backend is running: `cd server && npm start`
- Check URL is correct: `http://localhost:3001`
- Verify CORS settings in backend

**"CORS error"**
- Update `CLIENT_URL` in `server/.env`
- Restart backend server

**"Module not found"**
- Run `npm install` in server directory

---

**Ready to integrate!** 🎉

Check `server/README.md` for full backend documentation.
