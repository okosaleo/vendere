// api/creation/route.ts
import { NextResponse } from "next/server";
import { unstable_noStore as noStore } from "next/cache";
import prisma from "@/app/lib/db";
import { stripe } from "@/app/lib/stripe";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET() {
    noStore();
   const session = await auth.api.getSession({ headers: await headers() });

  if (!session || session === null || !session.user.id) {
    throw new Error("Something went wrong...");
  }

  let dbUser = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  if (!dbUser) {
    const account = await stripe.accounts.create({
      email: session.user.email as string,
      controller: {
        losses: {
          payments: "application",
        }, 
        fees: {
          payer: "application",
        },
        stripe_dashboard: {
          type: 'express'
        },
      },
    })

    dbUser = await prisma.user.create({
        data: {
            id: session.user.id,
            name: session.user.name ?? "",
            email: session.user.email ?? "",
            profileImage: session.user.image ?? `https://avatar.vercel.sh/${session.user.name}`,
            image: session.user.image ?? `https://avatar.vercel.sh/${session.user.name}`,
            connectedAccountId: account.id,
        }
    })
  }
  return NextResponse.redirect("http://localhost:3000")
}