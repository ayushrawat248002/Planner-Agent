import { NextRequest, NextResponse } from "next/server";
import { signJWT } from  "@/lib/jwt"
import userCreation from "@/lib/actions/userCreation";

export async function POST(req: NextRequest) {
       
  const formData = await req.formData();
   let res;
  const { userId, role , mssg } = await userCreation(formData);
        console.log(userId ,' ID of the user')
        if(role && userId && !mssg){
  const token = await signJWT({ userId: userId.toString(), role  });

     res =  NextResponse.json({ sucess: true });

  res.cookies.set({
    name: "auth",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });
}else{
  console.log(mssg)
   res = NextResponse.json({sucess  : false, mssg : mssg})
}

  return res;
}
