import Image from "next/image";

const SHOTS = [
  { src: "/facility/1.jpg", caption: "" },
  { src: "/facility/2.jpg", caption: "" },
  { src: "/facility/3.jpg", caption: "" },
  { src: "/facility/4.jpg", caption: "" },
  { src: "/facility/5.jpg", caption: "" },
  { src: "/facility/6.jpg", caption: "" },
  { src: "/facility/7.jpg", caption: "" },
  { src: "/facility/8.jpg", caption: "" },
  { src: "/facility/9.jpg", caption: "" },
  { src: "/facility/10.jpg", caption: "" },
];

export default function FacilityStrip() {
  return (
    <section className="section-sm overflow-hidden">
      <div className="wrap mb-8 md:mb-10">
        <div className="max-w-xl">
          <p className="marker mb-5">Inside the unit</p>
          <h2 className="display-md text-ink">Where your order is packed.</h2>
          <p className="text-ink/70 body-text mt-4">Our roastery in Samastipur, Bihar.</p>
        </div>
      </div>

      <div className="facility-rail group">
        <div className="facility-track">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex shrink-0" aria-hidden={dup === 1}>
              {SHOTS.map((s) => (
                <figure key={s.src} className="shrink-0 w-[70vw] sm:w-[20rem] md:w-[23rem] mr-4 md:mr-6">
                  <div className="relative aspect-[4/3] overflow-hidden bg-sandsoft">
                    <Image src={s.src} alt={s.caption || "Makheshwari Foods roastery, Samastipur"} fill sizes="(max-width: 640px) 70vw, 23rem" loading="lazy" className="object-cover" />
                  </div>
                  {s.caption && (
                    <figcaption className="text-ink/70 text-[0.7rem] tracking-tracksm uppercase mt-3.5">{s.caption}</figcaption>
                  )}
                </figure>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
