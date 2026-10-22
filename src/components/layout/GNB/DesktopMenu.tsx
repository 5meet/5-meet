import Link from "next/link";
import { NAV_ITEMS } from "./constants";

export function DesktopMenu() {
  return (
    <nav
      aria-label="주요 메뉴"
      className="ml-6 hidden h-full min-[744px]:block min-[1200px]:ml-10"
    >
      <ul className="flex h-full items-center gap-8">
        {NAV_ITEMS.map((item) => (
          <li key={item.href} className="h-full">
            <Link
              href={item.href}
              className="flex h-full items-center border-b-2 border-transparent px-1 text-sm font-semibold text-gray-500 transition-colors hover:text-primary-500"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}