export function TypographyH1({ className = "", children, ...props }: React.ComponentProps<"h1">) {
  return (
    <h1
      className={`scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-4xl ${className}`}
      {...props}
    >
      {children}
    </h1>
  );
}
