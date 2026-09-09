import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

export default function WriterDashboard() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50">
      <Header />
      
      <main className="flex-1 max-w-7xl w-full mx-auto p-8 lg:p-12">
        <div className="bg-white rounded-lg shadow-sm p-10 border border-gray-200 text-center mt-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Writer Dashboard</h1>
          <p className="text-gray-600 mb-8">
            Welcome to the Writer workspace. The article editor, drafts, and analytics tools will be added here once requirements are finalized.
          </p>
          <div className="inline-block bg-blue-50 text-blue-800 px-4 py-2 rounded-md text-sm border border-blue-200">
            Pending Instructions from Team Lead
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
