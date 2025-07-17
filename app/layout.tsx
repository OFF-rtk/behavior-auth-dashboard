import "@/app/ui/global.css";
import { ToastContainer } from "react-toastify";
import SideNav from "@/app/ui/users/sidenav";
import "react-toastify/dist/ReactToastify.css";

export const metadata = {
  title: "BlackH Auth",
  icons: {
    icon: "/lock-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-gray-50 text-black">
        <div className="flex h-full">
          {/* Sidebar */}
          <SideNav />

          {/* Scrollable Main Content Area */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-white pt-[52px]">
            {children}
          </main>
        </div>

        <ToastContainer position="top-right" autoClose={3000} />
      </body>
    </html>
  );
}
