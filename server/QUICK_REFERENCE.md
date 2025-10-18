# 📋 Quick Reference Card - Video Backend API

## 🚀 Start Server

```bash
cd server
npm start
```

**Output:**
```
✅ Video generation server running
🚀 Server: http://localhost:3001
🎬 Video API: http://localhost:3001/api/video/generate
💚 Health Check: http://localhost:3001/health
```

---

## 🔌 API Endpoint

### Generate Video

**POST** `http://localhost:3001/api/video/generate`

**Request:**
```json
{
  "prompt": "a beautiful sunset over the ocean"
}
```

**Response:** MP4 video file (binary)

---

## 💻 Test Commands

### cURL Test

```bash
curl -X POST http://localhost:3001/api/video/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "a sunset over the ocean"}' \
  -o video.mp4
```

### Health Check

```bash
curl http://localhost:3001/health
```

### JavaScript Test

```javascript
const response = await fetch('http://localhost:3001/api/video/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ prompt: 'test' })
});

const blob = await response.blob();
const url = URL.createObjectURL(blob);
```

---

## ⚙️ Configuration

### .env File

```env
HF_TOKEN=your_huggingface_token_here
PORT=3001
NODE_ENV=development
CLIENT_URL=http://localhost:8080
```

---

## 🐛 Common Errors

| Error | Status | Solution |
|-------|--------|----------|
| Model not found | 404 | Wait 1-2 min, retry |
| Model loading | 503 | Wait 60-120s, retry |
| Invalid token | 401 | Check HF_TOKEN |
| Rate limited | 429 | Wait 3 min |
| Bad request | 400 | Check prompt format |

---

## 📂 Project Structure

```
server/
├── server.js              # Main server
├── controllers/
│   └── videoController.js # Generation logic
├── routes/
│   └── videoRoutes.js     # API routes
└── .env                   # Config (DO NOT COMMIT)
```

---

## 🎯 Video Parameters

```javascript
num_frames: 24           // 24 frames
fps: 12                  // 12 FPS
resolution: "512x512"    // 512x512 resolution
motion_bucket_id: 127    // More motion
noise_aug_strength: 0.02 // More stable
```

---

## 📊 Expected Response

### Success (200)

**Headers:**
```
Content-Type: video/mp4
Content-Disposition: attachment; filename="generated-video-1234567890.mp4"
X-Generation-Time: 12.34s
X-Video-Size: 2.5MB
```

**Body:** Binary MP4 video

### Error (4xx/5xx)

```json
{
  "success": false,
  "error": "Error message here",
  "suggestion": "Try again in 1-2 minutes..."
}
```

---

## 🔗 URLs

- **Server:** http://localhost:3001
- **API:** http://localhost:3001/api/video/generate
- **Health:** http://localhost:3001/health
- **Frontend:** http://localhost:8080

---

## 📝 npm Commands

```bash
npm install    # Install dependencies
npm start      # Start server
npm run dev    # Start with auto-reload (nodemon)
npm test       # Run tests
```

---

## 🎓 Integration Example

```typescript
// React Component
const generateVideo = async (prompt: string) => {
  try {
    const res = await fetch('http://localhost:3001/api/video/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error);
    }
    
    const blob = await res.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Failed:', error);
    throw error;
  }
};
```

---

## 🚨 Model Sleep Mode

**Message:**
```
💡 The model might be in sleep mode. Try again after 1–2 minutes 
   or duplicate the model space on Hugging Face.
```

**Actions:**
1. Wait 60-120 seconds
2. Retry same request
3. First request after sleep takes longer

---

## 📚 Documentation

- **Full Docs:** `server/README.md`
- **Quick Start:** `server/QUICKSTART.md`
- **Integration:** `server/FRONTEND_INTEGRATION.md`
- **Summary:** `BACKEND_API_COMPLETE.md`

---

**Author:** Piyush Paul (piyushpaul108@gmail.com)  
**Tech:** Node.js 18+, Express, Hugging Face API  
**Model:** stabilityai/stable-video-diffusion-img2vid-xt
