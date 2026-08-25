# Motion layer

One component and one hook. No dependencies.

`components/Reveal.tsx` (the project's existing primitive) handles staggered
scroll reveals - product grid, the 01-06 list, recipe cards. It stays. This
folder only adds the masked heading treatment.

## ClipHeading

Section headlines slide up from behind their own baseline. `lines` is an array -
one entry per visual line, so you control the break instead of the browser.

```tsx
import ClipHeading from "@/components/motion/ClipHeading";

<ClipHeading
  className="display-lg text-ink"
  lines={["Three flavours,", "one honest crunch."]}
  delay={90}
/>
```

Where the old markup had `<br />`, pass two array entries - the hard break is
preserved at every breakpoint. Where it did not, pass a single entry and let it
wrap naturally.

Defaults to `h2`. Pass `as="h1"` or `as="p"` if a section needs something else.

### Where it is used

Only the five `display-lg` section headlines on the homepage. The `display-md`
blocks (marketplaces, bulk) keep the plain `Reveal` entrance - if every heading
gets the mask, none of them read as special.

### Do not put it on the hero h1

`HeroVideo` owns the top of the page and its heading is the LCP element.
Starting it at `translateY(110%)` costs real Lighthouse points.

### Do not nest it inside a Reveal

Both would animate the same text - a 16px parent rise compounding with the mask
reads as muddy rather than deliberate. Wrap the eyebrow and lede in `Reveal`
with staggered delays, and let ClipHeading trigger itself.

## Tuning

- `stagger` 90ms between heading lines. Above ~120ms it drags.
- Easing is `cubic-bezier(0.16, 1, 0.3, 1)` - fast out, long tail, no bounce.
  Change it in one place: `.mk-lines .mk-line > span` in globals.css.

## Reduced motion

Handled twice - `useInView` returns `inView: true` immediately when the media
query matches, and the CSS force-resets opacity and transform. The override now
also covers the existing `.reveal` class, which had no reduced-motion path
before.