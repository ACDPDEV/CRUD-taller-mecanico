import { SidebarTrigger } from '@/components/ui/sidebar.tsx';
import { useIsMobile } from '@/hooks/use-mobile';
import Content from './Content.tsx';

export default function Container() {
  return (
    <main className="flex w-full h-full p-4 overflow-hidden">
      {useIsMobile() ? <SidebarTrigger className="fixed top-0 left-0" /> : null}
      <Content />
    </main>
  );
}
