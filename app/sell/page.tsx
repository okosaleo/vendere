"use client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SelectCategory from "../components/SelectCategory";
import { Textarea } from "@/components/ui/textarea";
import { TipTapEditor } from "../components/Editor";
import { UploadDropzone } from "../lib/uploadthings";
import { useEffect, useState } from "react";
import { JSONContent } from "@tiptap/react";
import { useFormState } from "react-dom";
import { toast } from "sonner";
import { SellProduct, State } from "../actions";
import { Submitbutton } from "../components/SubmitButton";
import { redirect } from "next/navigation";

export default function SellRoute() {
    const initalState: State = { message: "", status: undefined };
    const [state, formAction] = useFormState(SellProduct, initalState);
    const [json, setJson] = useState<null | JSONContent>(null)
    const [images, setImages] = useState<string[] | null>(null)
    const [productFile, SetProductFile] = useState<null | string>(null);

    useEffect(() => {
        if (state.status === "success") {
          toast.success(state.message);
          redirect("/");
        } else if (state.status === "error") {
          toast.error(state.message);
        }
      }, [state]);
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 mb-14">
        <Card className="border-primary/70 font-PetrovRegular">
            <form action={formAction}>
                <CardHeader>
                    <CardTitle className="text-3xl">Sell your products with ease</CardTitle>
                    <CardDescription>
                        Please describe your product here in detail so that it can be listed.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-y-10">
                    <div className="flex flex-col gap-y-2">
                        <Label>Name</Label>
                        <Input name="name" required minLength={3} type="text" placeholder="Name of your Product" />
                        {state?.errors?.["name"]?.[0] && (
                                    <p className="text-destructive">{state?.errors?.["name"]?.[0]}</p>
                           )}
                    </div>
                    <div className="flex flex-col gap-y-2">
                        <Label>Category</Label>
                        <SelectCategory />
                        {state?.errors?.["category"]?.[0] && (
                               <p className="text-destructive">
                       {state?.errors?.["category"]?.[0]}
                                  </p>
                           )}
                    </div>
                    <div className="flex flex-col gap-y-2">
                        <Label>Price</Label>
                        <Input name="price" required min={1} placeholder="$20" type="number" />
                        {state?.errors?.["price"]?.[0] && (
                           <p className="text-destructive">{state?.errors?.["price"]?.[0]}</p>
                             )}
                    </div>
                    <div className="flex flex-col gap-y-2">
                        <Label>Small Summary</Label>
                        <Textarea required minLength={10} name="smallDescription" placeholder="Please Describe your product here ...." />
                        {state?.errors?.["smallDescription"]?.[0] && (
                                 <p className="text-destructive">
              {                     state?.errors?.["smallDescription"]?.[0]}
                                 </p>
                               )}
                        <div className="flex flex-col gap-y-2">
                            <input type="hidden" name="description" value={JSON.stringify(json)} />
                            <Label>Description</Label>
                            <TipTapEditor json={json} setJson={setJson} />
                            {state?.errors?.["description"]?.[0] && (
                                 <p className="text-destructive">
                                    {state?.errors?.["description"]?.[0]}
                                      </p>
                                    )}
                        </div>
                        <div className="flex flex-col gap-y-2">
                            <input type="hidden" name="images" value={JSON.stringify(images)} />
                            <Label>Product Images</Label>
                            <UploadDropzone endpoint="imageUploader" onClientUploadComplete={(res) => {
                                setImages(res.map((item) => item.url ))
                            }} onUploadError={(error: Error) => {
                                throw new Error(`${error}`)
                            }} />
                             {state?.errors?.["images"]?.[0] && (
                 <p className="text-destructive">{state?.errors?.["images"]?.[0]}</p>
                        )}
                        </div>
                        <div className="flex flex-col gap-y-2">
                        <input type="hidden" name="productFile" value={productFile ?? ""} />
                            <Label>Product File</Label>
                            <UploadDropzone endpoint="produtFileUpload"
                               onClientUploadComplete={(res) => {
                                SetProductFile(res[0].url);
                                toast.success("Your Product file has been uplaoded!");
                              }} 
                              onUploadError={(error: Error) => {
                                toast.error("Something went wrong, try again");
                              }}
                               />
                                {state?.errors?.["productFile"]?.[0] && (
                                  <p className="text-destructive">
                                                          {state?.errors?.["productFile"]?.[0]}
                                        </p>
                                )}
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                   <Submitbutton title="Create your product"  />
                </CardFooter>
            </form>
        </Card>
    </section>
  )
}
