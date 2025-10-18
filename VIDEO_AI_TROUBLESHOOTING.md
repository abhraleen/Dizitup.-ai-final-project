# 🔧 AI Video Generation - Troubleshooting Guide

## ⚠️ Common Issue: "Model Not Found"

### What It Means
The HuggingFace text-to-video model is either:
1. **Loading** (needs warm-up on first use)
2. **Temporarily unavailable** (free tier has limited availability)
3. **Deprecated or moved** (model path changed)

### ✅ Solution - Updated Implementation

I've updated the code to **automatically try multiple models** in sequence:

#### Models Tried (in order):
1. `ali-vilab/text-to-video-ms-1.7b` (Primary)
2. `damo-vilab/text-to-video-ms-1.7b` (Backup)
3. `camenduru/text2video-zero` (Fallback)

If one model fails, the system automatically tries the next one!

## 🎯 What to Do Now

### Step 1: Refresh the Page
The new code is already live. Just refresh your browser at:
```
http://localhost:8080/video-editing
```

### Step 2: Try a Simple Prompt
Start with something basic to test:
```
a sunset over the ocean
```

### Step 3: Click "Generate Video"
The system will:
- Try the first model
- If it fails, automatically try the second model
- If that fails, try the third model
- Show you which model is being used in toast notifications

### Step 4: Be Patient
- **First attempt**: 2-5 minutes (model warm-up)
- **Subsequent attempts**: 1-3 minutes
- Watch the toast notifications to see progress

## 🔍 Understanding the Errors

### 404 Error: "Model Not Found"
**Meaning:** Model doesn't exist or path is wrong  
**Fix:** System automatically tries next model  
**Action:** Wait and let it try all models

### 503 Error: "Model is Loading"
**Meaning:** Model is warming up on HuggingFace servers  
**Fix:** System automatically tries next model  
**Action:** Wait 60-120 seconds, then try again

### 401 Error: "Invalid API Key"
**Meaning:** Your API token is invalid or expired  
**Fix:** Get a new token from https://huggingface.co/settings/tokens  
**Action:** Click "Change Key" and enter new token

### 429 Error: "Rate Limit Exceeded"
**Meaning:** Too many requests to HuggingFace API  
**Fix:** System automatically tries next model  
**Action:** Wait 2-3 minutes before retrying

### Empty Response
**Meaning:** Model returned no data  
**Fix:** System automatically tries next model  
**Action:** Let system try alternatives

## 🚀 Current Status

### What Changed (Just Now)
✅ Added automatic model fallback (3 models)  
✅ Improved error handling  
✅ Added `wait_for_model: true` option  
✅ Better toast notifications showing which model is being used  
✅ Clearer error messages

### How It Works
```
User clicks "Generate Video"
    ↓
Try Model 1: ali-vilab/text-to-video-ms-1.7b
    ↓ (if fails)
Try Model 2: damo-vilab/text-to-video-ms-1.7b
    ↓ (if fails)
Try Model 3: camenduru/text2video-zero
    ↓ (if all fail)
Show error: "All models unavailable, try again in a few minutes"
```

## 🎨 Alternative: Use Graphics Design Instead

### If Video Generation Keeps Failing
Text-to-video models are **experimental** and often unstable on free tier.

**Better Alternative:**
1. Go to **Graphics Design** section
2. Generate AI images (much more stable)
3. Use image-to-video tools later

**Graphics Design Route:**
- Navigate to: `http://localhost:8080/graphics-design`
- Uses stable-diffusion (very reliable)
- Generate high-quality images
- Convert to slideshows/videos separately

## 📊 Expected Behavior

### Success Scenario
```
🔄 Trying Model: ali-vilab/text-to-video-ms-1.7b...
✅ Video Generated! Your AI-generated video is ready using ali-vilab/text-to-video-ms-1.7b!
```

### Partial Failure (Automatic Recovery)
```
🔄 Trying Model: ali-vilab/text-to-video-ms-1.7b...
❌ Model ali-vilab/text-to-video-ms-1.7b not found. Trying next model...
🔄 Trying Model: damo-vilab/text-to-video-ms-1.7b...
✅ Video Generated! Your AI-generated video is ready using damo-vilab/text-to-video-ms-1.7b!
```

