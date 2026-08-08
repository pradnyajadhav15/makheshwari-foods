import type { Metadata } from "next";
import { LegalLayout } from "@/components/LegalLayout";
import { LEGAL_ENTITY, ADDRESS, EMAIL } from "@/lib/products";

export const metadata: Metadata = { title: "Privacy policy" };

export default function Privacy() {
  return (
    <LegalLayout title="Privacy policy" updated="August 2026">
      <p>This policy explains what information {LEGAL_ENTITY}, trading as Makheshwari Foods, collects when you use this website, why we collect it, and what we do with it.</p>

      <h2>What we collect</h2>
      <ul>
        <li>Name, email address, phone number and delivery address, when you place an order or contact us</li>
        <li>Order history and the contents of your cart</li>
        <li>Basic technical information such as browser type and pages visited</li>
      </ul>

      <h2>Payment information</h2>
      <p>We do not see or store your card, UPI or bank details. All payments are processed by Razorpay, which is PCI DSS compliant. We receive only a payment reference confirming the transaction succeeded.</p>

      <h2>Why we collect it</h2>
      <ul>
        <li>To pack and deliver your order</li>
        <li>To send order confirmations and delivery updates</li>
        <li>To answer questions you send us</li>
        <li>To meet tax and food safety record-keeping requirements</li>
      </ul>

      <h2>Who we share it with</h2>
      <p>We share the minimum necessary with our courier partner to deliver your order, and with Razorpay to process payment. We do not sell your information to anyone, and we do not share it for advertising.</p>

      <h2>Cookies</h2>
      <p>We use a small amount of browser storage to remember what is in your cart. It is not used to track you across other websites.</p>

      <h2>How long we keep it</h2>
      <p>Order records are kept as long as required under tax and food safety regulations. You can ask us to delete anything held beyond that.</p>

      <h2>Your rights</h2>
      <p>You can ask us what information we hold about you, ask us to correct it, or ask us to delete it. Write to <a href={`mailto:${EMAIL}`}>{EMAIL}</a> and we will respond within thirty days.</p>

      <h2>Contact</h2>
      <p>{LEGAL_ENTITY}<br />{ADDRESS}<br /><a href={`mailto:${EMAIL}`}>{EMAIL}</a><br />+91 7485 001 464</p>
    </LegalLayout>
  );
}