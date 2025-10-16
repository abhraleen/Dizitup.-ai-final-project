# Qoder IDE Guide for Dizitup Project

This guide will help you and your teammate use Qoder IDE effectively for collaborating on the Dizitup project.

## Getting Started with Qoder

1. Download and install Qoder IDE from the official website
2. Open Qoder IDE
3. Open the project folder by selecting "File" > "Open Folder" and navigating to the cloned repository

## Key Features in Qoder for this Project

### File Navigation
- Use the file explorer on the left to navigate through the project structure
- Double-click any file to open it in the editor
- Use `Ctrl+P` (or `Cmd+P` on Mac) to quickly search for files

### Code Editing
- Qoder provides syntax highlighting for TypeScript, JavaScript, and JSX files
- Use `Ctrl+/` to comment/uncomment selected lines
- Use `Ctrl+D` to select the next occurrence of the currently selected word
- Use `Alt+Shift+Arrow` to select blocks of code

### Integrated Terminal
- Access the integrated terminal through the "Terminal" menu or with `Ctrl+`` ` (backtick)
- Run all project commands directly within Qoder

### Git Integration
- Qoder has built-in Git support
- View changed files in the source control panel (usually on the left sidebar)
- Stage changes by clicking the `+` next to each file
- Commit changes by entering a message and clicking the checkmark
- Push/pull using the sync button in the status bar

## Working with React Components

This project uses React with TypeScript. Qoder provides excellent support for:

- IntelliSense for React and TypeScript
- Automatic imports when you start typing component names
- Error highlighting for TypeScript issues
- Component preview (if supported by your version of Qoder)

## Project-Specific Commands

In the integrated terminal, you can run:

- `npm run dev` - Start the development server
- `npm run build` - Build the project for production
- `npm run preview` - Preview the production build

## Collaboration Best Practices

1. Always pull the latest changes before starting work:
   ```
   git pull origin main
   ```

2. Work on separate feature branches:
   ```
   git checkout -b your-feature-name
   ```

3. Commit frequently with descriptive messages:
   ```
   git add .
   git commit -m "Add new feature: description of what was done"
   ```

4. Push your branch regularly:
   ```
   git push origin your-feature-name
   ```

5. Create pull requests on GitHub for code review before merging

## Troubleshooting

### If Qoder is slow:
- Close unnecessary files
- Restart Qoder IDE
- Check if there are too many files in the project (consider adding unnecessary folders to .gitignore)

### If TypeScript errors appear:
- Ensure all dependencies are installed with `npm install`
- Restart the TypeScript server with `Ctrl+Shift+P` and search for "TypeScript: Restart TS Server"

### If Git operations fail:
- Use the integrated terminal to run Git commands directly
- Ensure you have proper permissions for the repository