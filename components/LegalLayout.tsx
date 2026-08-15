export function LegalLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <section className="bg-ink text-cream">
        <div className="wrap pt-14 pb-12 md:pt-20 md:pb-16">
          <div className="max-w-3xl">
            <p className="marker marker-light mb-6">Legal</p>
            <h1 className="display-lg text-cream">{title}</h1>
            <p className="text-cream/50 text-[0.66rem] tracking-tracksm uppercase mt-6">
              Last updated {updated}
            </p>
          </div>
        </div>
      </section>

      <section className="wrap-narrow section prose-mk">{children}</section>
    </>
  );
}
