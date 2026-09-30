import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "@/lib/jwt";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("auth")?.value;
   let chatid : any = req.headers.get('x-chatid')
  if (!token) {
    console.log('no token')
    return NextResponse.json({ message: "Unauthorized" , status : 401}, { status: 401 });
  }

  let user;
  try {
    user = await verifyJWT(token);
  } catch {
    return  NextResponse.json({message : "Invalid token", status : 401}, { status: 401 });
  }


  // 🔁 forward request to actual handler
  const url = new URL("/api/ai", req.url);

  const proxyReq = new Request(url, {
    method: req.method,
    headers: {
      ...Object.fromEntries(req.headers),
      "x-user-id": chatid,
      "x-user-role": user.role,
    },
    body: await req.text(),
    signal : req.signal
  });

  return fetch(proxyReq);
}
