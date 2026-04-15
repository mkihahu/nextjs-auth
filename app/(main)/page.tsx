import Link from "next/link";
import React from "react";

export default function page() {
  const user = false;
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-white">
        Welcome to the Team Access Control System
      </h1>
      <p className="text-slate-300 mb-8">
        This application demonstrates a role-based access control system for
        teams built with Next.js and Prisma. Login to explore user management
        features, including assigning roles and teams.
      </p>
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-slate-800 p-6 border border-slate-700 rounded-lg">
          <h3 className="font-semibold mb-3 text-white">
            Features Demonstrated
          </h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-slate-300">
            <li>Role-based access control (RBAC)</li>
            <li>Route prtection with middleware</li>
            <li>Server-side permission checks</li>
            <li>Client-side permission hooks</li>
            <li>Dynamic route access</li>
          </ul>
        </div>
        <div className="bg-slate-800 p-6 border border-slate-700 rounded-lg">
          <h3 className="font-semibold mb-3 text-white">User Roles</h3>
          <ul className="space-y-1 text-sm text-slate-300">
            <li>
              <strong>Super Admin:</strong>Full system access
            </li>
            <li>
              <strong>Admin:</strong>User & team management
            </li>
            <li>
              <strong>Manager:</strong>Team specific management
            </li>
            <li>
              <strong>User:</strong>Basic Dashboard
            </li>
          </ul>
        </div>
      </div>
      {user ? (
        <div className="bg-gray-900/30 border border-green-600 rounded-lg p-4">
          <p>
            Welcome back <strong>Martin</strong>! You are logged in as{" "}
            <strong className="text-gray-200">ADMIN</strong>
          </p>
          <Link
            href="/dashboard"
            className="inline-block mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200"
          >
            Go to dashboard
          </Link>
        </div>
      ) : (
        <div className="bg-blue-900/30 border border-blue-600 rounded-lg p-4">
          <p className="text-slate-300 mb-3">You are logged in</p>
          <div className="flex justify-between gap-2">
            <Link
              href="/login"
              className="inline-block mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="inline-block mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200"
            >
              Register
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
