import ProductCard from "@/app/components/ProductCard";
import prisma from "@/app/lib/db";
import { CategoryTypes } from "@prisma/client";
import { notFound } from "next/navigation";

async function getData(category: string) {
    let input;
  
    switch (category) {
      case "template": {
        input = "template";
        break;
      }
      case "fonts": {
        input = "fonts";
        break;
      }
      case "icon": {
        input = "icon";
        break;
      }
      case "all": {
        input = undefined;
        break;
      }
      default: {
        return notFound();
      }
    }
  
    const data = await prisma.product.findMany({
      where: {
        category: input as CategoryTypes,
      },
      select: {
        id: true,
        images: true,
        smallDescription: true,
        name: true,
        price: true,
      },
    });
  
    return data;
  }

export default async function CatPage({params}: {params: {category: string}}) {
    const data = await getData(params.category)
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 sm:grid-cols-2 gap-10 mt-4">
            {data.map((product) => (
                <ProductCard images={product.images} key={product.id} id={product.id} title={product.name} price={product.price} smallDescription={product.smallDescription} />
            ))}
        </div>
    </section>
  )
}
