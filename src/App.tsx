import './App.css';
import Container from './components/layout/container/Container.tsx';
import { AppSidebar } from './components/layout/sidebar/app-sidebar.tsx';
import { SidebarInset, SidebarProvider } from './components/ui/sidebar.tsx';

function App() {
  return (
    <main className="flex flex-row w-screen h-screen overflow-hidden bg-background">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="flex flex-col w-full h-full overflow-hidden">
          <Container />
        </SidebarInset>
      </SidebarProvider>
    </main>
  );
}

export default App;
