export default function SplitReveal({ text, delay = 0, className = "" }: { text: string; delay?: number; className?: string }) {
  const lines = text.split("\n");
  let n = 0;

  return (
    <span className={className}>
      {lines.map((line, li) => (
        <span key={li} className="block">
          {line.split(" ").map((w, wi) => {
            const d = delay + n * 70;
            n += 1;
            return (
              <span key={`${li}-${wi}`} className="word" style={{ animationDelay: `${d}ms` }}>
                {w}
                {wi < line.split(" ").length - 1 ? "\u00A0" : ""}
              </span>
            );
          })}
        </span>
      ))}
    </span>
  );
}