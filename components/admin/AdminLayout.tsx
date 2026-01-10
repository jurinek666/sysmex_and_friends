import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface AdminLayoutProps {
  title: string;
  children: React.ReactNode;
}

export function AdminLayout({ title, children }: AdminLayoutProps) {
  return (
    <div className="max-w-4xl mx-auto px-6 py-24">
      <div className="mb-8">
        <Link 
          href="/admin" 
          className="inline-flex items-center text-gray-500 hover:text-blue-600 font-medium transition-colors bg-white px-4 py-2 rounded-full shadow-sm border"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Zpět na nástěnku
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-8">{title}</h1>

      {children}
    </div>
  );
}
