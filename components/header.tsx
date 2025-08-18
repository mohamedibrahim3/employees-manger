"use client";

import React from "react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";

const Header = () => {
  const { data: session, status } = useSession();

  const handleSignOut = () => {
    signOut({ callbackUrl: "/sign-in" });
  };

  return (
    <div className="flex items-center space-x-4">
      {status === "loading" ? (
        <div className="animate-pulse flex items-center space-x-2">
          <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
          <div className="h-4 bg-gray-300 rounded w-20"></div>
        </div>
      ) : session?.user ? (
        <div className="flex items-center space-x-3">
          {/* User Avatar and Info */}
          <div className="flex items-center space-x-3 bg-gray-50 rounded-lg px-3 py-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-medium text-gray-900">
                {session.user.name || session.user.username}
              </div>
              <div className="text-xs text-gray-500">مرحباً بك</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <Button
              onClick={handleSignOut}
              variant="outline"
              size="sm"
              className="flex cursor-pointer items-center space-x-2 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">تسجيل خروج</span>
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center space-x-2 text-sm text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
          <User className="w-4 h-4" />
          <span>غير مسجل دخول</span>
        </div>
      )}
    </div>
  );
};

export default Header;
