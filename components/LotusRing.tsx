type Props = { cycles?: number };

function Lotus() {
  return (
    <g>
      <path d="M0 0 Q-26 -10 -30 -30 Q-14 -24 0 0 Z" fill="#EFC9BE" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
      <path d="M0 0 Q26 -10 30 -30 Q14 -24 0 0 Z" fill="#EFC9BE" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
      <path d="M0 0 Q-16 -18 -17 -42 Q-6 -26 0 0 Z" fill="#F6E0D4" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
      <path d="M0 0 Q16 -18 17 -42 Q6 -26 0 0 Z" fill="#F6E0D4" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
      <path d="M0 0 Q-9 -24 0 -50 Q9 -24 0 0 Z" fill="#FBF1E6" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
    </g>
  );
}

function Pod() {
  return (
    <g>
      <path d="M0 -2 Q-13 -20 0 -48 Q13 -20 0 -2 Z" fill="#E3B23C" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <circle cx="0" cy="-14" r="4.6" fill="#FBF3E6" stroke="currentColor" strokeWidth="0.7" />
      <circle cx="0" cy="-25" r="4.6" fill="#FBF3E6" stroke="currentColor" strokeWidth="0.7" />
      <circle cx="0" cy="-36" r="4" fill="#FBF3E6" stroke="currentColor" strokeWidth="0.7" />
    </g>
  );
}

function Pad() {
  return (
    <g>
      <path d="M0 -14 L13 -3 A19 19 0 1 0 13 -25 Z" fill="#4F7C42" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M0 -14 L-14 -14 M0 -14 L-9 -26 M0 -14 L-9 -2" stroke="#2E5227" strokeWidth="0.9" opacity="0.6" fill="none" />
    </g>
  );
}

function Puff() {
  return (
    <g>
      <circle cx="-9" cy="-13" r="9.5" fill="#FBF3E6" stroke="currentColor" strokeWidth="1.1" />
      <circle cx="9" cy="-15" r="8.5" fill="#FBF3E6" stroke="currentColor" strokeWidth="1.1" />
      <circle cx="0" cy="-29" r="10" fill="#FDF8F0" stroke="currentColor" strokeWidth="1.1" />
      <circle cx="-2" cy="-31" r="1.7" fill="#6B4A2A" />
      <circle cx="-11" cy="-15" r="1.4" fill="#6B4A2A" />
      <circle cx="11" cy="-17" r="1.3" fill="#6B4A2A" />
    </g>
  );
}

const ORDER = [Lotus, Pod, Pad, Puff];

export default function LotusRing({ cycles = 2 }: Props) {
  const count = ORDER.length * cycles;
  const step = 360 / count;

  return (
    <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
      <circle cx="200" cy="200" r="150" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.45" />
      <circle cx="200" cy="200" r="156" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.25" />

      {Array.from({ length: count }).map((_, i) => (
        <g key={`d-${i}`} transform={`rotate(${i * step + step / 2} 200 200) translate(200 40)`}>
          <path d="M0 -14 Q-5 -22 0 -30 Q5 -22 0 -14 Z" fill="#E3B23C" stroke="currentColor" strokeWidth="0.8" opacity="0.85" />
        </g>
      ))}

      {Array.from({ length: count }).map((_, i) => {
        const Motif = ORDER[i % ORDER.length];
        return (
          <g key={`m-${i}`} transform={`rotate(${i * step} 200 200) translate(200 40) scale(0.8)`}>
            <Motif />
          </g>
        );
      })}
    </svg>
  );
}