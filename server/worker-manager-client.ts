import path from "path";
import { createRequire } from "module";
import type { ChildProcess } from "child_process";

const runtimeRequire = createRequire(import.meta.url);

const { fork } = runtimeRequire("child_process");

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
  if (manager) {
    return manager;
  }

  const workerPath = process.env.WORKER_PATH!;

const child = fork(workerPath);



  const pending = new Map<string, PendingTask>();

  child.on("message", (msg: WorkerMessage) => {
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

  child.on("error", (err :any) => {
    console.error("Worker manager crashed:", err);

    for (const [, task] of pending) {
      task.reject(err);
    }

    pending.clear();
    manager = null;
  });

  child.on("exit", (code  : any) => {
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