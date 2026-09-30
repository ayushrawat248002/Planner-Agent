import { Worker } from "worker_threads";
import path, { resolve } from "path";

type Job = {
  job: any;
  onToken: (token: string) => void
  signal: AbortSignal;

};

type Pending = Job & {
  resolve: () => void;
  reject: (err: any) => void;
};
const tasks : any = [];
let pause = false





 export class WorkerPool {
  idleWorkers: Worker[] = [];
  busyWorkers = new Set<Worker>();
  queue: Pending[] = [];



  constructor(size = 4) {
    for (let i = 0; i < size; i++) {
      this.idleWorkers.push(
        new Worker( path.resolve("dist-worker/worker.js"))
      );
    }
  }

  run({ job, onToken, signal }: Job) {
    return new Promise<void>((resolve, reject) => {
      this.queue.push({ job, onToken, signal, resolve, reject  });
      this.schedule();
    });
  }

  schedule() {
    if (!this.queue.length || !this.idleWorkers.length) return;
      console.log(this.idleWorkers.length)
    const worker = this.idleWorkers.pop()!;
    const task = this.queue.shift()!;
    this.busyWorkers.add(worker);
    console.log(this.idleWorkers.length)
    this.execute(worker, task);
    console.log(this.idleWorkers.length)
  }

  execute(worker: Worker, task: Pending) {
  const { job, onToken, signal, resolve, reject } = task;
  let settled = false;

  const onMessage = (msg: any) => {
    if (settled) return; // ignore late messages

    switch (msg.type) {
      case "token":
        onToken(msg.token);
        break;
      case "done":
        settled = true;
        cleanup();
        resolve();
        break;
      case "error":
        settled = true;
        cleanup();
        reject(msg.error);
        break;
    }
  };

  const onAbort = () => {
    if (settled) return;
    settled = true;
    console.log('aborted')
    cleanup(); // 🔥 remove listeners FIRST
    worker.terminate();

    reject(new Error("aborted"));
  };

  const cleanup = () => {
    worker.off("message", onMessage);
    signal.removeEventListener("abort", onAbort);

    this.busyWorkers.delete(worker);
    this.idleWorkers.push(
     new Worker( path.resolve("dist-worker/worker.js"))
        
    );

    this.schedule();
  };

  worker.on("message", onMessage);
  worker.postMessage(job);
  signal.addEventListener("abort", onAbort, { once: true });
}

}
