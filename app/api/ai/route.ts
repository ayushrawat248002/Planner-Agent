import { NextRequest, NextResponse } from "next/server" ;
import { randomUUID } from "crypto" ;
import { getWorkerManager } from "../../../server/worker-manager-client" ;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const job = {
      id: req.headers.get("x-user-id"),
      role: req.headers.get("x-user-role"),
      messages,
    };
          console.log('Hitted routeai')
    const manager = getWorkerManager();
          
    const jobId = randomUUID();

       console.log('in ai route')

    const resultPromise = new Promise((resolve, reject) => {
      manager.pending.set(jobId, {
        resolve,
        reject,
      });

      manager.process.send({
        type: "start",
        jobId,
        job,
      });
    });

    // Client disconnected
    req.signal.addEventListener(
      "abort",
      () => {
        console.log("Request aborted:", jobId);

        manager.process.send({
          type: "abort",
          jobId,
        });
      },
      { once: true }
    );

    const result = await resultPromise;

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}