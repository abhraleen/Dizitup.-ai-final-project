# 🚀 Quick Start Guide - Video Backend API

## Get Started in 3 Steps

### Step 1: Install Dependencies

```bash
cd server
npm install
```

### Step 2: Start Server

```bash
npm start
```

You should see:
```
✅ Video generation server running
🚀 Server: http://localhost:3001
🎬 Video API: http://localhost:3001/api/video/generate
💚 Health Check: http://localhost:3001/health
```

### Step 3: Test It!

Open a new terminal and run:

```bash
curl -X POST http://localhost:3001/api/video/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "a beautiful sunset over the ocean"}' \
  -o test-video.mp4
```

**Wait 1-3 minutes** for the video to generate, then check `test-video.mp4`!

---

## 📝 Test with JavaScript

Create a file `test-frontend.html`:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Video Generation Test</title>
</head>
<body>
  <h1>AI Video Generator</h1>
  
  <input type="text" id="prompt" placeholder="Enter prompt" style="width: 400px; padding: 10px;">
  <button onclick="generateVideo()" style="padding: 10px 20px;">Generate Video</button>
  
  <div id="status"></div>
  <video id="video" controls style="display:none; margin-top: 20px; max-width: 512px;"></video>

  <script>
    async function generateVideo() {
      const prompt = document.getElementById('prompt').value;
      const status = document.getElementById('status');
      const video = document.getElementById('video');

      status.textContent = 'Generating video... (this may take 1-3 minutes)';
      video.style.display = 'none';

      try {
        const response = await fetch('http://localhost:3001/api/video/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt })
        });

        if (response.ok) {
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          
          video.src = url;
          video.style.display = 'block';
          status.textContent = '✅ Video generated successfully!';
        } else {
          const error = await response.json();
          status.textContent = `❌ Error: ${error.error}`;
        }
      } catch (err) {
        status.textContent = `❌ Error: ${err.message}`;
      }
    }
  </script>
</body>
</html>
```

Open `test-frontend.html` in your browser and test!

---

## 🔧 Common Commands

```bash
# Install dependencies
npm install

# Start production server
npm start

# Start development server (auto-reload)
npm run dev

# Run tests
npm test

# Check if server is running
curl http://localhost:3001/health
```

---

## ⚙️ Configuration

Your API token is already configured in `.env`:

```env
HF_TOKEN=your_huggingface_token_here
PORT=3001
CLIENT_URL=http://localhost:8080
```

---

## 📚 API Reference

### Generate Video

**Endpoint:** `POST /api/video/generate`

**Request:**
```json
{
  "prompt": "Your video description here"
}
```

**Response:** MP4 video file (binary)

**Example Prompts:**
- "a sunset over the ocean"
- "a person walking in the rain"
- "clouds moving in the sky"
- "a waterfall in nature"

---

## ⚠️ Troubleshooting

### "Model not found" or "Model loading"

**Solution:** Wait 1-2 minutes and try again. Free tier models sleep when idle.

```
💡 The model might be in sleep mode. Try again after 1–2 minutes 
   or duplicate the model space on Hugging Face.
```

### "Port already in use"

**Solution:** Change port in `.env`:
```env
PORT=3002
```

### Dependencies not found

**Solution:**
```bash
cd server
npm install
```

---

## 🎯 Next Steps

1. ✅ Test the API with simple prompts
2. ✅ Integrate with your frontend (React component)
3. ✅ Add to your project's video editing interface
4. ✅ Implement error handling in UI
5. ✅ Add loading states and progress indicators

---

**Ready to integrate?** Check the [full README](README.md) for detailed documentation!

**Need help?** The server logs will show detailed error messages.

---

**Made with ❤️ by Piyush Paul**
