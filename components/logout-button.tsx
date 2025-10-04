"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient(); // ✅ call the function to get the client
    const { error } = await supabase.auth.signOut(); // now sign out

    if (error) {
      console.error("Logout error:", error.message);
      return;
    }

    router.push("/auth/login");
  };

  return <Button onClick={logout}>Logout</Button>;
}
