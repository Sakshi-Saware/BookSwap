// src/components/CafeLayout.jsx
import CafeSidebar from "./CafeSidebar";
import CafeHeader from "./CafeHeader";

export default function CafeLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8f5f0]">
      
      {/* TOP BAR */}
      <CafeHeader />

      {/* MAIN CONTENT AREA */}
      <div className="ml-64 flex-1 flex flex-col">
        
        {/* SIDEBAR */}
        <CafeSidebar />

        {/* CONTENT */}
        <main className="flex-1 p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
