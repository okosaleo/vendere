
import prisma from "../lib/db"
import ProductCard from "../components/ProductCard";
import { unstable_noStore as noStore } from "next/cache";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";


async function getData(userId: string) {
  const data = await prisma.product.findMany({
    where: {
      userId: userId
    },
    select: {
      name: true,
      images: true,
      price: true,
      smallDescription: true,
      id: true,
    }
  });

  return data;
}

export default async function ProsuctPage() {
  noStore();
  const session = await auth.api.getSession({ headers: await headers() });

  if(!session) {
    redirect("/sign-in")
  }

  const data = await getData(session.user.id) 
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8">
    <h1 className="text-2xl font-bold">My Products</h1>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 sm:grid-cols-2 mt-4">
      {data.map((item) => (
        <ProductCard
          key={item.id}
          id={item.id}
          images={item.images}
          title={item.name}
          price={item.price}
          smallDescription={item.smallDescription}
        />
      ))}
    </div>
  </section>
  )
}
