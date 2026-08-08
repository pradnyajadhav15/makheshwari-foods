import type { Metadata } from "next";
import { LegalLayout } from "@/components/LegalLayout";
import { EMAIL, FREE_SHIPPING_OVER } from "@/lib/products";

export const metadata: Metadata = { title: "Shipping and returns" };

export default function Shipping() {
  return (
    <LegalLayout title="Shipping and returns" updated="August 2026">
      <h2>Where we ship</h2>
      <p>We ship across India. Enter your PIN code at checkout to confirm serviceability. We do not currently ship internationally.</p>

      <h2>Shipping charges</h2>
      <p>Flat &#8377;49 on all orders. Free on orders above &#8377;{FREE_SHIPPING_OVER}.</p>

      <h2>Dispatch and delivery</h2>
      <p>Orders are dispatched within 2 working days. Delivery usually takes 3 to 7 working days depending on your location. You will receive tracking details once your order ships.</p>
      <p>We ship with reputed courier partners including Delhivery, Shiprocket and India Post depending on your location. Remote PIN codes may take a few days longer than the window above.</p>

      <h2>Returns on food products</h2>
      <p>Because this is a sealed food product, we cannot accept returns for change of mind, or where the pack has been opened.</p>

      <h2>When we will replace or refund</h2>
      <ul>
        <li>The pack arrived damaged, torn or leaking</li>
        <li>You received the wrong product or the wrong quantity</li>
        <li>The product was past its best-before date on arrival</li>
      </ul>
      <p>Contact us within 48 hours of delivery with photographs of the pack and the shipping label. If the claim is valid we will send a replacement or refund in full, and you will not pay return shipping.</p>

      <h2>Cancellations</h2>
      <p>You can cancel any order before it is dispatched by messaging us on WhatsApp. Once dispatched, an order cannot be cancelled.</p>

      <h2>Refund timeline</h2>
      <p>Approved refunds are processed within 5 to 7 working days to the original payment method. Your bank may take a few days more to reflect it.</p>

      <h2>Failed deliveries</h2>
      <p>If a parcel is returned to us because the address was incorrect or nobody was available after repeated attempts, we will refund the order value less shipping charges.</p>

      <h2>Contact</h2>
      <p><a href={`mailto:${EMAIL}`}>{EMAIL}</a><br />+91 7485 001 464</p>
    </LegalLayout>
  );
}