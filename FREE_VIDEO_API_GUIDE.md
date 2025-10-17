# Free Video Generation & Editing APIs Guide

## 🎬 Your Current Setup

**Runway ML API Key (Already Configured)**
```
key_0a59a2c74a1d2eeb4e96900b0f86656c26fa77190730db507a7cb32ee6f0a22844a7fbe4d43462fe2d70ac43e5afbcae63a17ba397106ee319f7287eb93f3f0d
```
- Stored in: `localStorage` (key: `dizitup_runway_api_key`)
- Auto-loaded on app start
- Can be changed via UI

---

## 🆓 Free Tier Video API Alternatives

### 1. **Replicate** (Recommended - Pay per use with free credits)
- **Website**: https://replicate.com/
- **Free Tier**: $5 free credits on signup
- **Models Available**:
  - Stable Video Diffusion: Text/Image to Video
  - AnimateDiff: Animation generation
  - Zeroscope: Text to video
  
**How to Use**:
```javascript
// Sign up at replicate.com
// Get API token from: https://replicate.com/account/api-tokens

const response = await fetch('https://api.replicate.com/v1/predictions', {
  method: 'POST',
  headers: {
    'Authorization': `Token YOUR_API_TOKEN`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    version: "stable-video-diffusion-model-id",
    input: {
      prompt: "Your video description"
    }
  })
});
```

---

### 2. **HuggingFace Inference API** (100% Free)
- **Website**: https://huggingface.co/
- **Free Tier**: Completely FREE with rate limits
- **Models Available**:
  - Text-to-Video models
  - Video-to-Video processing
  - Frame interpolation

**How to Use**:
```javascript
// Sign up at huggingface.co
// Get token from: https://huggingface.co/settings/tokens

const response = await fetch(
  'https://api-inference.huggingface.co/models/damo-vilab/text-to-video-ms-1.7b',
  {
    headers: { 
      'Authorization': `Bearer YOUR_HF_TOKEN`,
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({ inputs: "Your prompt here" }),
  }
);
```

**Popular Free Models**:
- `damo-vilab/text-to-video-ms-1.7b` - Text to video
- `stabilityai/stable-video-diffusion` - Video generation
- `facebook/animatediff` - Animation

---

### 3. **D-ID** (Free Credits Monthly)
- **Website**: https://www.d-id.com/
- **Free Tier**: 20 free credits per month
- **Best For**: Talking head videos, avatar generation
- **API Docs**: https://docs.d-id.com/

**How to Use**:
```javascript
// Sign up at d-id.com
// Get API key from dashboard

const response = await fetch('https://api.d-id.com/talks', {
  method: 'POST',
  headers: {
    'Authorization': `Basic YOUR_API_KEY`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    script: {
      type: "text",
      input: "Your script here"
    },
    source_url: "avatar_image_url"
  })
});
```

---

### 4. **Genmo (Mochi-1)** (Free Beta)
- **Website**: https://www.genmo.ai/
- **Free Tier**: Free during beta period
- **Best For**: Text to video, image animation
- **Model**: Mochi-1 (Open source)

**How to Use**:
```javascript
// Sign up at genmo.ai
// Use web interface or wait for API access

// Currently web-based, API coming soon
// Alternative: Use Mochi-1 directly via Replicate
```

---

### 5. **Stability AI** (Free Tier Available)
- **Website**: https://platform.stability.ai/
- **Free Tier**: 25 free credits on signup
- **Models**: Stable Video Diffusion
- **API Docs**: https://platform.stability.ai/docs

**How to Use**:
```javascript
// Sign up at stability.ai
// Get API key from platform

const formData = new FormData();
formData.append('image', imageFile);
formData.append('cfg_scale', '1.8');
formData.append('motion_bucket_id', '127');

const response = await fetch(
  'https://api.stability.ai/v2beta/image-to-video',
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer YOUR_API_KEY`,
    },
    body: formData,
  }
);
```

---

## 🔧 Implementation in Your App

### Current Implementation (Runway ML)

The app is already configured to use Runway ML API. The key is:
1. Stored in localStorage
2. Auto-loaded on app start
3. Can be changed via the UI

### To Switch to Another Provider:

1. **Update the API endpoint** in `VideoEditingInterface.tsx`:
```javascript
const FREE_API_SERVICES = {
  // Change to your preferred service
  huggingface: {
    name: "HuggingFace",
    key: "YOUR_HF_TOKEN",
    endpoint: "https://api-inference.huggingface.co",
    description: "Free video generation"
  }
};
```

2. **Update the API call function**:
```javascript
const callVideoAPI = async (prompt: string, videoFile?: File) => {
  // Implement your chosen API's request format
  const response = await fetch('YOUR_API_ENDPOINT', {
    // Your API configuration
  });
};
```

---

## 💡 Recommendations

### For $0 Budget:

1. **Start with HuggingFace** (100% free, no credit card needed)
2. **Use Replicate's free credits** ($5 free on signup)
3. **Try Genmo** while it's in free beta

### Best Quality (Free Tier):

1. **Replicate + Stable Video Diffusion** - Best quality, uses free credits
2. **Stability AI** - Professional quality, 25 free credits
3. **D-ID** - Best for talking head videos, 20 free videos/month

### For Production (When Budget Allows):

1. **Runway ML** - Most features, best results
2. **Stability AI** - Great balance of cost/quality
3. **Replicate** - Pay only for what you use

---

## 📝 Quick Setup Guide

### Option 1: Keep Runway ML (Already Configured)
✅ Already done! Your key is saved and ready to use.

### Option 2: Switch to HuggingFace (100% Free)
1. Go to https://huggingface.co/join
2. Create account (free)
3. Get token: https://huggingface.co/settings/tokens
4. Paste in the app's API key field
5. Update code to use HuggingFace endpoint

### Option 3: Use Replicate (Free Credits)
1. Go to https://replicate.com/
2. Sign up with GitHub (free)
3. Get $5 free credits
4. API token: https://replicate.com/account/api-tokens
5. Use in the app

---

## 🔒 Security Note

All API keys are stored in **localStorage** only. They are:
- ✅ Never sent to your servers
- ✅ Stored locally in the browser
- ✅ Can be cleared anytime
- ✅ Only used for API calls to video services

**For production**, you should:
1. Move API keys to backend
2. Use environment variables
3. Implement proper authentication
4. Add rate limiting

---

## 📚 Additional Resources

- **Runway ML Docs**: https://docs.runwayml.com/
- **Replicate Docs**: https://replicate.com/docs
- **HuggingFace Docs**: https://huggingface.co/docs/api-inference/
- **Stability AI Docs**: https://platform.stability.ai/docs
- **D-ID Docs**: https://docs.d-id.com/

---

## 🆘 Troubleshooting

### "API Key Required" Error
- Check if key is entered in the UI
- Verify localStorage has the key
- Try copying the key fresh from the provider

### "API Call Failed" Error
- Check API key is valid
- Verify you have credits/free tier available
- Check network connection
- Review API provider's status page

### No Video Generated
- Check prompt is clear and specific
- Try a simpler prompt first
- Verify file format (for uploads)
- Check API provider's model limits

---

## 🎯 Your Next Steps

1. ✅ **Current Setup**: Runway ML key is configured
2. 🔄 **If it doesn't work**: Try HuggingFace (100% free)
3. 💾 **Later**: Move to database when you have backend
4. 🚀 **Production**: Implement proper API key management

---

**Need Help?** Check the API provider's documentation or status page for current limitations and troubleshooting.
