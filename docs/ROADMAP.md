# AetherCP Project Roadmap

This roadmap outlines the long-term vision, planned features, and upcoming milestones for the AetherCP Chrome Extension, organized by development phases.

---

## Phase 1: Multi-Platform Augmentation

- **AtCoder & CodeChef Support**
  - Extend problem detection content scripts to match AtCoder and CodeChef problem page patterns.
  - Inject custom profile analytics dashboards for these platforms.
- **Problem Hints & Tutorials Integration**
  - Inject subtle "Hint" buttons on problem pages that fetch community hints or editorials without spoiling the full solution immediately.
  - Integration with popular Codeforces/LeetCode tutorial API endpoints.
- **Smart Recommendations Engine**
  - Suggest the next optimal problem to solve based on the user's solved history, current rating, and tag weakness areas.
  - Filter recommendations by desired tags or difficulty delta (e.g., rating +100, +200).

## Phase 2: Data Portability & Backup

- **JSON & CSV Telemetry Portability**
  - Implement options to export all logged problem sessions, daily totals, and analytics history as JSON/CSV.
  - Add client-side configuration import pipelines to restore data easily on new machines.
- **Cross-device Sync**
  - Implement Chrome storage sync (`chrome.storage.sync`) or a lightweight backend service to persist settings and history across multiple browser instances.
- **Auto-Sync to GitHub/GitLab**
  - Automatically push solved code solutions to a designated GitHub repository upon successful submission.

## Phase 3: Deep Customization & AI Assistance

- **AI-Powered Code Review & Planning**
  - Optional sidebar enabling users to request AI feedback on their runtime/memory complexity or clean-code style for solved problems.
  - Interactive AI hints during active virtual contests or mashup simulations.
- **Enhanced Focus & DND Mode**
  - Add optional site blocking or aggressive distraction-free modes (hiding comments, blogs, or active user stands during practice).
- **Configurable Settings**
  - Allow users to configure custom user idle timeout limits (currently fixed at 5 minutes).
  - Add custom port configurations for the local editor receiver.
- **System Dark/Light Theme Integration**
  - Support automatic dark/light theme toggle matching Codeforces custom CSS extensions (like custom styling plugins).
  - Add more chart visualization options (radar charts for skill balance, line graphs for rating trajectory).
