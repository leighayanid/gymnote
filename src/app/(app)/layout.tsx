import { MobileNav } from "@/components/navigation/mobile-nav";
import { OfflineIndicator } from "@/components/pwa/offline-indicator";
import { InstallPrompt } from "@/components/pwa/install-prompt";
import { LocalDbProvider } from "@/components/providers/local-db-provider";
import { Toaster } from "@/components/ui/sonner";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <LocalDbProvider>
      <div className="flex min-h-screen flex-col bg-background">
        <OfflineIndicator />
        <main className="flex-1 pb-24">
          <div className="animate-fade-in-up" style={{ animationDuration: "0.4s" }}>
            {children}
          </div>
        </main>
        <MobileNav />
        <InstallPrompt />
        <Toaster position="top-center" />
      </div>
    </LocalDbProvider>
  );
}
