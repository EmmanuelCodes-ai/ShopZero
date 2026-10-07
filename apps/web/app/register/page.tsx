"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/login?tab=register");
  }, [router]);

  return <div style={{ padding: "40px", textAlign: "center" }}>Redirecting to registration...</div>;
}
