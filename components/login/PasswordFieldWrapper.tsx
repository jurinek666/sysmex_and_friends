"use client";

export function PasswordFieldWrapper() {
  // Always render the same structure, but use suppressHydrationWarning to ignore extension injections
  return (
    <div suppressHydrationWarning>
      <label htmlFor="password" className="sr-only">Heslo</label>
      <input
        id="password"
        name="password"
        type="password"
        required
        className="w-full px-3 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
        placeholder="Heslo"
        suppressHydrationWarning
      />
    </div>
  );
}
