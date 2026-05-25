export function LaptopFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full relative mx-auto my-12" style={{ maxWidth: '1000px' }}>
      {/* Laptop Screen */}
      <div className="relative bg-[#111111] rounded-t-[1.5rem] md:rounded-t-[2.5rem] border-[6px] md:border-[12px] border-[#111111] p-1 shadow-xl">
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#111111] z-20 flex justify-center items-center">
            <div className="w-1.5 h-1.5 rounded-full bg-[#333]"></div>
        </div>
        <div className="w-full h-[50vh] md:h-[65vh] bg-[#FDFBF7] rounded-[1rem] md:rounded-[1.5rem] overflow-hidden relative">
          {children}
        </div>
      </div>
      
      {/* Laptop Base */}
      <div className="relative bg-[#333] h-4 md:h-6 rounded-b-[1rem] md:rounded-b-[2rem] w-[110%] -left-[5%] shadow-2xl flex justify-center items-start">
        {/* Trackpad indentation */}
        <div className="w-[15%] h-3 md:h-4 bg-[#222] rounded-b-lg mt-0"></div>
      </div>
    </div>
  );
}