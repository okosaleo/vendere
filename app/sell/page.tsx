import { Card } from "@/components/ui/card";
import { SellForm } from "../components/form/SellForm";
import { unstable_noStore as noStore } from "next/cache";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";


export default async function SellRoute() {
  noStore();
  const session = await auth.api.getSession({ headers: await headers() });

  if(!session) {
    return redirect("/sign-in")
  }
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 mb-14">
        <Card className=" font-PetrovRegular">
           <SellForm />
        </Card>
    </section>
  )
}
