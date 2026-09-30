import { fork } from "child_process";
import path from "path";

let manager = null;

export function getWorkerManager() {
  // Return the existing worker-manager if it has already been created
  if (manager) {
    return manager;
  }

  // Start the worker-manager process
  const child = fork(path.resolve("./dist-worker/worker-manage.js"));

  // Stores pending requests keyed by jobId
  const pending = new Map();

  // Handle responses from the worker-manager
  child.on("message", (msg) => {
    const { jobId, result, error } = msg;

    const task = pending.get(jobId);

    if (!task) return ;                                   

    // Remove completed request
    pending.delete(jobId);

    if (error) {
      task.reject(error);
    } else {
      task.resolve(result);
    }
  });

   
  // Worker-manager crashed
  child.on("error", (err) => {
    console.error("Worker manager crashed:", err);

    // Reject all pending requests
    for (const [, task] of pending) {
      task.reject(err);
    }

    pending.clear();
    manager = null;
  });

  // Worker-manager exited
  child.on("exit", (code) => {
    console.log(`Worker manager exited with code ${code}`);

    // Reject all pending requests
    for (const [, task] of pending) {
      task.reject(new Error("Worker manager exited"));
    }

    pending.clear();
    manager = null;
  });

  manager = {
    process: child,
    pending,
  };

  return manager;
}