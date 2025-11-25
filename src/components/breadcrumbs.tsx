"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaChevronRight } from "react-icons/fa6";

export function Breadcrumbs() {
  const pathname = usePathname();

  if (!pathname.startsWith("/notes/")) {
    return null;
  }

  const segments = pathname.replace("/notes/", "").split("/");

  const items = segments.map((segment, index) => {
    const href = "/notes/" + segments.slice(0, index + 1).join("/");
    const label = decodeURIComponent(segment);
    return { href, label };
  });

  return (
    <nav className="flex items-center text-sm" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2">
        <li className="inline-flex items-center">
          <Link href="/" className="text-gray-400 hover:text-white">
            Home
          </Link>
        </li>

        {items.map((item, index) => (
          <li key={item.href}>
            <div className="flex items-center">
              <FaChevronRight className="mx-1 me-2 h-3 w-3 text-gray-600" />
              <Link
                href={item.href}
                className={
                  index === items.length - 1
                    ? "font-medium text-purple-300"
                    : "text-gray-400 hover:text-white"
                }
              >
                {item.label}
              </Link>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}
