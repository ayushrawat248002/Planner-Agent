import OpenAI from "openai";
  import Groq from "groq-sdk";

export function streamExplanation(req: Request, data: any) {
  const encoder = new TextEncoder();
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const completion = await groq.chat.completions.create(
          {
           model: "llama-3.1-8b-instant",
            stream: true,
            messages: [
              
              {
                role: "user",
                content: JSON.stringify(data),
              },
            ],
          },
          {
            signal: req.signal,
          }
        );

        for await (const chunk of completion) {
          const token = chunk.choices[0]?.delta?.content;
          if (token) {
            controller.enqueue(encoder.encode(token));
          }
        }

        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
