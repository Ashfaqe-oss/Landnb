import { getURL } from "@/app/helpers/stripe-url";
import { stripe } from "@/app/libs/stripe";
import { headers, cookies } from "next/headers";
import { NextResponse } from 'next/server';

export default async function POST(
    req: Request,
) {
    const {price} = await req.json()

    try {

        console.log(price)

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            billing_address_collection: 'required',
            line_items: [
              {
                price: price,
              }
            ],
            mode: 'subscription',
            allow_promotion_codes: true,
            subscription_data: {
              trial_from_plan: true,
            },
            success_url: `${getURL()}/account`,
            cancel_url: `${getURL()}/`
          });

          console.log(session.id)
      
          return NextResponse.json({ sessionId: session.id });

    } catch (error: any) {
        console.log('Error in POST', { error });
        return new NextResponse('Internal Server Error stripe checkout', { status: 500 });
    }
} 

