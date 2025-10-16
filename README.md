# Dizitup Project

This is the official repository for the Dizitup project.

## Prerequisites

- Node.js (version 16 or higher)
- Git
- Qoder IDE (optional but recommended)

## Setup Instructions

1. Clone the repository:
   ```
   git clone https://github.com/YOUR_USERNAME/dizitup-project.git
   ```

2. Navigate to the project directory:
   ```
   cd dizitup-project
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Start the development server:
   ```
   npm run dev
   ```

## Collaboration Workflow

1. Before starting work, always pull the latest changes:
   ```
   git pull origin main
   ```

2. Create a new branch for your feature or bug fix:
   ```
   git checkout -b feature-name
   ```

3. Make your changes in Qoder IDE

4. Commit your changes:
   ```
   git add .
   git commit -m "Description of changes"
   ```

5. Push your branch to GitHub:
   ```
   git push origin feature-name
   ```

6. Create a pull request on GitHub to merge your changes into the main branch

7. After the pull request is merged, both team members should pull the latest changes:
   ```
   git checkout main
   git pull origin main
   ```

## Project Structure

- `src/` - Main source code
- `src/components/` - React components
- `src/pages/` - Page components
- `src/integrations/supabase/` - Supabase integration
- `public/` - Static assets

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build