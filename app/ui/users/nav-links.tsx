"use client";

import {
  UserGroupIcon,
  BeakerIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const links = [
  { name: "Users", href: "/users", icon: UserGroupIcon },
  { name: "Test API", href: "/ApiTestPanel", icon: BeakerIcon },
  { name: "Tester's Manual", href: "/tester-manual", icon: DocumentTextIcon },
];

export default function NavLinks({ onLinkClick }: { onLinkClick?: () => void }) {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            onClick={onLinkClick}
            className={clsx(
              "flex w-full items-center gap-3 rounded-md bg-gray-50 p-2 text-sm font-medium hover:bg-sky-100 hover:text-blue-600",
              { "bg-sky-100 text-blue-600": pathname === link.href }
            )}
          >
            <LinkIcon className="w-5 h-5" />
            <span className="hidden md:inline">{link.name}</span>
            <span className="md:hidden">{link.name}</span>
          </Link>
        );
      })}
    </>
  );
}
