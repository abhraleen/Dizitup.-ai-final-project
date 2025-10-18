# 🎬 Video Generation Backend API

Professional Node.js Express backend for AI video generation using Hugging Face Stable Video Diffusion model.

## 📋 Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Error Handling](#error-handling)
- [Troubleshooting](#troubleshooting)

## ✨ Features

- ✅ **Modern ES6 Syntax** - Uses import/export modules
- ✅ **Stable Video Diffusion** - Hugging Face's latest video generation model
- ✅ **Optimized Parameters** - Pre-configured for cinematic output (24 frames, 12 FPS, 512x512)
- ✅ **Comprehensive Error Handling** - Detailed error messages and suggestions
- ✅ **CORS Enabled** - Ready for frontend integration
- ✅ **Type Validation** - Request validation and sanitization
- ✅ **Professional Logging** - Clear console output with emojis
- ✅ **Buffer Response** - Returns MP4 video as binary buffer

## 🛠️ Prerequisites

- **Node.js** >= 18.0.0
- **npm** or **yarn**
- **Hugging Face API Token** (free from https://huggingface.co/settings/tokens)

## 📦 Installation

### Step 1: Navigate to Server Directory

```bash
cd server
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs:
- `express` - Web framework
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment variable management
- `node-fetch` - HTTP client for API calls
- `nodemon` - Development auto-reload (dev dependency)

### Step 3: Configure Environment

Create a `.env` file (already created) or verify it contains:

```env
HF_TOKEN=your_huggingface_token_here
PORT=3001
NODE_ENV=development
CLIENT_URL=http://localhost:8080
```

## 🚀 Usage

### Start Production Server

```bash
npm start
```

### Start Development Server (with auto-reload)

```bash
npm run dev
```

You should see:

```
✅ Video generation server running
🚀 Server: http://localhost:3001
🎬 Video API: http://localhost:3001/api/video/generate
💚 Health Check: http://localhost:3001/health
```

## 📚 API Documentation

### Base URL

```
http://localhost:3001
```

### Endpoints

#### 1. Health Check

**GET** `/health`

Check if the server is running.

**Response:**
```json
{
  "status": "healthy",
  "message": "Video generation API is running",
  "timestamp": "2025-10-18T08:30:00.000Z"
}
```

---

#### 2. Generate Video

**POST** `/api/video/generate`

Generate an MP4 video from a text prompt.

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "prompt": "A beautiful sunset over the ocean with waves crashing"
}
```

**Parameters:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| prompt | string | Yes | Text description of the video to generate |

**Automatic Parameters (configured internally):**
```json
{
  "num_frames": 24,
  "fps": 12,
  "resolution": "512x512",
  "motion_bucket_id": 127,
  "noise_aug_strength": 0.02
}
```

**Success Response (200):**

Returns binary MP4 video buffer

**Response Headers:**
```
Content-Type: video/mp4
Content-Length: <size in bytes>
Content-Disposition: attachment; filename="generated-video-<timestamp>.mp4"
X-Generation-Time: <duration in seconds>
X-Video-Size: <size in MB>
```

**Error Response (400 - Bad Request):**
```json
{
  "success": false,
  "error": "Invalid request. Please provide a \"prompt\" field in the request body.",
  "example": {
    "prompt": "A beautiful sunset over the ocean"
  }
}
```

**Error Response (503 - Service Unavailable):**
```json
{
  "success": false,
  "error": "Model is currently loading. Please wait 1-2 minutes and try again.",
  "details": "...",
  "suggestion": "The model might be in sleep mode. Try again after 1–2 minutes or duplicate the model space on Hugging Face."
}
```

---

### Example Usage

#### cURL

```bash
curl -X POST http://localhost:3001/api/video/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "A sunset over the ocean"}' \
  --output video.mp4
```

#### JavaScript (fetch)

```javascript
const response = await fetch('http://localhost:3001/api/video/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    prompt: 'A beautiful sunset over the ocean'
  })
});

if (response.ok) {
  const videoBlob = await response.blob();
  const videoUrl = URL.createObjectURL(videoBlob);
  
  // Use videoUrl in <video> element or download
  const a = document.createElement('a');
  a.href = videoUrl;
  a.download = 'generated-video.mp4';
  a.click();
} else {
  const error = await response.json();
  console.error('Error:', error);
}
```

#### Axios

```javascript
import axios from 'axios';
import fs from 'fs';

const response = await axios.post(
  'http://localhost:3001/api/video/generate',
  { prompt: 'A sunset over the ocean' },
  { responseType: 'arraybuffer' }
);

fs.writeFileSync('video.mp4', response.data);
console.log('Video saved!');
```

## 🧪 Testing

### Run Test Suite

```bash
npm test
```

This runs automated tests for:
- Health check endpoint
- Valid video generation request
- Invalid request handling (missing prompt)
- Empty prompt validation

### Manual Testing

1. **Start the server:**
   ```bash
   npm start
   ```

2. **Test with cURL:**
   ```bash
   curl -X POST http://localhost:3001/api/video/generate \
     -H "Content-Type: application/json" \
     -d '{"prompt": "test"}' \
     -o test-video.mp4
   ```

3. **Check the generated video:**
   ```bash
   # The video will be saved as test-video.mp4
   ```

## 🔧 Error Handling

### HTTP Status Codes

| Code | Meaning | Resolution |
|------|---------|------------|
| 200 | Success | Video generated successfully |
| 400 | Bad Request | Check request format and prompt |
| 401 | Unauthorized | Verify HF_TOKEN in .env |
| 404 | Not Found | Model not available - wait and retry |
| 429 | Rate Limited | Wait a few minutes before retrying |
| 503 | Service Unavailable | Model loading - wait 1-2 minutes |
| 500 | Server Error | Check logs for details |

### Common Errors

#### 1. "Model not found" (404)

**Cause:** Hugging Face model is in sleep mode or unavailable

**Solution:**
```
💡 The model might be in sleep mode. Try again after 1–2 minutes 
   or duplicate the model space on Hugging Face.
```

**Action:**
1. Wait 1-2 minutes
2. Try again
3. Or duplicate the model at: https://huggingface.co/stabilityai/stable-video-diffusion-img2vid-xt

---

#### 2. "Model is loading" (503)

**Cause:** Model is warming up after being idle

**Solution:**
```
💡 The model might be in sleep mode. Try again after 1–2 minutes 
   or duplicate the model space on Hugging Face.
```

**Action:**
1. Wait 60-120 seconds
2. Retry the same request
3. First request after sleep always takes longer

---

#### 3. "Invalid API token" (401)

**Cause:** HF_TOKEN is missing or invalid

**Solution:**
1. Get new token: https://huggingface.co/settings/tokens
2. Update `.env` file
3. Restart server

---

#### 4. "Rate limit exceeded" (429)

**Cause:** Too many requests to Hugging Face API

**Solution:**
1. Wait 2-3 minutes
2. Implement request queuing
3. Consider upgrading to paid tier

## 🐛 Troubleshooting

### Server won't start

**Error:** `Cannot find module 'express'`

**Solution:**
```bash
cd server
npm install
```

---

**Error:** `Port 3001 is already in use`

**Solution:**
```bash
# Option 1: Kill the process
lsof -ti:3001 | xargs kill -9

# Option 2: Change port in .env
PORT=3002
```

---

### Video generation fails

**Check 1: HF_TOKEN is valid**
```bash
# Test token manually
curl https://api-inference.huggingface.co/models/stabilityai/stable-video-diffusion-img2vid-xt \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"inputs": "test"}'
```

**Check 2: Model is available**
Visit: https://huggingface.co/stabilityai/stable-video-diffusion-img2vid-xt

**Check 3: Server logs**
```bash
# Look for error messages in console output
```

---

### Empty response

**Cause:** Model returned no data

**Solution:**
1. Model might still be loading
2. Wait 2-3 minutes
3. Try with simpler prompt: `"a sunset"`

## 📂 Project Structure

```
server/
├── server.js                 # Main server file
├── package.json              # Dependencies and scripts
├── .env                      # Environment variables (DO NOT COMMIT)
├── .gitignore               # Git ignore rules
├── controllers/
│   └── videoController.js   # Video generation logic
├── routes/
│   └── videoRoutes.js       # API route definitions
├── test/
│   ├── testAPI.js           # Automated tests
│   └── output/              # Test output directory
└── README.md                # This file
```

## 🔐 Security Notes

⚠️ **IMPORTANT:**
- Never commit `.env` file to Git
- Never share your HF_TOKEN publicly
- Use environment variables for sensitive data
- Implement rate limiting in production
- Add authentication for public APIs

## 📊 Performance

### Expected Response Times

| Model State | Response Time |
|------------|---------------|
| Warm (recently used) | 5-15 seconds |
| Cold (sleeping) | 60-120 seconds |
| First request | 90-180 seconds |

### Optimization Tips

1. **Keep model warm:** Make regular requests
2. **Duplicate model:** Create your own space on HuggingFace
3. **Cache results:** Store generated videos
4. **Use queue system:** For high traffic
5. **Upgrade to paid tier:** Faster inference

## 🚀 Deployment

### Environment Variables

When deploying, set these environment variables:

```env
HF_TOKEN=your_production_token
PORT=3001
NODE_ENV=production
CLIENT_URL=https://your-frontend-domain.com
```

### Platforms

- **Heroku:** `Procfile` with `web: node server.js`
- **Railway:** Automatically detects `package.json`
- **Render:** Use `npm start` as start command
- **Vercel:** Use serverless functions
- **AWS/DigitalOcean:** Standard Node.js deployment

## 📝 License

MIT License - Piyush Paul (piyushpaul108@gmail.com)

## 🤝 Support

For issues or questions:
1. Check troubleshooting section
2. Review Hugging Face docs: https://huggingface.co/docs
3. Test with simple prompts first
4. Check server logs for errors

---

**Made with ❤️ by Piyush Paul**
