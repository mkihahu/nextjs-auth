"use client";

import { apiClient } from "@/app/lib/apiClient";
import Link from "next/link";
import React, { useActionState } from "react";

export type RegisterState = {
  success?: boolean;
  error?: string;
};
const Register = () => {
  const [state, registerAction, isPending] = useActionState(
    async (
      prevState: RegisterState,
      formData: FormData,
    ): Promise<RegisterState> => {
      const name = formData.get("name") as string;
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;
      const teamCode = formData.get("teamCode") as string | null;
      try {
        await apiClient.register({
          name,
          email,
          password,
          teamCode: teamCode || undefined,
        });
        window.location.href = "/dashboard";
        return { success: true };
      } catch (error) {
        return { ...prevState, success: false, error: "An error occurred" };
      }
    },
    {
      success: undefined,
      error: undefined,
    } as RegisterState,
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950">
      <div className="w-full max-w-md rounded-lg bg-slate-800 p-8 shadow-lg">
        <div className="text-center mb-6 space-y-2">
          <h2 className="text-center text-2xl font-bold text-white">
            Create a New Account
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Or{" "}
            <Link href="/login" className="text-blue-500 hover:text-blue-700">
              sign in to your account
            </Link>
          </p>
        </div>
        {state?.error && (
          <div className="bg-red-900/50 border border-red-700 text-red-300 text-sm text-center px-4 py-2 rounded">
            {state.error}
          </div>
        )}
        <form action={registerAction} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-slate-300"
            >
              Full Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              required
              className="mt-1 block w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-300"
            >
              Email Address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              required
              className="mt-1 block w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              placeholder="Enter your email address"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-300"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              required
              className="mt-1 block w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              placeholder="Create a strong password"
            />
          </div>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-slate-300"
            >
              Team Code (Optional)
            </label>
            <input
              type="text"
              name="teamCode"
              id="teamCode"
              className="mt-1 block w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              placeholder="Enter your team code (optional)"
            />
            <p className="mt-1 text-xs text-slate-500">
              If you have a team code, please enter it here. Otherwise, you can
              leave this field blank.
            </p>
          </div>
          <div>
            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
            >
              {isPending ? "Registering..." : "Register"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
