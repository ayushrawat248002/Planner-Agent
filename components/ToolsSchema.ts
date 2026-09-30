import type { ChatCompletionTool } from "openai/resources/chat";
export const tools : ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "assigningTutor",
      description: "Based on class and subject, return hot topics likely to come in the exam",
      parameters: {
        type: "object",
        properties: {
          subject: {
            type: "string",
            description: "Subject name like Math, Science, History"
          },
          class: {
            type: "number",
            description: "Class/grade of the student"
          }
        },
        required: ["subject", "class"]
      }
    }
  }
];
