import { type ReactNode } from "react";

interface RootLayoutProps {
  children: ReactNode;
}

function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="p-4 bg-sky-800 text-white text-center shadow-md">
        <h1 className="text-2xl font-bold tracking-tight">WhereAmI</h1>
      </header>

      <main>{children}</main>
      <footer className="p-4 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} WhereAmI Tracker
      </footer>
    </div>
  );
}

export default RootLayout;
