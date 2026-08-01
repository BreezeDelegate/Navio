import { SidebarTrigger } from '@/components/ui/sidebar';

export function AppHeader() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
      <SidebarTrigger className="md:hidden" />
      <div className="flex-1">
        <h1 className="font-headline text-lg font-semibold sm:text-xl">Navio</h1>
        <p className="hidden text-xs text-muted-foreground sm:block">
          Bot implementation brief builder
        </p>
      </div>
    </header>
  );
}
