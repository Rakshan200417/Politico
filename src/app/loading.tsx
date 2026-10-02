export default function Loading() {
  return (
    <div className="min-h-screen bg-white flex flex-col pointer-events-none select-none z-[9999] relative">
      <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 py-8 md:py-12 flex flex-col gap-10">
        
        {/* Top Banner Box - Light blue with dotted border */}
        <div className="w-full max-w-[970px] mx-auto h-[140px] md:h-[200px] bg-blue-50/40 border border-blue-200 border-dashed rounded-sm animate-pulse"></div>

        {/* 4 Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex flex-col gap-4">
              {/* Image Placeholder with Gradient */}
              <div className="w-full aspect-[4/3] sm:aspect-video lg:aspect-[4/3] bg-gradient-to-tr from-slate-100 to-slate-50 rounded-sm animate-pulse"></div>
              
              {/* Lines */}
              <div className="flex flex-col gap-2.5 px-1">
                <div className="w-1/3 h-2.5 bg-slate-100 rounded-sm animate-pulse"></div>
                <div className="w-full h-3.5 bg-slate-100 rounded-sm animate-pulse"></div>
                <div className="w-2/3 h-3.5 bg-slate-100 rounded-sm animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="w-full flex items-end justify-between gap-8 mt-12">
           {/* Left Line */}
           <div className="w-full border-b border-gray-400 pb-2 relative">
             <div className="w-24 h-5 bg-slate-100 rounded-sm animate-pulse absolute bottom-3 left-0"></div>
           </div>
           
           {/* Right Line */}
           <div className="w-full border-b border-gray-400 pb-2 relative">
             <div className="w-24 h-5 bg-slate-100 rounded-sm animate-pulse absolute bottom-3 left-0"></div>
           </div>
        </div>

      </div>
    </div>
  );
}
