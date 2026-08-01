import { AppHeader } from '@/app/components/app-header';
import { AppSidebar } from '@/app/components/app-sidebar';
import { Forge } from '@/app/components/forge';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { hasServerGeminiApiKey } from '@/lib/gemini-api-key';

export const dynamic = 'force-dynamic';

export default function Home() {
  const serverKeyAvailable = hasServerGeminiApiKey();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex h-svh flex-col bg-background">
          <AppHeader />
          <main className="flex-1 overflow-y-auto">
            <Forge serverKeyAvailable={serverKeyAvailable} />
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