### Complete Failure
```
🔄 Trying Model: ali-vilab/text-to-video-ms-1.7b...
❌ Model ali-vilab/text-to-video-ms-1.7b not found. Trying next model...
🔄 Trying Model: damo-vilab/text-to-video-ms-1.7b...
❌ Model is loading. Trying next model...
🔄 Trying Model: camenduru/text2video-zero...
❌ Rate limit exceeded.
❌ Video Generation Failed: All video generation models are currently unavailable. Please try again in a few minutes.
```

## 🛠️ Manual Fixes

### Fix 1: Check API Key
1. Click "Change Key" button
2. Verify your token: `your_huggingface_token_here`
3. Or get new one: https://huggingface.co/settings/tokens

### Fix 2: Test API Key in Browser
Open browser console (F12) and run:
```javascript
fetch('https://api-inference.huggingface.co/models/ali-vilab/text-to-video-ms-1.7b', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer your_huggingface_token_here',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    inputs: 'a sunset',
    options: { wait_for_model: true }
  })
}).then(r => console.log(r.status))
```

**Expected:** 200 or 503  
**If 401:** API key invalid  
**If 404:** Model not found

### Fix 3: Wait for Model Warm-up
Free tier models sleep when not in use. First request wakes them up:
1. Try generation
2. Wait 2-3 minutes
3. Try again with same prompt

### Fix 4: Use Simpler Prompts
Complex prompts may fail. Try:
- ❌ "A futuristic cityscape at sunset with flying cars, neon lights..."
- ✅ "a sunset over the ocean"

## 📞 Still Not Working?

### Diagnostic Checklist
- [ ] Refreshed page after update?
- [ ] Tried simple prompt ("a sunset")?
- [ ] Waited 2-3 minutes between attempts?
- [ ] Checked browser console for errors (F12)?
- [ ] API key is valid and not expired?
- [ ] Internet connection working?

### Last Resort Options

#### Option A: Try Different Time
Free tier availability varies by time:
- **Best:** Late night / Early morning (less traffic)
- **Worst:** Peak hours (10 AM - 8 PM)

#### Option B: Switch to Graphics Design
```
http://localhost:8080/graphics-design
```
Much more stable for AI generation!

#### Option C: Wait for Paid Tier
Free tier = No guarantees. Consider:
- Replicate.com (pay-per-use)
- Stability.ai (subscription)
- RunwayML (credits system)

## 🎓 Understanding Free Tier Limitations

### HuggingFace Free Tier
- ✅ Completely free
- ✅ No credit card needed
- ❌ Models may be unavailable
- ❌ Slow response times
- ❌ Rate limiting
- ❌ No uptime guarantee

### Why Video Models Fail More
- Larger models (need more resources)
- Less popular (sleep more often)
- Experimental (may be deprecated)
- Resource-intensive (prioritized less)

### Why Image Models Work Better
- Smaller, faster
- Very popular (always awake)
- Stable, production-ready
- Well-supported

## 📝 Summary

### What You Should See Now
1. Navigate to `http://localhost:8080/video-editing`
2. Enter prompt: "a sunset over the ocean"
3. Click "Generate Video"
4. See toast: "Trying Model: ali-vilab..."
5. Either:
   - ✅ Success with first model
   - 🔄 Auto-retry with second model
   - 🔄 Auto-retry with third model
   - ❌ All fail = wait 3 minutes and retry

### Next Steps
1. **Test now** with simple prompt
2. **Watch toast notifications** to see which model succeeds
3. **Be patient** (2-5 minutes first time)
4. **If fails**, wait 3 minutes and retry
5. **If keeps failing**, use Graphics Design instead

---

**Updated:** 2025-10-18  
**Status:** ✅ Code Updated - Multi-Model Fallback Active  
**Your API Key:** `your_huggingface_token_here`

🎉 **Try it now!** http://localhost:8080/video-editing
