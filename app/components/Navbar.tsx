import Image from "next/image";
import Link from "next/link";
import NavbarLinks from "./NavbarLinks";
import { Button } from "@/components/ui/button";
import MobileMenu from "./MobileMenu";
import { UserNav } from "./UserNav";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";


export default async function Navbar() {
   const session = await auth.api.getSession({ headers: await headers() });
  return (
    <nav className="relative max-w-7xl w-full flex md:grid md:grid-cols-12 items-center px-4 md:px-8 mx-auto py-7">
        <div className="md:col-span-3 ">
            <Link  href="/">
            <Image className="vendere" src="/vendere.png" alt="Vendere Logo" width={150} height={150} />
            </Link>
        </div>
        <NavbarLinks />
        <div className="flex items-center gap-x-2 ms-auto md:col-span-3">
            {session?.user ? (
                <UserNav  email={session.user.email as string}
                name={session.user.name as string}
                userImage={
                  session.user.image ?? `https://avatar.vercel.sh/${session.user.name}` } />
            ) : (
                <div className="flex items-center gap-x-2">
                <Button asChild>
                <Link href="/sign-in">Login</Link>
            </Button>
            <Button variant={"secondary"} asChild>
                <Link href="/sign-up">Sign Up</Link>
            </Button>
            </div>
            )}
          
            <div className="md:hidden">
                <MobileMenu />
            </div>
        </div>
    </nav>
  )
}
