# ResearchPath

An AI-powered research and writing coach for high school students. ResearchPath guides students step-by-step through the entire process of producing an academic research paper.

## Features

- **Topic Discovery**: AI helps narrow broad subjects to focused, arguable research questions using Socratic prompting
- **Thesis Builder**: Live "Thesis Strength Meter" evaluates clarity, arguability, and specificity
- **Research Planning**: AI generates custom research roadmaps with source types, search terms, and subtopic checklists
- **Source Tracker**: Log sources with AI credibility evaluation (peer-reviewed status, recency, author credentials)
- **Outline Builder**: Visual drag-and-drop outline with collaborative AI assistance
- **Drafting Coach**: Split-pane workspace with real-time paragraph feedback
- **Revision Checklist**: AI-powered rubric evaluation with specific suggestions
- **Final Export**: Export paper, sources, and outline as formatted documents

## Tech Stack

- React 18
- Tailwind CSS
- Anthropic API (Claude Sonnet 4)
- Framer Motion (animations)
- react-beautiful-dnd (drag-and-drop)
- Lucide React (icons)

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:3000`

4. Enter your Anthropic API key when prompted

## Usage

1. **Enter API Key**: Provide your Anthropic API key (stored locally in your browser)
2. **Follow the Stages**: Complete each stage sequentially - they unlock as you progress
3. **Save Progress**: All work is automatically saved to localStorage
4. **Export**: Download your paper, sources, and outline when complete

## Design

ResearchPath features an editorial/academic aesthetic:
- Warm off-white background
- Deep navy primary color
- Serif display font (Playfair Display) for headings
- Clean sans-serif (Inter) for body text
- Smooth animated transitions
- Mobile-responsive design

## API Key

You'll need an Anthropic API key to use the AI features. Get one at [https://console.anthropic.com/](https://console.anthropic.com/)

Your API key is stored locally in your browser's localStorage and is never sent to any server other than Anthropic's API.

## Reset

To start over, click "Reset & Start Over" in the sidebar. This will clear all your work from localStorage.

## License

MIT
