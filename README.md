# WhyN0t101.github.io

Personal portfolio website showcasing projects, education, and resources in Computer Engineering and Cybersecurity.

**Live:** [whyn0t101.github.io](https://whyn0t101.github.io)

## Tech Stack

- **React 18** + TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Lucide React** for icons

## Features

- Matrix rain animated background
- Project showcase with category filtering (Security, Networking, Development)
- Typewriter effect on hero subtitle
- Scroll-based section animations
- Active navigation indicator
- Responsive design with mobile hamburger menu
- Scroll-to-top button
- Education timeline

## Project Structure

```
src/
├── App.tsx            # Main application component
├── main.tsx           # React entry point
├── index.css          # Global styles & Tailwind directives
└── data/
    ├── projects.json  # Project entries
    └── education.json # Education entries
```

To add a new project, edit `src/data/projects.json`. To add education, edit `src/data/education.json`.

## Development

```bash
npm install
npm run dev
```

## Deploy

```bash
npm run deploy
```

This builds the project and pushes the `dist/` folder to the `gh-pages` branch.
