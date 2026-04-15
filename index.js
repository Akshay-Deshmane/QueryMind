import dotenv from "dotenv";
dotenv.config();

import Groq from "groq-sdk";
import { tavily } from "@tavily/core";
import readline from "readline";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });


let messages = [
  {
    role: "system",
    content: `You are a helpful assistant with access to a web search tool. 
    If you need current information, call the webSearch function. `,
    // Respond in JSON format when calling tools. 
    // Only call the webserach tool if needed otherwise answer by your won.
    // Read the user's input very carefully and analyze the input and then only answer to the question of the user.
    // `,
  },
];


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function chat() {
  rl.question("You: ", async (query) => {
    messages.push({
      role: "user",
      content: query,
    });

  
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
      // tool_choice: "auto",
      tool_choice :  {"type": "function", "function": { "name": "webSearch" }}
    });

    const message = response.choices[0].message;

    if (message.tool_calls) {
      const toolCall = message.tool_calls[0];
      const args = JSON.parse(toolCall.function.arguments);

      const toolResult = await webSearch(args);

      messages.push(message);

      messages.push({
        role: "tool",
        tool_call_id: toolCall.id,
        content: toolResult,
      });

      
      const finalResponse = await groq.chat.completions.create({
        messages: messages,
        model: "llama-3.3-70b-versatile",
      });

      const finalMessage = finalResponse.choices[0].message;

    
      messages.push(finalMessage);

      console.log("Smart-AI-Assistant :", finalMessage.content);
    } else {
      messages.push(message);
      console.log("Smart-AI-Assistant :", message.content);
    }


    chat();
  });
}


async function webSearch({ query }) {
  console.log("=> Searching :", query);

  const res = await tvly.search(query);
  return res.results.map((r) => r.content).join("\n");
}

chat();
