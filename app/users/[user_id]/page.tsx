import { fetchUserSession } from "@/app/lib/data";
import RiskLogChart from "@/app/ui/users/RiskLogChart";
import BehavioralLog from "@/app/ui/users/BehavioralLog";
import Breadcrumbs from "@/app/ui/users/breadcrumbs";
import { Suspense } from "react";
import { RiskLogSkeleton, CardsSkeleton } from "@/app/ui/skeletons";
import CardWrapper from "@/app/ui/users/cards";
import DeleteUserDataButton from "@/app/ui/users/DeleteUserButton";

async function RiskSection({ userId }: { userId: string }) {
  const response = await fetchUserSession(userId);

  if ("message" in response) {
    return (
      <p className="text text-gray-400 p-4">No session data available.</p>
    );
  }

  return <RiskLogChart riskLog={response.risk_log} />;
}

async function BehavioralSection({ userId }: { userId: string }) {
  const response = await fetchUserSession(userId);

  if ("message" in response) {
    return (
      <p className="text text-gray-400 p-4">No session data available.</p>
    );
  }

  return <BehavioralLog sessions={response.sessions} />;
}

export default async function Page({
  params,
}: {
  params: Promise<{ user_id: string }>;
}) {
  const { user_id } = await params;

  return (
    <main className="h-[calc(100vh-52px)] md:h-full overflow-hidden flex flex-col">
      <div className="flex-1 overflow-y-auto px-4 md:px-0 pb-16">
        <Breadcrumbs
          breadcrumbs={[
            { label: "Users", href: "/users" },
            {
              label: `${user_id}`,
              href: `/users/${user_id}`,
              active: true,
            },
          ]}
        />

        <Suspense fallback={<RiskLogSkeleton />} key="risk-line-graph">
          <RiskSection userId={user_id} />
        </Suspense>

        <Suspense fallback={<RiskLogSkeleton />} key="behavior-line-graph">
          <BehavioralSection userId={user_id} />
        </Suspense>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Suspense fallback={<CardsSkeleton />}>
            <CardWrapper user_id={user_id} />
          </Suspense>
        </div>

        <div className="mt-6">
          <DeleteUserDataButton user_id={user_id} />
        </div>
      </div>
    </main>
  );
}
