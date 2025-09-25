import { Card } from "@/components/ui/card";
import prisma from "../lib/db";
import SettingsForm from "../components/form/SettingsForm";
import { unstable_noStore as noStore } from "next/cache";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";


async function getData(userId: string) {
    const data = await prisma.user.findUnique({
        where: {
            id: userId
        },
        select: {
            name: true,
            email: true,
        }
    });

    return data;
}

export default async function SettingsPage() {
    noStore();
    const session = await auth.api.getSession({ headers: await headers() });
    if(!session) {
      return redirect("/sign-in")
    }

    const data = await getData(session.user.id);
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8">
        <Card>
            <SettingsForm name={data?.name as string} email={data?.email as string}/>
        </Card>
    </section>
  )
}
