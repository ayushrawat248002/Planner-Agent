

import { parentPort } from "worker_threads";
import { Redis } from "@upstash/redis";
 console.log("Worker started");
import  runAdaptiveAgent  from "../server/components/agent.js";

console.log("Worker started");




 const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});



const streamText = async (text: string) => {
  const CHUNK_SIZE = 8;
    console.log('happened')
  for (let i = 0; i < text.length; i += CHUNK_SIZE) {
    parentPort?.postMessage({
      type: "token",
      token: text.slice(i, i + CHUNK_SIZE),
    });
  }

  parentPort?.postMessage({
    type: "done",
  });
};


   let messageHistory : any = [];

parentPort!.on("message", async (job) => {
  try {
    
  if(messageHistory.length === 0){
  
     const history : any = await redis.get('history');
     if(history){
          messageHistory = history.length > 10 ? messageHistory.slice(messageHistory.length - 10,messageHistory.length) : history
     }
  }
  
const rawUserMessage =
  job.messages.at(-1)?.content || "";

let plannerInput = rawUserMessage;

      
   
  


    const pending = await redis.get<any>(`pending${job.id}`);

    

    if (pending?.type === "awaiting_input" ) {
    
      plannerInput = `


Previous User Query:
${pending.originalQuery}

Assistant Asked:
${pending.question}

User Replied:
${rawUserMessage}

Continue the task.
`;

console.log(plannerInput)

    }

  
    
    let generalMessage = '';

    const updateGeneral = (text : any) => {
       generalMessage = text
    }
     
   
    const result = await runAdaptiveAgent(messageHistory,  plannerInput, updateGeneral,job.id);
       console.log(result.message, 'message')
         
        messageHistory.push({role : 'user', content : plannerInput});
        if(generalMessage.length > 0)messageHistory.push({role : 'assistant', content : generalMessage})
        console.log(messageHistory)
          await redis.set('history', messageHistory);
          messageHistory = [];
        
      await streamText(result?.message)
      
    

    
  } catch (err: any) {

    console.log(err.message);
    parentPort?.postMessage({
      type: "token",
      token: 'Something went wrong try again later',
    });

    parentPort?.postMessage({
      type: "done",
    });
  }
});