# Master Prompt: AI Career Companion Application

This document contains the structural instructions used to generate the **AI Career Companion** codebase. It serves as a reference for understanding the architectural decisions and UI/UX requirements of the project.

---

## 1. Role & Objective
**Role:** Senior Frontend Engineer & UI/UX Designer.
**Objective:** Build a production-ready, "Futuristic" Single Page Application (SPA) using **React 19**, **Vite**, **TypeScript**, and **Tailwind CSS**. The app acts as a career assistant powered by the **Google Gemini API**.

## 2. Technical Architecture
*   **Framework:** React 19 with Vite.
*   **Routing:** `react-router-dom` (v7) using `HashRouter` for static deployment compatibility.
*   **Language:** TypeScript (Strict mode).
*   **State Management:** React Context API (`AppContext`, `AuthContext`, `ThemeContext`) backed by `localStorage` for persistence. No external database.
*   **AI SDK:** `@google/genai` (Latest version).
*   **Styling:** Tailwind CSS configured for `darkMode: 'class'`.

## 3. Visual Design Language (Futuristic Glassmorphism)
*   **Aesthetics:** High-end SaaS look. Translucent backgrounds (`bg-white/60`, `backdrop-blur-xl`), glowing mesh gradients, and subtle border lighting.
*   **Typography:**
    *   Headings: `Space Grotesk` (Modern, tech-oriented).
    *   Body: `Inter` (Clean, readable).
*   **Color Palette:** Slate-900/950 for dark mode backgrounds. Accents in Cyan, Blue, Purple, and Rose gradients.
*   **Animations:** CSS keyframes for floating "blobs", fade-in transitions (`animate-fade-in`), and pulse effects.

## 4. Feature Specifications

### A. Core Infrastructure
*   **Layout:** A main layout wrapper containing the animated background, a glassmorphic `Header` (with Theme Toggle), and the main content area.
*   **Toast Notifications:** A custom, non-blocking notification system for success/error messages.
*   **Loading States:** Custom animated spinners (pulsing rings) for all async operations.

### B. Resume Management (`Resume.tsx`)
*   **PDF Parsing:** Use Gemini 2.5 Flash to extract raw text from uploaded PDF files (converted to Base64).
*   **Context Awareness:** "Smart Suggestions" chips appear below inputs based on the Resume Title.
*   **Actions:** One-click AI tools to "Fix Grammar", "Professional Tone", or "Summarize".
*   **State:** Ability to set a specific resume as "Active" (Green indicator).

### C. Job Description Management (`JobDescription.tsx`)
*   **Formatting:** AI capability to rewrite raw text into clean Markdown.
*   **Clarification:** AI capability to summarize requirements or clarify vague responsibilities.
*   **State:** Ability to set a specific JD as "Active".

### D. Resume Tailoring (`TailorResume.tsx`)
*   **Logic:** Requires both an Active Resume and Active JD.
*   **Gemini Prompt:** Compare the two texts and generate a JSON response containing `originalBullets` vs `tailoredBullets`.
*   **UI:** Split-pane view. Copy-to-clipboard button for individual tailored bullets.

### E. Interview Preparation (`InterviewPrep.tsx`)
*   **Generation:** Create 5 unique questions (Technical or Behavioral) based on the Active JD.
*   **Load More:** Ability to append new questions without duplicating existing ones.
*   **UI:** Accordion-style dropdowns revealing detailed "Model Answers".

### F. Mock Interview (`MockInterview.tsx`)
*   **Architecture:** Chat interface combining `Gemini` chat session with browser `SpeechRecognition` API.
*   **Flow:**
    1.  Start Interview -> AI greets based on JD context.
    2.  User speaks (STT) or types -> Message sent to AI.
    3.  AI responds (Text) -> Cycle continues.
*   **Feedback:** On "End Interview", send the entire transcript to Gemini 2.5 Pro.
*   **Output:** structured JSON returning a Rating (1-5), Score (0-100), and Markdown feedback text.

## 5. Gemini Integration Rules
*   **Model Selection:**
    *   `gemini-2.5-flash`: For fast tasks (Chat, Suggestions, Text Extraction).
    *   `gemini-2.5-pro`: For complex reasoning (Interview Feedback, Detailed Question Generation).
*   **Security:** API Key must be loaded from `process.env.API_KEY`.
*   **Error Handling:** All API calls must be wrapped in try/catch blocks with user-facing error toasts.

---

*Use this prompt structure to regenerate or extend the application in the future.*
