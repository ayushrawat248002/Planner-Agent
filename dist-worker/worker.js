import { parentPort } from "worker_threads";
import { Redis } from "@upstash/redis";
import runAdaptiveAgent from "./components/agent.js";

console.log("Worker started");

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const streamText = async (arr) => {
          console.log(arr, 'ARRR')

  console.log("happened");

  if(Array.isArray(arr)){

  for (let i = 0; i < arr.length; i++) {
   
    parentPort?.postMessage({
      type: "token",
      token:  arr[i] ,
    });
  }
}else{
  parentPort?.postMessage({
      type: "token",
      token:  arr ,
    });
}

  parentPort?.postMessage({
    type: "done",
  });
};

let messageHistory = [];

parentPort.on("message", async (job) => {
  try {
    if (messageHistory.length === 0) {
      const history = await redis.get("Userhistory");
     
      if (history) {
        messageHistory =
          history.length > 10
            ? history.slice(history.length - 10)
            : history;
      }
    }

    const rawUserMessage = job.messages.at(-1)?.content || "";
    let plannerInput = rawUserMessage;

  


    let generalMessage = "";

    const updateGeneral = (text) => {
      generalMessage = text;
    };

    const result = await runAdaptiveAgent(
      messageHistory,
         rawUserMessage,
      updateGeneral,
      job.id
    );

    

    console.log(result.message, "message");
          
    messageHistory.push({
      role: "user",
      content: plannerInput,
    });

    if (generalMessage.length > 0) {
      messageHistory.push({
        role: "assistant",
        content: generalMessage,
      });
    }



    await redis.set("Userhistory", messageHistory);

    messageHistory = [];

    await streamText(result.message);
  } catch (err) {
    console.error(err);

    parentPort?.postMessage({
      type: "token",
      token: "Something went wrong try again later",
    });

    parentPort?.postMessage({
      type: "done",
    });
  }
});