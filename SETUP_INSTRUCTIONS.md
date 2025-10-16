# Setup Instructions for Teammate

## Option 1: Using GitHub (Recommended)

1. Create a GitHub account if you don't have one
2. Create a new repository on GitHub:
   - Go to https://github.com/new
   - Name it "dizitup-project"
   - Keep it private if you prefer
   - Don't initialize with README
3. Share the repository URL with your teammate

## Option 2: Direct File Transfer

If you prefer to share the files directly:

1. Compress the entire project folder into a ZIP file
2. Send the ZIP file to your teammate
3. Your teammate should:
   - Extract the ZIP file
   - Open Qoder IDE
   - Select "File" > "Open Folder" and choose the extracted project folder
   - Install dependencies by running `npm install` in the terminal

## After Receiving the Project

Once your teammate has the project files:

1. Open Qoder IDE
2. Select "File" > "Open Folder" and navigate to the project folder
3. Open the integrated terminal in Qoder (Ctrl+`)
4. Install dependencies:
   ```
   npm install
   ```
5. Start the development server:
   ```
   npm run dev
   ```

## Making Changes and Sharing Back

When your teammate makes changes:

1. Open the integrated terminal in Qoder
2. Add changes to git:
   ```
   git add .
   ```
3. Commit changes:
   ```
   git commit -m "Description of changes"
   ```
4. If using GitHub, push changes:
   ```
   git push origin main
   ```
5. If sharing directly, compress the folder and send it back

## Installing Qoder IDE

If your teammate doesn't have Qoder IDE:

1. Go to the Qoder website
2. Download the appropriate version for their operating system
3. Install following the installation instructions