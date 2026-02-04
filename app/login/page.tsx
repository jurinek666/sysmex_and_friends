"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      router.push("/tym/dashboard");
      router.refresh();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || "Došlo k chybě při přihlášení.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <div className="max-w-md w-full bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-800">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Členská sekce</h1>
          <p className="text-gray-400">Přihlaste se pro přístup k týmovým funkcím.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-900/50 rounded-lg text-red-200 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-cyan focus:border-transparent transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Heslo
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-cyan focus:border-transparent transition-all"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-neon-cyan hover:bg-cyan-400 text-black font-bold rounded-lg transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2 h-5 w-5" />
                Přihlašování...
              </>
            ) : (
              "Přihlásit se"
            )}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-gray-800 pt-6">
          <p className="text-gray-500 text-sm">
            Nemáte účet? <Link href="/onas" className="text-neon-cyan hover:underline">Kontaktujte nás</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
