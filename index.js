import dotenv from "dotenv";
dotenv.config();

import Groq from "groq-sdk";
import { tavily } from "@tavily/core"; // web search api key provider
import readline from "readline"; // to read the terminle input 

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });

// 🧠 MEMORY (conversation history)
let messages = [
  {
    role: "system",
    content: "You are a smart assistant. Use webSearch for real-time data.",
  },
];

// 🎤 CLI input (so you can chat continuously)
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function chat() {
  rl.question("You: ", async (query) => {
    // 1️⃣ Add user message to memory
    messages.push({
      role: "user",
      content: query,
    });

    // 2️⃣ Call LLM with FULL history
    const response = await groq.chat.completions.create({
      messages: messages,
      model: "llama-3.3-70b-versatile",
      tools: [
        {
          type: "function",
          function: {
            name: "webSearch",
            description: "Search real-time info",
            parameters: {
              type: "object",
              properties: {
                query: { type: "string" },
              },
              required: ["query"],
            },
          },
        },
      ],
      tool_choice: "auto",
    });

    const message = response.choices[0].message;

    // 3️⃣ If tool is called
    if (message.tool_calls) {
      const toolCall = message.tool_calls[0];
      const args = JSON.parse(toolCall.function.arguments);

      // Execute tool
      const toolResult = await webSearch(args);

      // Add assistant tool call
      messages.push(message);

      // Add tool result
      messages.push({
        role: "tool",
        tool_call_id: toolCall.id,
        content: toolResult,
      });

      // 4️⃣ Final LLM call with updated memory
      const finalResponse = await groq.chat.completions.create({
        messages: messages,
        model: "llama-3.3-70b-versatile",
      });

      const finalMessage = finalResponse.choices[0].message;

      // Add assistant response to memory
      messages.push(finalMessage);

      console.log("Jarvis:", finalMessage.content);
    } else {
      // No tool used
      messages.push(message);
      console.log("Jarvis:", message.content);
    }

    // 🔁 Continue chat
    chat();
  });
}

// 🔍 Tavily Search
async function webSearch({ query }) {
  console.log("🔍 Searching:", query);

  const res = await tvly.search(query);
  return res.results.map((r) => r.content).join("\n");
}

// Start chat
chat();

