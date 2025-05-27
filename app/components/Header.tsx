"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/trainings", label: "Trainings" },
    { href: "/contact", label: "Contact Us" },
  ];
  

  const pathName = usePathname();
  return (
    <header className="bg-blue-950 p-8">
      <nav className="text-white text-3xl flex justify-center items-center gap-5">
        {links.map(({ href, label }) => {
          const isActive = pathName === href;
          return (
            <Link
              href={href}
              className={`px-4 py-2 rounded-2xl transition-all duration-200 ${
                isActive
                  ? "bg-white text-blue-950"
                  : "hover:bg-white hover:text-blue-950"
              }`}
              style={{
                boxShadow: isActive || undefined
                  ? "0 2px 6px rgba(255, 255, 255, 0.5)"
                  : undefined,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 2px 6px rgba(255, 255, 255, 0.3)";
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.boxShadow = "none";
              }}
            >
              {label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
  }
