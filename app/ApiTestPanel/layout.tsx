import { SelectedUserProvider } from "@/app/lib/context/SelectedUserContext";

export default function APITestLayout({ children }: { children: React.ReactNode }) {
  return (
    <SelectedUserProvider>
      {children}
    </SelectedUserProvider>
  );
}
