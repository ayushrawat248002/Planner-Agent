import connectDB from "@/lib/mongodb";
import { userLogin } from "@/lib/actions/userlogin";
import { NextResponse, NextRequest } from "next/server";
import { signJWT } from "@/lib/jwt";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
  } catch (err) {
    return NextResponse.json({ error: "Database connection failed" }, { status: 500 });
  }

  const data = await req.formData();
  const result = await userLogin(data);

  const { userId, sucess, mssg } = result;

  if (userId && sucess) {
    const token = await signJWT({ userId, role: "user" });

    const response = NextResponse.json({ userId, sucess, mssg });

    response.cookies.set({
      name: "auth",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return response;
  }

  return NextResponse.json({ sucess, mssg }, { status: 401 });
}
