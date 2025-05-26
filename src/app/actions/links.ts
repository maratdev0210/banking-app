// Navigation links that are displayed on the page depending on the user's auth state

import { NAVIGATION_PUBLIC, NAVIGATION_PRIVATE } from "@/types/links";
import { decrypt } from "@/lib/session";
import { cookies } from "next/headers";

export default async function retrieveLinks() {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  if (!session?.userId) {
    return NAVIGATION_PUBLIC;
  }

  return NAVIGATION_PRIVATE;
}
