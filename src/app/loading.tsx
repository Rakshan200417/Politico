export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-[9999]">
      <div className="relative flex items-center justify-center w-24 h-24">
        {/* The spinning circle */}
        <div className="absolute inset-0 rounded-full border-[3px] border-gray-100 border-t-[#ce1126] animate-spin"></div>
        {/* The logo inside */}
        <div className="flex items-center justify-center w-[72px] h-[72px] bg-white rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
          <span className="font-black tracking-[-0.04em] text-[#ce1126] uppercase text-4xl leading-none">
            P
          </span>
        </div>
      </div>
    </div>
  );
}
