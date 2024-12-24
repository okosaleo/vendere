
import { ProductRow } from "./components/ProductRow";



export default function Home() {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 font-PetrovRegular mb-24">
      <div className="max-w-3xl mx-auto text-2xl sm:text-5xl lg:text-6xl font-semibold text-center">
        <h1 className="font-PetrovBold">Find the best Templates</h1>
        <h1 className="text-primary ">Fonts and Icons</h1>
        <p className="lg:text-lg text-muted-foreground mx-auto mt-5 w-[90%] font-PetrovRegular text-base">
        Vendere is the ultimate digital marketplace for creative assets, offering premium fonts, templates, and high-quality icons to elevate your projects. Unleash your creativity with Vendere&apos;s diverse and curated collection.
        </p>
      </div>
      <ProductRow category="newest" />
      <ProductRow category="templates" />
      <ProductRow category="fonts" />
      <ProductRow category="icons" />
    </section>
  );
}
