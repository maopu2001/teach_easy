"use client";

import Image from "next/image";

export const Bkash = () => {
  return <Image src="/icons/bkash.svg" alt="bKash" height={80} width={120} />;
};

export const Nagad = () => {
  return <Image src="/icons/nagad.svg" alt="Nagad" height={80} width={120} />;
};

export const CreditCard = () => {
  return <Image src="/icons/card.svg" alt="Card" height={80} width={120} />;
};

export const COD = () => {
  return (
    <Image
      className="mx-auto"
      height={80}
      width={80}
      src="/icons/cod.png"
      alt="Cash on Delivery"
    />
  );
};
