import { redirect } from "next/navigation";

export default function HomePage() {
  // The root page redirects — users should arrive via /responder/[token]
  redirect("/responder/demo");
}
