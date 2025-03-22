import { Register } from '@/components/pages/register/Register.tsx';
import { useAppState } from '../../../hooks/useAppState.ts';
import Edit from '../../pages/edit/Edit.tsx';
import Home from '../../pages/home/Home.tsx';
import Search from '../../pages/search/Search.tsx';

export default function Content() {
  const { appState } = useAppState();
  switch (appState) {
    case 'home':
      return (
        <article className="flex flex-col w-full h-full p-12 bg-primary-foreground border border-sidebar-border rounded-md shadow-xl scroll-transparent overflow-y-scroll">
          <Home />
        </article>
      );
    case 'register':
      return (
        <article className="flex flex-col w-full h-full p-12 bg-primary-foreground border border-sidebar-border rounded-md shadow-xl scroll-transparent overflow-y-scroll">
          <Register />
        </article>
      );
    case 'search':
      return (
        <article className="flex flex-col w-full h-full p-12 bg-primary-foreground border border-sidebar-border rounded-md shadow-xl scroll-transparent overflow-y-scroll">
          <Search />
        </article>
      );
    case 'edit':
      return (
        <article className="flex flex-col w-full h-full bg-primary-foreground border border-sidebar-border rounded-md shadow-xl scroll-transparent overflow-y-scroll">
          <Edit />
        </article>
      );
    default:
      return (
        <article className="flex flex-col w-full h-full p-12 bg-primary-foreground border border-sidebar-border rounded-md shadow-xl scroll-transparent overflow-y-scroll">
          <Home />
        </article>
      );
  }
}
