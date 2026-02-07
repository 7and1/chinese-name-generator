import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

// This is the root layout, but since we use [locale] routing,
// the html/body tags are provided by the [locale]/layout.tsx
export default function RootLayout({ children }: Props) {
  return children;
}
