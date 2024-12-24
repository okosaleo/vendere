"use server"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { z } from "zod"
import prisma from "./lib/db";
import { type CategoryTypes } from "@prisma/client";
import { stripe } from "./lib/stripe";
import { redirect } from "next/navigation";

export type State = {
    status: "error" | "success" | undefined;
    errors?: {
      [key: string]: string[];
    };
    message?: string | null;
  };


const productSchema =z.object({
    name: z.string().min(3, {message: "The name has to be a min character length of 5 "}),
    category: z.string().min(1, { message: "Category is required" }),
  price: z.number().min(1, { message: "The Price has to be bigger then 1" }),
  smallDescription: z
    .string()
    .min(10, { message: "Please give more information on your product." }),
  description: z.string().min(10, { message: "Description is required" }),
  images: z.array(z.string(), { message: "Images are required" }),
  productFile: z
    .string()
    .min(1, { message: "Pleaes upload a zip of your product" }),
});

const userSettingsSchema = z.object({
    firstName: z
      .string()
      .min(3, { message: "Minimum length of 3 required" })
      .or(z.literal(""))
      .optional(),
  
    lastName: z
      .string()
      .min(3, { message: "Minimum length of 3 required" })
      .or(z.literal(""))
      .optional(),
  });

  export async function SellProduct(prevState: any, formData: FormData) {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
  
    if (!user) {
      throw new Error("Something went wrong");
    }
  
    const validateFields = productSchema.safeParse({
      name: formData.get("name"),
      category: formData.get("category"),
      price: Number(formData.get("price")),
      smallDescription: formData.get("smallDescription"),
      description: formData.get("description"),
      images: JSON.parse(formData.get("images") as string),
      productFile: formData.get("productFile"),
    });
  
    if (!validateFields.success) {
      const state: State = {
        status: "error",
        errors: validateFields.error.flatten().fieldErrors,
        message: "Hey! There is a mistake with your inputs.",
      };
  
      return state;
    }

    await prisma.product.create({
      data: {
        name: validateFields.data.name,
        category: validateFields.data.category as CategoryTypes,
        smallDescription: validateFields.data.smallDescription,
        price: validateFields.data.price,
        images: validateFields.data.images,
        productFile: validateFields.data.productFile,
        description: JSON.parse(validateFields.data.description),
        userId: user.id
      }
    });

    const state: State ={
        status: "success",
        message: "Your Product has been created!",
    }
   
    
      return state;
    }

export async function UpdateUserSettings(prevState: any, formData: FormData ) {
  const {getUser} = getKindeServerSession()
  const user = await getUser()

  if (!user) {
    throw new Error( "Something went wrong!")
  }

  const validateFields = userSettingsSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
  });

  if (!validateFields.success) {
    const state: State = {
      status: "error",
      errors: validateFields.error.flatten().fieldErrors,
      message: "Hey! I think you have a mistake with your inputs"
    };
    return state;
  }

  const data = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      firstName: validateFields.data.firstName,
      lastName: validateFields.data.lastName,
    }
  });

  const state: State = {
    status: "success",
    message: "Your settings has been updated"
  }

  return state;
}

export async function BuyProduct(formData: FormData) {
  const id = formData.get("id") as string;
  const data = await prisma.product.findUnique({
    where: {
      id: id,
    },
    select: {
      name: true,
      smallDescription: true,
      price: true,
      images: true,
      productFile: true,
    },
  });

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: Math.round((data?.price as number) * 100),
          product_data: {
            name: data?.name as string,
            description: data?.smallDescription,
            images: data?.images,
          },
        },
        quantity: 1,
      },
    ],
    success_url:
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000/payment/success"
        : "",
    cancel_url:
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000/payment/cancel"
        : "",
  });

  return redirect(session.url as string);
}

export async function CreateStripeAccoutnLink() {
  const { getUser } = getKindeServerSession();

  const user = await getUser();

  if (!user) {
    throw new Error();
  }

  const data = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
    select: {
      connectedAccountId: true,
    },
  });

  const accountLink = await stripe.accountLinks.create({
    account: data?.connectedAccountId as string,
    refresh_url:
      process.env.NODE_ENV === "development"
        ? `http://localhost:3000/billing`
        : ``,
    return_url:
      process.env.NODE_ENV === "development"
        ? `http://localhost:3000/return/${data?.connectedAccountId}`
        : ``,
    type: "account_onboarding",
  });

  return redirect(accountLink.url);
}

export async function GetStripeDashboardLink() {
  const { getUser } = getKindeServerSession();

  const user = await getUser();

  if (!user) {
    throw new Error();
  }

  const data = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
    select: {
      connectedAccountId: true,
    },
  });

  const loginLink = await stripe.accounts.createLoginLink(
    data?.connectedAccountId as string
  );

  return redirect(loginLink.url);
}
