"use client";

import { User } from "@/app/types";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface HeaderProps {
  user: User | null;
}
export default function Header({ user }: HeaderProps) {
  const pathname = usePathname();
  const navigation = [
    { name: "Home", href: "/", show: true },
    { name: "Dashboard", href: "/dashboard", show: true },
  ].filter((item) => item.show);

  const getNavItemClass = (href: string) => {
    let isActive = false;
    if (href === "/") {
      isActive = pathname === "/";
    } else if (href === "/dashboard") {
      isActive = pathname.startsWith(href);
    }
    return `px-3 py-2 rounded text-sm font-medium transition-colors duration-200 ${isActive ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"}`;
  };

  // Don't render header on login page
  if (pathname === "/login") {
    return null;
  }
  return (
    <header className="bg-slate-900 border-b border-slate-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-white">
            Team Access
          </Link>
          {/* Navigation */}
          <nav className="flex items-center space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={getNavItemClass(item.href)}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm text-slate-300">{user.name}</span>
                <Link
                  href="/logout"
                  className="px-3 py-2 rounded text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors duration-200"
                >
                  Logout
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-3 py-2 rounded text-sm font-medium text-slate-300 bg-blue-600 hover:bg-blue-800 hover:text-white transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-3 py-2 rounded text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors duration-200"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
