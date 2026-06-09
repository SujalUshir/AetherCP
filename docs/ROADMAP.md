# AetherCP Project Roadmap

This roadmap outlines the long-term vision, planned features, and upcoming milestones for the AetherCP Chrome Extension.

---

## 1. Competitive Programming Enhancements
- **Problem Hints & Tutorials Integration**
  - Inject subtle "Hint" buttons on problem pages that fetch community hints or editorials without spoiling the full solution immediately.
  - Integration with popular CF/LeetCode tutorial API endpoints.
- **Smart Recommendations Engine**
  - Suggest the next optimal problem to solve based on the user's solved history, current rating, and tag weakness areas.
  - Filter recommendations by desired tags or difficulty delta (e.g., rating +100, +200).

## 2. Synchronization & Cloud Backups
- **Cross-device Sync**
  - Implement Chrome storage sync (`chrome.storage.sync`) or a lightweight backend service to persist settings and history across multiple machines.
  - Export/Import session and analytics history as JSON.
- **Auto-Sync to GitHub/GitLab**
  - Automatically push solved code solutions to a designated GitHub repository upon successful submission.

## 3. Productivity & AI Assistance
- **AI-Powered Code Review & Planning**
  - Optional sidebar enabling users to request AI feedback on their runtime/memory complexity or clean-code style for solved problems.
  - Interactive AI hints during active virtual contests or mashup simulations.
- **Enhanced Focus & DND Mode**
  - Add optional site blocking or aggressive distraction-free modes (hiding comments, blogs, or active user stands during practice).

## 4. UI/UX & Native Polish
- **System Dark/Light Theme Integration**
  - Support automatic dark/light theme toggle matching Codeforces custom CSS extensions (like custom styling plugins).
  - Add more chart visualization options (radar charts for skill balance, line graphs for rating trajectory).
