import { NextRequest,NextResponse } from "next/server";
 import { verifyJWT } from "@/lib/jwt";
 
export async function POST(req: NextRequest) {
  const token = req.cookies.get("auth")?.value;
  const type = req.headers.get('x-type')

  if (!token) {
    return NextResponse.json(
      { message: "Unauthorized", status: 401 },
      { status: 401 }
    );
  }

  let user;

  try {
    user = await verifyJWT(token);
       if(type === 'getUserId'){
        return NextResponse.json({user : user});
       }
  } catch {
    return NextResponse.json(
      { message: "Invalid token", status: 401 },
      { status: 401 }
    );
  }

 const url = new URL(
  "/api/ai",
  `http://127.0.0.1:${process.env.PORT || 3000}`
);

  console.log("Internal URL:", url.href);

  const proxyReq = new Request(url, {
    method: req.method,
    headers: {
      "content-type": "application/json",
      'x-userId' : user.userId ,
      "x-user-role": user.role,
    },
    body: await req.text(),
  });

  return fetch(proxyReq);
}