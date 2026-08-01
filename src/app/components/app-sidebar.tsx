import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from '@/components/ui/sidebar';
import { Logo } from '@/app/components/icons';

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-3">
          <Logo className="h-8 w-8 text-primary" />
          <div>
            <h1 className="font-headline text-2xl font-semibold tracking-tight">Navio</h1>
            <p className="text-xs text-muted-foreground">Idea to build brief</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-4">
        <div className="space-y-4 text-sm">
          <div>
            <p className="font-medium">1. Describe</p>
            <p className="text-muted-foreground">Define the idea, users and boundaries.</p>
          </div>
          <div>
            <p className="font-medium">2. Generate</p>
            <p className="text-muted-foreground">Create an implementation-ready first version.</p>
          </div>
          <div>
            <p className="font-medium">3. Build</p>
            <p className="text-muted-foreground">Use the setup steps and acceptance criteria.</p>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
