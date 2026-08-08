import Link from "next/link";

export function AuthCard({ title, subtitle, children, footer }: { title: string; subtitle?: string; children: React.ReactNode; footer?: React.ReactNode }) {
  return (
    <section className="bg-cream px-6 py-20 min-h-[70vh] flex items-start justify-center">
      <div className="w-full max-w-md bg-white rounded-[1.75rem] border border-ink/10 p-9 md:p-11">
        <h1 className="font-display text-4xl text-ink text-center mb-3">{title}</h1>
        {subtitle && <p className="text-ink/55 font-light text-center mb-9">{subtitle}</p>}
        {children}
        {footer && <div className="text-center text-ink/55 text-sm font-light mt-8">{footer}</div>}
      </div>
    </section>
  );
}

export const authInput = "w-full bg-cream/60 border border-ink/15 rounded-xl px-5 py-4 text-sm text-ink placeholder:text-ink/35 focus:outline-none focus:border-gold transition";
export const authBtn = "w-full bg-ink text-cream rounded-full py-4 text-[11px] tracking-tracksm uppercase hover:bg-gold hover:text-ink transition disabled:opacity-50";
export const authLink = "text-gold hover:text-ink transition underline underline-offset-2";