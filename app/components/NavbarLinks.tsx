"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";


export const navbarLinks = [
    {
        id: 0,
        name: 'Home',
        href: "/",
    },
    {
        id: 1,
        name: 'Templates',
        href: "#",
    },
    {
        id: 2,
        name: 'Fonts',
        href: "#",
    },
    {
        id: 3,
        name: 'Icons',
        href: "#",
    },
]

export default function NavbarLinks() {
    const location = usePathname();
  return (
    <div className="hidden md:flex justify-center items-center col-span-6 gap-x-2">
        {navbarLinks.map((item) => (
            <Link key={item.id} href={item.href}  className={cn(
                location === item.href
                  ? "bg-primary/50"
                  : "hover:bg-primary/70 hover:bg-opacity-75",
                "group flex items-center px-2 py-2 font-medium rounded-md"
              )}>
                {item.name}
            </Link>
        ))}
    </div>
  )
}
