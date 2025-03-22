import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useAppState } from '@/hooks/useAppState';

export default function MainSidebar({
  items,
}: {
  items: { title: string; state: string; icon: any }[];
}) {
  const { appState, setAppState } = useAppState();
  const handleClick = (state: string) => {
    setAppState(state);
  };
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Application</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                className={`${item.state === appState ? 'bg-sidebar-primary hover:bg-sidebar-primary text-sidebar-accent hover:text-sidebar-accent' : ''}`}
                asChild
              >
                <button onClick={() => handleClick(item.state)}>
                  <item.icon />
                  <span>{item.title}</span>
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
