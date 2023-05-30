"use client";
import Modal from "./Modal";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Heading from "../Heading";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import axios from "axios";
// import toast from "react-hot-toast";
import usePaymentModal from "@/app/hooks/usePaymentModal";

const PaymentModal = () => {
  const router = useRouter();
  const rentModal = usePaymentModal();

  const [isLoading, setIsLoading] = useState(false);

  const stripe = useStripe();

  const elements = useElements();

  const handleSubmit = async () => {
    const cardElement = elements?.getElement("card");

    try {
      if (!stripe || !cardElement) return null;
      const { data } = await axios.post("/api/payment", {
        data: { amount: 89 },
      });
      const clientSecret = data;

      await stripe?.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      });
    } catch (error) {
      console.log(error);
    }
  };

  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading
        title="Which of these best describes your place?"
        subtitle="Pick a category"
      />
      <CardElement />
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={rentModal.isOpen}
      title="Airbnb your home!"
      actionLabel="Complete your Payment"
      onSubmit={handleSubmit}
      //   secondaryActionLabel={secondaryActionLabel}
      //   secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
      onClose={rentModal.onClose}
      body={bodyContent}
    />
  );
};

export default PaymentModal;
