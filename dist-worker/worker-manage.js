import { WorkerPool } from "./workerpool.js";

const pool = new WorkerPool(5);

const controllers = new Map();

process.on("message", async (msg) => {
  if (msg.type === "start") {
    const controller = new AbortController();

    controllers.set(msg.jobId, controller);
     const arr = []
    try {
      const result = await pool.run({
        job: msg.job,
        signal: controller.signal,
        onToken : (token) => {arr.push(token)}
      });

      console.log(arr, 'ARrratttt')
       console.log(msg.jobId)
      
       process.send({
        jobId: msg.jobId,
        result : arr
      });
    } catch (err) {
      console.log('error')
      process.send({
        jobId: msg.jobId,
        error: err.message,
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