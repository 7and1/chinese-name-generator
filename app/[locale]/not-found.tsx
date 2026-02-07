import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold">Page not found</h1>
      <p className="mt-2 text-muted-foreground">
        The page you are looking for doesn’t exist.
      </p>
      <div className="mt-6">
        <Link
          href="/"
          className="rounded-md border px-4 py-2 text-sm hover:bg-muted/40"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
