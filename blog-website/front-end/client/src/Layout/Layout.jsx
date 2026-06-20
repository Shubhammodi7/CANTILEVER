import React from "react";
import { Outlet } from "react-router-dom";
import { Topbar } from "@/components/Topbar";
import { AppSidebar } from "@/components/AppSidebar";
import { Footer } from "@/components/footer";
import { SidebarProvider } from "@/components/ui/sidebar";

export const Layout = () => {
  return (
    <SidebarProvider defaultOpen={true}>
      {/* AppSidebar sits perfectly as a direct child of the provider */}
      <AppSidebar />

      {/* Main viewport area grows dynamically and pushes away from the sidebar on desktop */}
      <div className="flex flex-col flex-1 min-w-0 min-h-screen bg-white">
        <Topbar />

        {/* pt-24 ensures your index texts never hide behind your sticky Topbar */}
        <main className="flex-1 p-6 md:p-8 pt-24">
          <Outlet />
        </main>

        <Footer />
      </div>
    </SidebarProvider>
  );
};
