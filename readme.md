# QueryMind => (Smart AI Assistant)

A powerful **AI-based CLI assistant** that integrates Large Language Models with real-time web search capabilities using tool calling. This project demonstrates how to build a production-style intelligent assistant capable of answering both static and dynamic queries.

---

## Overview =>

** QueryMind ** is a Node.js-based command-line application that leverages :-

* **LLM (Groq - LLaMA 3.3 70B)** for natural language understanding
* **Tavily API** for real-time web search
* **Tool Calling Mechanism** to dynamically fetch external data

It solves a key limitation of LLMs :-

>  *Static knowledge cutoff → No real-time awareness*

By integrating external tools, the assistant becomes **context-aware, dynamic, and production-ready**.

---

## Features => 

* 1.Interactive CLI chat interface.
* 2.Real-time web search using Tavily.
* 3.Intelligent tool invocation via LLM.
* 4.Multi-turn conversation memory.
* 5.Fast responses powered by Groq API.
* 6.Robust fallback for tool-call parsing.
* 7.Clean and modular code structure.

---

## Project Architecture =>

```
User Input (CLI)
       ↓
Message Queue (Chat History)
       ↓
Groq LLM (Decision Making)
       ↓
 ┌───────────────┬────────────────┐
 │ Tool Needed?  │ No Tool Needed │
 └──────┬────────┴───────────────┘
        ↓
   webSearch Tool (Tavily API)
        ↓
   Tool Response Injected
        ↓
Groq LLM (Final Answer Generation)
        ↓
   Output to CLI
```

---

## Tech Stack =>

| Technology | Purpose                         |
| ---------- | ------------------------------- |
| Node.js    | Backend runtime                 |
| Groq SDK   | LLM API (LLaMA 3.3 70B)         |
| Tavily API | Real-time web search            |
| dotenv     | Environment variable management |
| readline   | CLI interaction                 |

---

## Environment Variables =>

Create a `.env` file in the root directory:

```env
GROQ_API_KEY=your_groq_api_key
TAVILY_API_KEY=your_tavily_api_key
```

---

## Installation & Setup => 

```bash
# Clone the repository
git clone https://github.com/Akshay-Deshmane/QueryMind.git

# Navigate to project directory
cd QueryMind

# Install dependencies
npm install
npm i groq-sdk
npm i @tavily/core
npm i readline

# Run the project
node index.js
```

---

## WorkFlow Of QuickMind => 

### 1.User Interaction :-

The user enters a query via CLI:

```
You: today's temperature in Mumbai
```

---

### 2.LLM Decision Making :-

The model analyzes:

* Is the query **static** or **real-time**?

If real-time → triggers tool call.

---

### 3.Tool Calling Mechanism :-

Two scenarios are handled :-

#### Proper Tool Call (Ideal Case) =>

```json
{
  "tool_calls": [
    {
      "function": {
        "name": "webSearch",
        "arguments": "{\"query\": \"Mumbai temperature today\"}"
      }
    }
  ]
}
```

#### Fallback Case (Handled in Code) => 

```json
{
  "name": "webSearch",
  "parameters": {
    "query": "Mumbai temperature today"
  }
}
```

---

### 4.Web Search Execution :-

The `webSearch` function :-

* Calls Tavily API
* Fetches top results
* Aggregates content

```js
const res = await tvly.search(query);
```

---

### 5.Final Response Generation :-

* Tool result is injected back into conversation
* LLM generates a human-friendly answer

---

## Key Engineering Decisions => 

### 1.Fallback JSON Parsing :-

Handles cases where LLM does not strictly follow tool_call format.

### 2.Low Temperature (0.1) :-

Ensures :-

* Deterministic responses
* Reduced hallucination

### 3.Tool Abstraction :-

Easily extendable to :-

* Weather APIs
* Database queries
* Code execution

---

## Project Structure => 

```
├── index.js          # Main application logic
├── .env              # API keys (not committed)
├── package.json      # Dependencies
└── README.md         # Documentation
```

---

## Example Usage => 

```
You: hi
Assistant: Hello! How can I help you today?

You: latest news about AI
Searching: latest AI news
Assistant: Here are the latest updates in AI...
```

---

## Limitations Of QuickMind => 

* CLI-based (no UI yet)
* Depends on API availability
* Tool-call reliability depends on model behavior

---

## Future Enhancements / Future Scope => 

* 1.Web-based UI (React + Tailwind)
* 2.Voice assistant integration
* 3.Chat history storage (MongoDB)
* 4.Multi-tool ecosystem (calculator, weather, etc.)
* 5.Streaming responses (real-time typing)

---
