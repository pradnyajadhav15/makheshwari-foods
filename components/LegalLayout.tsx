export function LegalLayout({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <>
      <section className="bg-ink px-6 md:px-14 py-16 text-center">
        <h1 className="font-display text-cream text-4xl md:text-5xl mb-4">{title}</h1>
        <p className="text-cream/50 text-[11px] tracking-tracksm uppercase">Last updated {updated}</p>
      </section>
      <section className="bg-cream px-6 md:px-14 py-16">
        <div className="max-w-3xl mx-auto space-y-8 text-ink/70 font-light leading-relaxed [&_h2]:font-display [&_h2]:text-2xl [&_h2]:text-ink [&_h2]:mb-3 [&_h2]:mt-10 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_a]:text-gold [&_a]:underline">
          {children}
        </div>
      </section>
    </>
  );
}