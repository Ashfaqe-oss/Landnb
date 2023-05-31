import { getURL } from "@/app/helpers/stripe-url";
import { stripe } from "@/app/libs/stripe";
import { headers, cookies } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
  const { price } = await req.json();

  try {
    console.log(price);
    console.log('http://localhost:3000')

    // const { price } = req.body;

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: price,
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: 'http://localhost:3000/success',
        cancel_url: 'http://localhost:3000/cancel',
      });
    return NextResponse.json(session.url);
  } catch (error: any) {
    console.log("Error in POST", { error });
    return new NextResponse("Internal Server Error stripe checkout", {
      status: 500,
    });
  }
}
