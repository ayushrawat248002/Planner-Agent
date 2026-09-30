'use client';

import Link from 'next/link';

import React, { ReactNode } from 'react';
import { useRouter } from "next/navigation";

const UserForm = ({callback,changedisplay, typePage}:{callback : any, changedisplay : any, typePage: string}) => {
  const router = useRouter()
  
  const handlesubmit = async(e : React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const fromdata = new FormData(e.currentTarget);
    
    const result = await fetch(typePage === 'login' ? '/api/login' : '/api/register',{
      method : 'POST',
      body : fromdata
    });
    const finalresult = await result.json();

    if(finalresult.sucess){
      changedisplay()
    }
  }

 
return (
  <section className="relative flex min-h-screen w-screen items-center justify-center overflow-hidden bg-slate-950 px-4">

    {/* Background glow */}
    <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-purple-600/30 blur-3xl" />
    <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />
    <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-500/10 blur-3xl" />

    {/* Header */}
    <h1 className="absolute left-6 top-6 text-xl font-bold tracking-tight text-white sm:left-10 sm:top-8 sm:text-2xl">
      <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
        mini-tutor
      </span>
    </h1>

    {/* Dialog */}
    <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-white/10 p-[1px] shadow-2xl shadow-purple-950/50 backdrop-blur-xl">

      <div className="rounded-3xl bg-slate-950/80 px-7 py-9 sm:px-10">

        {/* Title */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-2xl shadow-lg shadow-purple-500/30">
            🎓
          </div>

          <h2 className="text-3xl font-bold text-white">
            {typePage === "login" ? "Welcome Back" : "Create Account"}
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            {typePage === "login"
              ? "Sign in to continue learning"
              : "Start your learning journey today"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handlesubmit} className="flex flex-col gap-5">

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Email
            </label>

            <input
              id="email"
              className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-white outline-none transition-all placeholder:text-slate-600 focus:border-purple-400 focus:bg-white/10 focus:ring-2 focus:ring-purple-500/20"
              type="email"
              name="email"
              placeholder="you@example.com"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Password
            </label>

            <input
              id="password"
              className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-white outline-none transition-all placeholder:text-slate-600 focus:border-purple-400 focus:bg-white/10 focus:ring-2 focus:ring-purple-500/20"
              type="password"
              name="password"
              placeholder="••••••••"
              required
            />
          </div>

          {/* Submit */}
          <button
            className="group relative mt-2 h-12 w-full overflow-hidden rounded-xl bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 font-semibold text-white shadow-lg shadow-purple-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-purple-500/40 active:translate-y-0"
            type="submit"
          >
            <span className="relative z-10">
              {typePage === "login" ? "Login" : "Create Account"}
            </span>

            <div className="absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-500 group-hover:translate-x-full" />
          </button>

        </form>

        {/* Register/Login */}
        {typePage !== "login" && (
          <div className="mt-7 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link
              href=""
              onClick={() => callback('login')}
              className="font-semibold text-purple-400 transition-colors hover:text-pink-400"
            >
              Login
            </Link>
          </div>
        )}

        {typePage === "login" && (
          <div className="mt-7 text-center text-sm text-slate-400">
            Don't have an account?{" "}
            <Link
            href= ''
              onClick={() => callback('register')}
              className="font-semibold text-purple-400 transition-colors hover:text-pink-400"
            >
              Create one
            </Link>
          </div>
        )}

      </div>
    </div>
  </section>
);


};

 export default React.memo(UserForm);
