import { SidebarMenuButton } from "@/components/ui/sidebar";
import { Car } from "lucide-react";

export default function UserSidebar() {
    return (
        <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <Car  className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">
                Taller Callajo
              </span>
              <span className="flex flex-row items-center gap-1 truncate text-xs"><div className="bg-green-400 w-2 h-2 rounded-full" />Conectado</span>
            </div>
          </SidebarMenuButton>
    )
}