# GitHub Collaboration Guide

This guide will help you share your project with your teammate using GitHub.

## Repository Information

Your project is now hosted at: https://github.com/YOUR_USERNAME/dizitup-project

## How to Share with Your Teammate

### For Your Teammate to Access the Project:

1. **Prerequisites**:
   - Install Git: https://git-scm.com/
   - Install Node.js: https://nodejs.org/
   - Install Qoder IDE (optional but recommended)

2. **Clone the Repository**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/dizitup-project.git
   ```

3. **Install Dependencies**:
   ```bash
   cd dizitup-project
   npm install
   ```

4. **Open in Qoder IDE**:
   - Open Qoder IDE
   - Select "File" > "Open Folder"
   - Choose the cloned project folder

5. **Start Development Server**:
   ```bash
   npm run dev
   ```

### For Your Teammate to Make Changes:

1. **Before Starting Work**:
   ```bash
   git pull origin main
   ```

2. **Create a Feature Branch**:
   ```bash
   git checkout -b feature-name
   ```

3. **Make Changes in Qoder IDE**

4. **Commit Changes**:
   ```bash
   git add .
   git commit -m "Description of changes"
   ```

5. **Push Changes to GitHub**:
   ```bash
   git push origin feature-name
   ```

6. **Create Pull Request**:
   - Go to https://github.com/YOUR_USERNAME/dizitup-project
   - Click "Pull requests" tab
   - Click "New pull request"
   - Select your branch and create the pull request

### For You to Receive Changes from Your Teammate:

1. **Review Pull Requests**:
   - Go to https://github.com/YOUR_USERNAME/dizitup-project/pulls
   - Review and merge pull requests

2. **Pull Changes to Your Local Repository**:
   ```bash
   git checkout main
   git pull origin main
   ```

## Alternative: Direct Collaboration

If your teammate doesn't have a GitHub account:

1. **Add Them as a Collaborator**:
   - Go to your repository on GitHub
   - Click "Settings" tab
   - Click "Collaborators & teams" in the left sidebar
   - Click "Add people"
   - Enter your teammate's GitHub username or email
   - Select appropriate permissions (typically "Write" is sufficient)

2. **Your Teammate Can Then**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/dizitup-project.git
   # Make changes
   git add .
   git commit -m "Description of changes"
   git push origin main
   ```

## Troubleshooting

### If Your Teammate Gets Permission Errors:
- Make sure they've been added as a collaborator (if using direct collaboration)
- Verify the repository URL is correct
- Check that they're using the correct credentials

### If Git Commands Don't Work:
- Make sure Git is installed properly
- Verify internet connection
- Try using HTTPS instead of SSH (which is what we're using)

### If Qoder IDE Has Issues:
- Restart Qoder IDE
- Make sure all dependencies are installed (`npm install`)
- Check that the project folder is opened correctly