"use client";
import { Card, CardHeader } from "@/components/ui/card";
import { categoryItems } from "../lib/CategoryItems";
import { useState } from "react";


export default function SelectCategory() {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        <input type="hidden" name="category" value={selectedCategory || ""}/>
        {categoryItems.map((item) => (
            <Card key={item.id} onClick={() => setSelectedCategory(item.name)} className={selectedCategory === item.name ? 'border-primary border-2 ': 'border-2 border-primary/10'}>
                <CardHeader>
                    {item.image} <h3 className="font-medium font-PetrovRegular">{item.title}</h3>
                </CardHeader>
            </Card>
        ))}
    </div>
  )
}
