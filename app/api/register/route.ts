import { NextRequest, NextResponse } from "next/server";
import { signJWT } from  "@/lib/jwt"
import userCreation from "@/lib/actions/userCreation";

export async function POST(req: NextRequest) {
       
  const formData = await req.formData();
 
  const { userId, role } = await userCreation(formData);
        console.log(userId ,' ID of the user')
  const token = await signJWT({ userId: userId.toString(), role  });

    const res =  NextResponse.json({ sucess: true });

  res.cookies.set({
    name: "auth",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  return res;
}
