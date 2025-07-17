import Users from "@/app/ui/users/users";
import { lusitana } from "@/app/ui/fonts";
import { Suspense } from "react";
import { UsersDataSkeleton } from "@/app/ui/skeletons";
import Search from "@/app/ui/search";

export default async function Page({ searchParams }: {
  searchParams: Promise<{ query?: string }>;
}) {
  const { query = "" } = await searchParams;

  return (
    <main className="h-[calc(100vh-52px)] md:h-full overflow-hidden flex flex-col">
      {/* Page Title */}
      <div className="px-4 md:px-0">
        <h1 className={`${lusitana.className} mb-4 text-4xl md:text-5xl`}>
          Dashboard
        </h1>

        {/* Search bar */}
        <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
          <Search placeholder="Search users..." />
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto mt-4 px-4 md:px-0">
        <Suspense fallback={<UsersDataSkeleton />} key="users-panel">
          <Users query={query} />
        </Suspense>
      </div>
    </main>
  );
}
