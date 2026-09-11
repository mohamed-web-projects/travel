import type { Metadata } from "next";
import { CheckoutWizard } from "@/components/checkout/CheckoutWizard";

export const metadata: Metadata = {
  title: "Checkout · REAORI Travel",
  description: "Book your REAORI journey — choose dates, travelers, add-ons and pay securely.",
};

interface Props {
  searchParams: Promise<{ d?: string }>;
}

export default async function CheckoutPage({ searchParams }: Props) {
  const { d } = await searchParams;
  return (
    <div className="relative mx-auto min-h-[calc(100vh-8rem)] max-w-7xl px-4 pb-24 pt-28 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Checkout</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Review every detail carefully — your advisor will confirm within a few hours.
        </p>
      </div>
      <CheckoutWizard slug={d} />
    </div>
  );
}