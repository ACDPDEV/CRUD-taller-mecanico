import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from '@/components/ui/sidebar';
import { Home, PenSquare, PlusCircle, Search } from 'lucide-react';
import ActionsSidebar from './actions-sidebar';
import MainSidebar from './main-sidebar';
import UserSidebar from './user-sidebar';

const items = [
  {
    title: 'Inicio',
    state: 'home',
    icon: Home,
  },
  {
    title: 'Buscar',
    state: 'search',
    icon: Search,
  },
  {
    title: 'Registrar',
    state: 'register',
    icon: PlusCircle,
  },
  {
    title: 'Editar',
    state: 'edit',
    icon: PenSquare,
  },
];

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarHeader>
          <UserSidebar />
        </SidebarHeader>
        <SidebarContent>
          <MainSidebar items={items} />
        </SidebarContent>
        <SidebarFooter>
          <ActionsSidebar />
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}
