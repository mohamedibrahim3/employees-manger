"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="sm"
        className="md:hidden p-2"
        onClick={toggleMenu}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Mobile menu overlay */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={toggleMenu}
          />
          <div className="fixed top-20 right-4 left-4 bg-white rounded-lg shadow-lg border border-gray-200 z-50 md:hidden">
            <nav className="flex flex-col p-4 space-y-3">
              <Link
                href="/"
                className="text-gray-700 hover:text-blue-600 font-medium py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={toggleMenu}
              >
                الرئيسية
              </Link>
              <Link
                href="/"
                className="text-gray-700 hover:text-blue-600 font-medium py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={toggleMenu}
              >
                الموظفين
              </Link>
              <Link
                href="/employees/create"
                className="bg-blue-600 text-white font-medium py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-center"
                onClick={toggleMenu}
              >
                إضافة موظف
              </Link>
            </nav>
          </div>
        </>
      )}
    </>
  );
};

export default MobileNav;
