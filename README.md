# KidRewards 🌟 — #VibeKaregaPakistan

**KidRewards** is an AI-powered parenting companion built for the **Google AI Seekho 2026 Hackathon (App Banao Track)**. It transforms daily chores into a fun, gamified experience that teaches Pakistani children discipline and financial literacy[cite: 1, 2].

## 🚀 The Vision
In many Pakistani households, teaching kids the value of money and responsibility is often manual and inconsistent. **KidRewards** uses **Google Gemini 2.5 Flash** to act as a digital bridge—providing age-appropriate task suggestions and culturally resonant motivation in both English and Roman Urdu[cite: 1, 2].

## ✨ Key Features
*   **AI Task Suggester**: Leverages Gemini to suggest age-appropriate chores based on child interests (e.g., "Clean your cricket gear")[cite: 1, 2].
*   **Motivational Coach**: Generates personalized "Shabash!" messages and celebrations in Roman Urdu/English when a task is completed[cite: 1].
*   **Bilingual UI**: Designed for the local context with support for English and Urdu text throughout the app[cite: 1].
*   **Parent & Kid Dashboards**: High-fidelity interfaces for parents to manage tasks and for kids to track their "Wish" progress[cite: 1, 2].
*   **Progress Persistence**: All data—including points, tasks, and streaks—is saved locally using SQLite (`kidrewards.db`)[cite: 2].

## 🛠️ Tech Stack
*   **Frontend**: React + TypeScript + Vite[cite: 2]
*   **Backend**: Node.js/Express (via `server.ts`)[cite: 2]
*   **AI Engine**: Google Gemini 2.5 Flash (Google AI SDK)[cite: 1, 2]
*   **Database**: SQLite (`kidrewards.db`)[cite: 2]
*   **Styling**: Tailwind CSS / Custom CSS[cite: 2]

## 📂 Project Structure
*   `server.ts`: The backend logic handling Gemini API integration and database routes[cite: 1, 2].
*   `src/components/`: Modular UI components including `ParentDashboard`, `KidDashboard`, and `AITaskSuggester`[cite: 2].
*   `src/db.ts`: Configuration for database persistence and CRUD operations[cite: 2].
*   `src/types.ts`: TypeScript interfaces ensuring data consistency across the app[cite: 2].

## 🚦 Getting Started

### Prerequisites
*   Node.js (v18 or higher)
*   A Google AI Studio API Key

### Installation & Setup
1.  **Clone the Repo**:
    ```bash
    git clone [https://github.com/bilalnadeem614/kidrewards](https://github.com/bilalnadeem614/kidrewards)
    cd kidrewards
    ```
2.  **Environment Variables**:
    *   Rename `.env.example` to `.env`[cite: 2].
    *   Add your `GEMINI_API_KEY` inside the `.env` file[cite: 2].
3.  **Install Dependencies**:
    ```bash
    npm install
    ```
4.  **Run the App**:
    *   **Backend**: `npm run server` (starts `server.ts`)[cite: 2]
    *   **Frontend**: `npm run dev`[cite: 2]

## 🇵🇰 Local Impact
**KidRewards** is more than just a checklist; it's a tool for the modern Pakistani family. By introducing financial literacy and responsibility through the lens of local language and culture, we are preparing the next generation for a smarter future[cite: 1].

---
**Developed for Google AI Seekho 2026**
*   **Track**: App Banao
*   **Developer**: Muhammad Bilal Nadeem[cite: 1]
*   **Submission Date**: May 3, 2026[cite: 1]