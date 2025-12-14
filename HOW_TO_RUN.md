# How to Run Your Dynamic AI Tourism App

You need to run TWO separate terminals (command prompts) at the same time: one for your **Frontend (App)** and one for your **Backend (Scraper)**.

### Step 1: Start the Backend (Research Server)
This server handles searching Google/DuckDuckGo and scraping travel sites.

1. Open a **new** terminal.
2. Navigate to your project folder:
   ```bash
   cd c:\Users\dell\OneDrive\Desktop\Tourism_llm-TravaNova
   ```
3. Run the server:
   ```bash
   node server/src/index.js
   ```
   *You should see: `🚀 Travel AI Backend running on port 5000`*
   *Keep this terminal OPEN. Do not close it.*

---

### Step 2: Start the Frontend (User Interface)
This runs your React website with the embedded AI model.

1. Open a **second** terminal.
2. Navigate to your project folder:
   ```bash
   cd c:\Users\dell\OneDrive\Desktop\Tourism_llm-TravaNova
   ```
3. Run the app:
   ```bash
   npm run dev
   ```
4. Open your browser to the URL shown (usually `http://localhost:5173`).

---

### Step 3: Using the App
1. Go to the **Assistant** page.
2. Wait for the blue progress bar to finish (it's loading the AI model into your browser).
3. Type a query like **"What is the best time to visit Goa?"**.
4. The Backend will search the web, and the AI will read the results and answer you!
