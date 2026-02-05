import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface AdminLayoutProps {
  title: string;
  children: React.ReactNode;
}

export function AdminLayout({ title, children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <Link 
            href="/admin" 
            className="inline-flex items-center text-gray-500 hover:text-blue-600 font-medium transition-colors bg-white px-4 py-2 rounded-full shadow-sm border"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Zpět na nástěnku
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors bg-white px-4 py-2 rounded-full shadow-sm border border-blue-100 hover:border-blue-200"
          >
            Přejít do aplikace
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-8 text-gray-900">{title}</h1>

        {children}
      </div>
    </div>
  );
}
