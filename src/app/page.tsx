import { AppHeader } from "@/app/components/app-header";
import { AppSidebar } from "@/app/components/app-sidebar";
import { Forge } from "@/app/components/forge";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function Home() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-col h-svh bg-background">
          <AppHeader />
          <main className="flex-1 overflow-y-auto">
            <Forge />
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
