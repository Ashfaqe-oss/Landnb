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


    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2022-11-15"
    });
    // let data = await req.json();
    // let price = data.price;
    // const session = await stripe.checkout.sessions.create({
    //   line_items: [
    //     {
    //       price: price,
    //       quantity: 1,
    //     },
    //   ],
      // mode: "payment",
      // success_url: "http://localhost:3000",
      // cancel_url: "http://localhost:3000",
    // });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: price,
      currency: "inr",
      automatic_payment_methods: {
        enabled: true,
      },
      // mode: "payment",
      // success_url: "http://localhost:3000",
      // cancel_url: "http://localhost:3000",

    });

    return NextResponse.json(paymentIntent.client_secret);
  } catch (error: any) {
    console.log("Error in POST", { error });
    return new NextResponse("Internal Server Error stripe checkout", {
      status: 500,
    });
  }
}
