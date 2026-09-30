import { Tools, ToolName } from "./Tools";
 import { Redis } from "@upstash/redis";
 
 const delay = async() => await new Promise((resolve) => setImmediate(resolve, 1000));
 
 const MAX_STEPS = 5;
 const redis = new Redis({ url: process.env.UPSTASH_REDIS_REST_URL!, token: process.env.UPSTASH_REDIS_REST_TOKEN!, });

async function loadMessages(userId: string) {
  return (
    (await redis.get<{
      summary: string | null;
      messages: any[];
    }>(`session:${userId}`)) ?? {
      summary: null,
      messages: [],
    }
  );
}

async function saveMessages(
  userId: string,
  summary: string | null,
  messages: any[]
) {
  await redis.set(
    `session:${userId}`,
    { summary, messages },
    { ex: 60 * 60 }
  );
}


async function summarizeConversation(groq: any, messages: any[]) {
  const res = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "system",
        content: "Summarize this conversation briefly for memory.",
      },
      ...messages,
    ],
  });

  return res.choices[0].message.content!;
}


export async function runAgent(
  groq: any,
  newMessages: any[],
  ctx: any
) {
  console.log(ctx.userId, 'ctx in memory')
  const memory = await loadMessages(ctx.userId);
  let summary = memory.summary;

  // 🧠 Build context
  let messages: any[] = [];

  if (summary) {
    messages.push({ role: "system", content: summary });
  }

  messages.push(...memory.messages.slice(-5)); // short-term memory
  messages.push(...newMessages); // new input

  delay();

  for (let step = 0; step < MAX_STEPS; step++) {
    delay();
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages,
      tools: [
        {
          type: "function",
          function: {
            name: "getTemperature",
            description: "Get temperature for a city",
            parameters: {
              type: "object",
              properties: { city: { type: "string" } },
              required: ["city"],
            },
          },
        },
        {
          type: "function",
          function: {
            name: "getTime",
            description: "Get current local time",
            parameters: { type: "object", properties: {} },
          },
        },
     
{
    type: "function",
    function: {
      name: "getUser",
      description: "Get user details from database",
      parameters: { type: "object", properties: {}, required: [] }, // empty parameters
    },
  },

      ],
      tool_choice: "auto",
    });

    const msg = completion.choices[0].message;

    // 🟢 FINAL ANSWER
    if (!msg.tool_calls?.length) {
      messages.push({ role: "assistant", content: msg.content });

      // ✂️ Auto-summary if needed
      if (messages.length > 20) {
        summary = await summarizeConversation(groq, messages);
        messages = messages.slice(-5);
      }
      delay();

      await saveMessages(ctx.userId, summary, messages);
      return msg.content;
    }

    // 🟡 TOOL CALLS
    messages.push(msg);

    for (const call of msg.tool_calls) {
  const toolName = call.function.name as ToolName;
      const args = JSON.parse(call.function.arguments || "{}");

  const toolFn = Tools[toolName];
  if (!toolFn) throw new Error(`Unknown tool: ${toolName}`);

  let result;
  try {
        result = await toolFn({ ...args, ctx });
      } catch {
    result = { error: "Tool failed" };
  }
  delay();

  messages.push({
    role: "tool",
    tool_call_id: call.id,
    content: JSON.stringify(result),
  });
}
  }

  throw new Error("Agent did not finish");
}
