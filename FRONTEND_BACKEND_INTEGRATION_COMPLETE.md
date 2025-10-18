# ✅ Frontend-Backend Integration Guide

## 🎯 **What We're Doing**

Integrating the Express backend (port 3001) with the React frontend (port 8080) so that:
1. Frontend calls backend API instead of HuggingFace directly
2. Backend handles all API tokens securely
3. Video results display in the frontend UI
4. No more "model not found" errors (backend handles fallback)

---

## 🔧 **Changes Made to VideoEditingInterface.tsx**

### **1. Removed Direct HuggingFace Calls**

**Before:**
```typescript
// Frontend called HuggingFace directly
const response = await fetch('https://api-inference.huggingface.co/models/...', {
  headers: { 'Authorization': `Bearer ${apiKey}` }
});
```

**After:**
```typescript
// Frontend calls our backend
const response = await fetch('http://localhost:3001/api/video/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ prompt })
});
```

### **2. New Backend API Function**

```typescript
const callBackendAPI = async (prompt: string): Promise<boolean> => {
  setIsApiLoading(true);
  
  try {
    toast({
      title: "Connecting to Backend",
      description: "Sending request to video generation server...",
    });

    const BACKEND_URL = 'http://localhost:3001';
    
    const response = await fetch(`${BACKEND_URL}/api/video/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Server error: ${response.status}`);
    }

    const videoBlob = await response.blob();
    const videoUrl = URL.createObjectURL(videoBlob);
    setGeneratedVideoUrl(videoUrl);
    
    toast({
      title: "Video Generated!",
      description: "Your AI video is ready!",
    });

    setIsApiLoading(false);
    return true;

  } catch (error) {
    console.error('Backend API Error:', error);
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      toast({
        title: "Backend Not Running",
        description: "Please start: cd server && npm start",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    }
    
    return false;
  }
};
```

### **3. Removed API Key Input UI**

**Removed:**
- API key input field
- API key storage/validation
- HuggingFace token management

**Added:**
- Backend connection status indicator
- Server URL display

### **4. Simplified startProcessing()**

```typescript
const startProcessing = async () => {
  if (!aiPrompt.trim()) {
    toast({ title: "No Prompt", description: "Enter a description" });
    return;
  }
  
  setGeneratedVideoUrl(null);
  const apiSuccess = await callBackendAPI(aiPrompt);
  
  if (apiSuccess) {
    setIsProcessing(true);
    setCompleted(false);
  }
};
```

---

## 📊 **How It Works Now**

```
┌─────────────────────────────────────────┐
│  User enters prompt in UI               │
│  http://localhost:8080/video-editing    │
└──────────────┬──────────────────────────┘
               │
               │ HTTP POST
               │ { "prompt": "..." }
               ▼
┌─────────────────────────────────────────┐
│  Express Backend                        │
│  http://localhost:3001/api/video/generate│
│                                         │
│  - Receives prompt                      │
│  - Uses HF token (from .env)           │
│  - Tries 3 models automatically        │
│  - Returns MP4 video buffer            │
└──────────────┬──────────────────────────┘
               │
               │ MP4 Video Binary
               ▼
┌─────────────────────────────────────────┐
│  Frontend displays video                │
│  - Creates blob URL                     │
│  - Shows in <video> element            │
│  - Download button enabled             │
└─────────────────────────────────────────┘
```

---

## 🚀 **Running the Complete System**

### **Terminal 1: Frontend**
```powershell
cd c:\Users\Administrator\Documents\GitHub\Dizitup.-ai-final-project
npm run dev
```
**Runs on:** http://localhost:8080

### **Terminal 2: Backend**
```powershell
cd c:\Users\Administrator\Documents\GitHub\Dizitup.-ai-final-project\server
npm start
```
**Runs on:** http://localhost:3001

---

## 🧪 **Testing**

### **1. Check Backend is Running**
```powershell
Invoke-WebRequest -Uri "http://localhost:3001/health"
```

**Expected Response:**
```json
{
  "status": "healthy",
  "message": "Video generation API is running"
}
```

### **2. Test Frontend Connection**

1. Open: http://localhost:8080/video-editing
2. You should see: "Backend Server Connected ●"
3. Enter prompt: "a sunset over the ocean"
4. Click "Generate Video"
5. Wait 1-3 minutes
6. Video appears in preview area

### **3. Test Direct API Call**
```powershell
Invoke-WebRequest -Uri "http://localhost:3001/api/video/generate" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{"prompt":"test"}' `
  -OutFile "test-video.mp4"
```

---

## ✅ **Benefits of This Architecture**

### **Security**
- ✅ API token never exposed to browser
- ✅ Token stored server-side in `.env`
- ✅ Frontend can't leak credentials

### **Reliability**
- ✅ Backend tries 3 models automatically
- ✅ Better error handling
- ✅ Centralized retry logic
- ✅ Server-side logging

### **Performance**
- ✅ Backend can cache results
- ✅ Can implement queue system
- ✅ Rate limiting protection
- ✅ Better timeout handling

### **Developer Experience**
- ✅ Cleaner frontend code
- ✅ Easier to test
- ✅ Better error messages
- ✅ Centralized configuration

---

## 🐛 **Troubleshooting**

### **Error: "Backend Not Running"**

**Problem:** Frontend can't connect to backend

**Solution:**
```powershell
# Start backend
cd server
npm start

# Verify it's running
curl http://localhost:3001/health
```

---

### **Error: "Model not found" or "503"**

**Problem:** HuggingFace models are loading

**Solution:**
- Backend automatically tries 3 models
- Wait 60-120 seconds
- Retry same prompt
- Check backend logs for details

---

### **Error: "CORS"**

**Problem:** Cross-origin request blocked

**Solution:**
- Backend already configured for `http://localhost:8080`
- Check `server/server.js` CORS settings
- Restart backend after changes

---

### **Video Not Displaying**

**Problem:** Video generated but not showing

**Checklist:**
1. Check browser console (F12) for errors
2. Verify `generatedVideoUrl` is set (React DevTools)
3. Check network tab for 200 response
4. Verify video blob size > 0

---

## 📝 **Configuration**

### **Backend (.env)**
```env
HF_TOKEN=your_huggingface_token_here
PORT=3001
CLIENT_URL=http://localhost:8080
```

### **Frontend (hardcoded)**
```typescript
const BACKEND_URL = 'http://localhost:3001';
```

**For production:**
```typescript
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
```

Add to `.env`:
```env
VITE_BACKEND_URL=https://your-backend.railway.app
```

---

## 🎯 **Next Steps**

### **Immediate**
- [x] Backend running on 3001
- [x] Frontend running on 8080
- [x] Integration code written
- [ ] Test video generation end-to-end

### **Optional Enhancements**
- [ ] Add environment variable for backend URL
- [ ] Implement request queue
- [ ] Add video caching
- [ ] Progress indicators
- [ ] Upload history/gallery

---

## 📞 **Quick Reference**

### **URLs**
- Frontend: http://localhost:8080
- Video UI: http://localhost:8080/video-editing
- Backend: http://localhost:3001
- Health: http://localhost:3001/health
- API: http://localhost:3001/api/video/generate

### **Commands**
```powershell
# Start frontend
npm run dev

# Start backend
cd server && npm start

# Test backend
curl http://localhost:3001/health

# Stop servers
Ctrl + C (in each terminal)
```

---

**Status:** ✅ Integration Complete (Code Ready)  
**Next:** Test the full flow from UI to backend to video display  
**Created:** 2025-10-18  
**Author:** Piyush Paul (piyushpaul108@gmail.com)
