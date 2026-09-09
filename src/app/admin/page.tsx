import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50">
      <Header />
      
      <main className="flex-1 max-w-7xl w-full mx-auto p-8 lg:p-12">
        <div className="bg-white rounded-lg shadow-sm p-10 border border-gray-200 text-center mt-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Admin Dashboard</h1>
          <p className="text-gray-600 mb-8">
            Welcome to the Admin workspace. System management tools, user controls, and publishing features will be added here once requirements are finalized.
          </p>
          <div className="inline-block bg-yellow-50 text-yellow-800 px-4 py-2 rounded-md text-sm border border-yellow-200">
            Pending Instructions from Team Lead
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
