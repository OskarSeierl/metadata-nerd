import { Outlet } from "react-router-dom";
import { TitleBar } from './TitleBar';

export function Layout() {
  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <TitleBar />
      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}

