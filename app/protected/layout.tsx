import { AuthButton } from "@/components/auth-button";
import Link from "next/link";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 w-full flex flex-col items-center">
      <nav className="w-full h-16 border-b border-b-foreground/10">
        <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm mx-auto">
          <Link href="/protected" className="font-bold text-lg">Just Blogs </Link>
          <AuthButton />
        </div>
      </nav>
      <main className="flex-1 w-full max-w-5xl flex flex-col items-center p-6">
        {children}
      </main>
    </div>
  );
}