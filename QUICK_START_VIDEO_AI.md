# 🎬 Quick Start: AI Video Generation

## 🚀 How to Access

### Option 1: Direct URL
```
http://localhost:8080/video-editing
```

### Option 2: From AI Dashboard
1. Go to `http://localhost:8080/ai`
2. Click "AI Video Editing" service card
3. Click "Start Video Editing"

## 🎯 How to Generate a Video

### Step 1: API Key (Already Configured!)
✅ Your HuggingFace API key is already set up and ready to use!

The green "Connected" indicator shows you're ready to go.

### Step 2: Enter Your Video Description
Click in the text area and describe your video. Examples:

**Simple:**
```
A sunset over the ocean with waves crashing
```

**Detailed:**
```
A futuristic cityscape at night, neon lights reflecting on wet streets, 
flying cars in the sky, cinematic camera slowly panning across the scene
```

**Creative:**
```
A magical forest with glowing mushrooms, fireflies dancing in the air, 
misty atmosphere, mystical and ethereal mood
```

### Step 3: Generate!
1. Click the **"Generate Video"** button
2. Watch the AI processing animation
3. Wait 1-3 minutes (coffee break time! ☕)
4. Download your video when complete

## 💡 Pro Tips

### Best Practices
✅ **DO:**
- Describe visual elements clearly
- Mention lighting and atmosphere
- Specify camera movements
- Keep it under 30 words for best results
- Be patient on first generation (model warm-up)

❌ **DON'T:**
- Don't expect audio (videos are silent)
- Don't use overly complex descriptions
- Don't include text overlays in description
- Don't expect specific durations

### Example Prompts

**Nature:**
```
Mountain landscape with snow peaks, clear blue sky, eagle soaring
```

**Urban:**
```
Busy city street at rush hour, people walking, cars passing, golden hour lighting
```

**Fantasy:**
```
Dragon flying through clouds, epic scale, cinematic movement
```

**Abstract:**
```
Colorful particles flowing and swirling, smooth motion, dreamlike
```

## 🔧 Troubleshooting

### "Model is loading" Error
**Solution:** Wait 60-120 seconds, then try again. The model needs to warm up on first use.

### "Invalid API key" Error
**Solution:** 
1. Click "Change Key"
2. Re-enter: `your_huggingface_token_here`
3. Try again

### Video not downloading
**Solution:**
1. Check if video preview appears
2. Right-click video and select "Save as..."
3. Or click Download button again

### Slow Generation
**Solution:**
- First generation is slow (model loading)
- Subsequent generations are faster
- Free tier = shared resources
- Peak times may be slower

## 🎨 Color Scheme Reference

The interface now uses your website's theme:
- **Background:** Black with red accents
- **Primary:** Red (#ef4444)
- **Borders:** Red with transparency
- **Text:** White/Gray on dark background
- **Animations:** Red-themed particles and gradients

## 📊 What to Expect

### Video Specifications
- **Format:** MP4
- **Audio:** Silent (no audio track)
- **Resolution:** Model-dependent (typically 256x256 or 512x512)
- **Duration:** ~3-5 seconds (model limitation)
- **Quality:** AI-generated, experimental

### Processing Time
- **First request:** 2-3 minutes (model warm-up)
- **Subsequent requests:** 1-2 minutes
- **Progress bar:** Shows approximate progress

## 🌟 Advanced Usage

### Change API Key
1. Click "Change Key" button
2. Enter new HuggingFace token
3. Key saves automatically in browser

### Reset & Create New
1. After download, click "Create New Video"
2. Enter new description
3. Generate again!

### Download Multiple Times
You can download the same video multiple times - just click Download again!

## 📞 Need Help?

### Resources
- **HuggingFace Docs:** https://huggingface.co/docs/api-inference
- **Model Page:** https://huggingface.co/damo-vilab/text-to-video-ms-1.7b
- **Get API Key:** https://huggingface.co/settings/tokens

### Common Questions

**Q: Why is the video silent?**
A: The AI model generates visuals only. Audio can be added separately.

**Q: Can I make longer videos?**
A: Current model limitation is 3-5 seconds. For longer videos, generate multiple clips.

**Q: Why is quality low?**
A: Free tier uses smaller models. Quality improves with paid APIs.

**Q: Can I edit the generated video?**
A: Download and use video editing software for post-processing.

---

**🎉 You're All Set!**

Navigate to http://localhost:8080/video-editing and start creating!

**Your API Token:** `your_huggingface_token_here`

Happy Creating! 🚀
