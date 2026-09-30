import { ChildProcess, fork } from "child_process";

type PendingTask = {
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
};

type WorkerManager = {
  process: ChildProcess;
  pending: Map<string, PendingTask>;
};

type WorkerMessage = {
  jobId: string;
  result?: any;
  error?: any;
};

let manager: WorkerManager | null = null;

export function getWorkerManager(): WorkerManager {
  // Return existing singleton
  if (manager) {
    return manager;
  }

  // Start worker-manager process
const workerPath = require.resolve("../dist-worker/worker-manage.js");
const child = fork(workerPath);

  // Stores pending requests by jobId
  const pending = new Map<string, PendingTask>();

  // Handle responses from worker-manager
  child.on("message", (msg: WorkerMessage) => {
    console.log('triggered')
    const { jobId, result, error } = msg;
    console.log(result, 'res')
    const task = pending.get(jobId);
        console.log(task, 'task')
    if (!task) return;

    pending.delete(jobId);

    if (error) {
        console.log('error ocuured')
      task.reject(error);
    } else {
      task.resolve(result);
    }
  });

  // Worker manager crashed
  child.on("error", (err: Error) => {
    console.error("Worker manager crashed:", err);

    for (const [, task] of pending) {
      task.reject(err);
    }

    pending.clear();
    manager = null;
  });

  // Worker manager exited
  child.on("exit", (code: number | null) => {
    console.log(`Worker manager exited with code ${code}`);

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