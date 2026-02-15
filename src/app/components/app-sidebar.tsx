import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Logo } from "@/app/components/icons";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-3">
          <Logo className="h-8 w-8 text-primary" />
          <h1 className="font-headline text-2xl font-semibold tracking-tighter">
            ModularAI Forge
          </h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {/* Navigation can be added here in the future */}
      </SidebarContent>
    </Sidebar>
  );
}
