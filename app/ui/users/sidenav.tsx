"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import NavLinks from "@/app/ui/users/nav-links";

export default function SideNav() {
  const [isOpen, setIsOpen] = useState(false);

  const handleLinkClick = () => {
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* ✅ Top Header for Mobile */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white shadow-md flex items-center justify-between px-4 h-[52px]">
        <Image
          src="/assets/logo.png"
          alt="BlackH Auth Logo"
          width={100}
          height={40}
          priority
        />
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-700 focus:outline-none"
        >
          {isOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
        </button>
      </div>

      {/* ✅ Sidebar for Desktop & Mobile Slide-In */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 transform bg-white border-r transition-transform duration-300 ease-in-out md:translate-x-0 md:static ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo for Desktop */}
        <div className="my-2 hidden md:flex items-center justify-start h-20 px-4 border-b">
          <Link href="/">
            <Image
              src="/assets/logo.png"
              alt="BlackH Auth Logo"
              width={160}
              height={40}
              priority
            />
          </Link>
        </div>

        {/* Nav Links */}
        <div className="flex flex-col items-start px-3 py-4 md:px-4 space-y-2">
          <NavLinks onLinkClick={handleLinkClick} />
        </div>
      </aside>

      {/* ✅ Dark overlay when sidebar is open on mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
