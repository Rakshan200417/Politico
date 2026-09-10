import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { CheckCircle } from "lucide-react";

export default function NewsletterSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50">
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center p-8 lg:p-12">
        <div className="bg-white rounded-lg shadow-sm p-10 md:p-16 border border-gray-200 text-center max-w-2xl w-full">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">
            You are signed up successfully!
          </h1>
          <p className="text-gray-600 text-lg mb-10 leading-relaxed">
            Thank you for subscribing to our newsletters. The best of POLITICO will be delivered straight to your inbox soon.
          </p>
          <a 
            href="/"
            className="inline-block bg-[#ce1126] text-white font-bold text-[13px] uppercase tracking-wider px-10 py-4 hover:bg-[#a00c1c] transition-colors rounded-sm shadow-md"
          >
            Return to Homepage
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}
