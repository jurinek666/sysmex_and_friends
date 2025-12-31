import { login } from "./actions";
import { PendingButton } from "@/components/ui/PendingButton";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Admin Přihlášení</h1>
          <p className="mt-2 text-sm text-gray-600">Sysmex & Friends</p>
        </div>
        
        <form className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Emailová adresa"
                suppressHydrationWarning
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Heslo</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Heslo"
                suppressHydrationWarning
              />
            </div>
          </div>

          <PendingButton
            formAction={login}
            className="w-full py-3 px-4 border border-transparent rounded-xl text-white bg-blue-600 hover:bg-blue-700 font-medium transition-colors"
          >
            Přihlásit se
          </PendingButton>
        </form>
      </div>
    </div>
  );
}