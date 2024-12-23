import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Image from "next/image";
import Link from "next/link";

interface productImage {
    images: string[];
    title: string;
    price: number;
    smallDescription: string;
    id: string;
}


export default function ProductCard({images, title, smallDescription, price, id}: productImage) {
  return (
    <div className="rounded-lg font-PetrovRegular">
        <Carousel className="w-full mx-auto" >
            <CarouselContent>
            {images.map((item, index) => (
                <CarouselItem key={index}>
                     <div className="relative h-[230px]">
                        <Link href={`/product/${id}`}>
            <Image src={item} alt="product image" fill className="object-cover w-full h-full rounded-lg" />
            </Link>
        </div>
                </CarouselItem>
            ))}
            </CarouselContent>
            <CarouselPrevious className="ml-16" />
            <CarouselNext className="mr-16" />
        </Carousel>
        <div className="flex justify-between items-center mt-2">
            <h1 className="font-semibold text-xl">{title}</h1>
            <h3 className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/10">${price}</h3>
        </div>
        <p className="text-gray-600 line-clamp-2 text-sm mt-2">{smallDescription}</p>
    </div>
  )
}
