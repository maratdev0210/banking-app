"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/cashier", label: "Главная" },
  { href: "/cashier/accounts", label: "Счета клиентов" },
  { href: "/cashier/transfer", label: "Переводы" },
  { href: "/cashier/withdrawal", label: "Снятие денег" },
  { href: "/accounts/new", label: "Открытие счёта" },
  { href: "/cashier/session", label: "Сессия кассира" },
  { href: "/cashier/transactions", label: "Операции" },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b p-4 shadow-sm">
      <div className="flex gap-6 items-center max-w-7xl mx-auto">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname === link.href ? "text-primary" : "text-muted-foreground"
            )}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
