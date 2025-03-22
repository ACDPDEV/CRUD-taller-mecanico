import { SidebarGroup, SidebarTrigger } from '@/components/ui/sidebar';
import { ModeToggle } from '@/components/ui/theme';

export default function ActionsSidebar() {
  return (
    <SidebarGroup className="flex flex-row items-center justify-center gap-2 [[data-side=left][data-state=collapsed]_&]:flex-col transition-transform">
      <SidebarTrigger className="border" />
      <ModeToggle />
    </SidebarGroup>
  );
}
