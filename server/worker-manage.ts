import { WorkerPool } from "./workerpool.js";

type StartMessage = {
  type: "start";
  jobId: string;
  job: any;
};

type AbortMessage = {
  type: "abort";
  jobId: string;
};

type Message = StartMessage | AbortMessage;

const pool = new WorkerPool(5);

// Stores an AbortController for each running job
const controllers = new Map<string, AbortController>();

process.on("message", async (msg: Message) => {
  if (msg.type === "start") {
    const controller = new AbortController();
    const tokenresult : any = []
    controllers.set(msg.jobId, controller);

    try {
     await pool.run({
        job: msg.job,
        signal: controller.signal,
        onToken: (token : any) => {tokenresult.push(token)},
      });

      process.send?.({
        jobId: msg.jobId,
        tokenresult,
      });
    } catch (err) {
      process.send?.({
        jobId: msg.jobId,
        error: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      controllers.delete(msg.jobId);
    }
  }

  if (msg.type === "abort") {
    console.log("Received abort:", msg.jobId);

    controllers.get(msg.jobId)?.abort();
  }
});