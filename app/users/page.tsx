import Users from "@/app/ui/users/users";
import { lusitana } from "@/app/ui/fonts";
import { Suspense } from "react";
import { UsersDataSkeleton } from "@/app/ui/skeletons";
import Search from "@/app/ui/search";

export default async function Page(props: {
  searchParams?: Promise<{ query?: string }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <h1 className={`${lusitana.className} mb-4 text-4xl md:text-5xl`}>
        Dashboard
      </h1>

      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search users..." />
      </div>

      <div className="mt-6 flex-1 overflow-y-auto">
        <Suspense fallback={<UsersDataSkeleton />} key="users-panel">
          <Users query={query} />
        </Suspense>
      </div>
    </div>
  );
}
