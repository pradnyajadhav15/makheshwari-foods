export function AuthCard({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <section className="wrap section flex items-start justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <p className="marker marker-center mb-5">Account</p>
          <h1 className="display-md text-ink">{title}</h1>
          {subtitle && <p className="text-ink/60 body-text mt-3">{subtitle}</p>}
        </div>

        <div className="border border-ink/12 bg-paper p-6 sm:p-9">{children}</div>

        {footer && (
          <div className="text-center text-ink/60 body-text mt-7">{footer}</div>
        )}
      </div>
    </section>
  );
}

export const authInput = "field";
export const authBtn = "btn btn-primary btn-block";
export const authLink = "text-golddeep hover:text-ink transition underline underline-offset-2";
