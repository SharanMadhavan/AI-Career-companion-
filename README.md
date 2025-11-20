# 🚀 AI Career Companion

> **Master Your Career Trajectory with Advanced AI**

AI Career Companion is a futuristic, production-grade React application designed to streamline the job search process. Leveraging the power of Google's **Gemini 2.5** models, it offers a suite of tools for resume management, job description analysis, tailored application generation, and real-time voice-enabled mock interviews.

---

## ✨ Key Features

### 📄 **Resume Management**
- **AI-Powered Parsing:** Upload PDF or TXT files; the AI automatically extracts and formats content.
- **Smart Suggestions:** Context-aware AI suggestions for fixing grammar, adjusting tone, and generating professional summaries.
- **Active State:** Select a primary resume to contextually drive other features in the app.

### 🎯 **Job Description Analysis**
- **Markdown Formatting:** Automatically cleans and formats raw job descriptions into readable structures.
- **Responsibility Clarification:** AI analyzes vague requirements and summarizes key deliverables.

### ⚡ **Resume Tailoring**
- **Keyword Optimization:** Compares your "Active Resume" against the "Active Job Description".
- **Side-by-Side Comparison:** Visualizes original bullet points vs. AI-optimized versions.
- **One-Click Copy:** Easily copy tailored content to your clipboard.

### 🧠 **Interview Preparation**
- **Question Generation:** Generates unique **Technical** and **Behavioral** questions based on the specific role.
- **Model Answers:** Provides detailed STAR-method answers for every question.
- **Downloadable Content:** Export your prep materials as text files.

### 🎙️ **Mock Interview (Voice Enabled)**
- **Real-Time Voice Interaction:** Speak your answers using the browser's microphone (Speech-to-Text).
- **AI Interviewer Persona:** The AI adapts its questions based on your previous answers and the job description.
- **Comprehensive Feedback:** Receives a detailed performance report with a Star Rating, Score (0-100), and Markdown-formatted strengths/weaknesses analysis.

---

## 🛠️ Tech Stack

- **Frontend Framework:** React 19
- **Build Tool:** Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Glassmorphism Design System)
- **Routing:** React Router Dom (v7)
- **AI Integration:** Google GenAI SDK (`@google/genai`)
- **State Management:** React Context API + LocalStorage (No Backend required)
- **Fonts:** Inter & Space Grotesk

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- A valid Google Gemini API Key ([Get one here](https://aistudio.google.com/))

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/ai-career-companion.git
    cd ai-career-companion
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the root directory and add your API key:
    ```env
    API_KEY=your_actual_google_api_key_here
    ```

4.  **Run the Development Server:**
    ```bash
    npm run dev
    ```

5.  **Open in Browser:**
    Navigate to `http://localhost:5173`

---

## 🎨 Design System

The application features a **Futuristic Glassmorphism** UI:
- **Backgrounds:** Animated glowing orbs and noise textures.
- **Components:** Translucent glass cards with `backdrop-blur`.
- **Typography:** Modern `Space Grotesk` headers and clean `Inter` body text.
- **Interactions:** Smooth hover states, glowing gradients, and refined transitions.
- **Theme:** Fully supported **Dark Mode** (defaulting to system preference).

---

## 🔒 Privacy & Data

This application is **Serverless**.
- All User Data (Resumes, JDs) is stored locally in your browser's `localStorage`.
- Audio data is processed in real-time and not stored permanently.
- Data is only sent to the Google Gemini API for processing during active requests.

---

## 📜 License

This project is licensed under the MIT License.

---

*Built with ❤️ using React & Google Gemini*
