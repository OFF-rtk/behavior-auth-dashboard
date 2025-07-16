import Users from "@/app/ui/users/users";
import { lusitana } from "@/app/ui/fonts";

import { Suspense } from "react";
import { UsersDataSkeleton } from "@/app/ui/skeletons";
import Search from "@/app/ui/search";

export default async function Page(props: {
    searchParams?: Promise<{query?: string;}>
}) {

    const searchParams = await props.searchParams;
    const query = searchParams?.query || '';
    return (
        <main className="min-h-screen">
            <h1 className={`${lusitana.className} mb-4 text-4xl md:text-5xl`}>
                Dashboard
            </h1>
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <Search placeholder="Search users..." />
            </div>
            <div className="mt-6 grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
                <Suspense fallback={<UsersDataSkeleton />} key="users-panel">
                    <Users query={query} />
                </Suspense>
            </div>
        </main>
    )
}