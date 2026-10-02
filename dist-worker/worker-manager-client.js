import { fork } from "child_process";
import path from "path";



export function getWorkerManager() {
  if (manager) {
    return manager;
  }

  const workerPath = path.join(
  process.cwd(),
  "dist-worker",
  "worker-manage.js"
);
  console.log("Starting worker:", workerPath);

  const child = fork(workerPath);

  const pending = new Map();

  child.on("message", (msg) => {
    const { jobId, result, error } = msg;

    const task = pending.get(jobId);

    if (!task) return;

    pending.delete(jobId);

    if (error) {
      task.reject(error);
    } else {
      task.resolve(result);
    }
  });

  child.on("error", (err) => {
    console.error("Worker manager error:", err);

    for (const [, task] of pending) {
      task.reject(err);
    }

    pending.clear();
    manager = null;
  });

  child.on("exit", (code) => {
    console.log(`Worker manager exited with code ${code}`);

    for (const [, task] of pending) {
      task.reject(new Error(`Worker manager exited with code ${code}`));
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