// pages/index.js
// Import React hook and Next.js router utility
import { useEffect } from "react";
import { useRouter } from "next/router";


/**
 * IndexRedirect Component
 *
 * This component serves as the default route ("/") for the application.
 * It automatically redirects users to the "/home" route upon visiting the base URL.
 *
 * Why use this:
 * - Keeps the root URL clean while delegating main logic to a dedicated Home page.
 * - Prevents unnecessary duplication of landing page content.
 *
 * Logic:
 * - Uses Next.js 'useRouter()' to access the router.
 * - On component mount ('useEffect' with empty deps), it redirects to "/home".
 *
 * Note:
 * - 'router.replace()' prevents the redirect from being added to browser history,
 *   so users won’t go back to "/" if they press the back button.
 */
export default function IndexRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/home");  // Redirect on initial load
  }, []);

   // Renders nothing — purely used for redirect logic
  return null;
}