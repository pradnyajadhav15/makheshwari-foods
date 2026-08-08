import type { Metadata } from "next";
import { LegalLayout } from "@/components/LegalLayout";
import { LEGAL_ENTITY, ADDRESS, EMAIL, FSSAI, GSTIN } from "@/lib/products";

export const metadata: Metadata = { title: "Terms of service" };

export default function Terms() {
  return (
    <LegalLayout title="Terms of service" updated="August 2026">
      <p>This website is operated by {LEGAL_ENTITY}, {ADDRESS}. By placing an order you agree to these terms.</p>

      <h2>Business details</h2>
      <p>FSSAI Licence No. {FSSAI}<br />GSTIN {GSTIN}</p>

      <h2>Products</h2>
      <p>We sell roasted makhana and related food products. Product photographs are indicative. Colour and appearance vary naturally between batches because this is an agricultural product.</p>

      <h2>Pricing</h2>
      <p>All prices are in Indian Rupees and inclusive of applicable taxes. We may change prices at any time, but the price shown at the moment you place your order is the price you pay.</p>

      <h2>Orders</h2>
      <p>An order is confirmed once payment is successfully processed. We may decline or cancel an order if a product is out of stock, if the delivery address is outside our serviceable area, or if we suspect fraud. In that case we refund in full.</p>

      <h2>Food safety</h2>
      <p>Please read the pack for ingredients, allergens, best-before date and storage instructions. Our products are packed in a facility that also handles nuts and milk products. Store in a cool dry place and reseal after opening.</p>

      <h2>Product claims</h2>
      <p>We describe our products factually. Nothing on this site is intended as medical or nutritional advice, and no product is offered as a treatment for any condition.</p>

      <h2>Intellectual property</h2>
      <p>The Makheshwari name, logo, packaging design, photographs and website content belong to us and may not be reproduced without written permission.</p>

      <h2>Liability</h2>
      <p>Our liability for any order is limited to the amount you paid for it. Nothing here limits rights you have under the Consumer Protection Act, 2019.</p>

      <h2>Governing law</h2>
      <p>These terms are governed by Indian law. Disputes are subject to the jurisdiction of the courts at Samastipur, Bihar.</p>

      <h2>Contact</h2>
      <p><a href={`mailto:${EMAIL}`}>{EMAIL}</a><br />+91 7485 001 464</p>
    </LegalLayout>
  );
}