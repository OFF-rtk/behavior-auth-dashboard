import { ArrowPathIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { lusitana } from "@/app/ui/fonts";
import { fetchUsers } from "@/app/lib/data";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

function formatRisk(risk: number | null) {
  if (typeof risk === "number") return risk.toFixed(2);
  return "N/A";
}


export default async function Users({ query }: { query?: string }) {
  const users = await fetchUsers();

  const filtered = query
    ? users.filter((user) =>
        user.user_id.toLowerCase().includes(query.toLowerCase())
      )
    : users;

  const sorted = filtered.sort((a, b) =>
    a.user_id.localeCompare(b.user_id)
  );

  return (
    <div className="flex w-full flex-col">
      <h2 className={`${lusitana.className} mb-4 text-2xl md:text-3xl`}>
        Users
      </h2>

      <div className="overflow-x-auto rounded-xl bg-gray-50 border border-gray-200">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-4 text-xs font-semibold uppercase tracking-wide text-gray-600 bg-gray-100 p-3 border-b">
          <p>User ID</p>
          <p>Model Status</p>
          <p>Last Trained</p>
          <p>Latest Risk</p>
        </div>

        <div className="flex flex-col divide-y divide-gray-200">
          {sorted.length === 0 ? (
            <p className="text-gray-500 text-sm p-4">
              No user data available.
            </p>
          ) : (
            sorted.map((user) => (
              <Link
                key={user.user_id}
                href={`/users/${user.user_id}`}
                className="hover:bg-sky-50 transition-colors"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 items-start md:items-center gap-2 p-4 text-sm md:text-base">
                  {/* User ID */}
                  <h3
                    className={`${lusitana.className} font-medium truncate text-gray-800`}
                  >
                    {user.user_id}
                  </h3>

                  {/* Model Status */}
                  <div className="flex flex-col">
                    <span
                      className={clsx(
                        "rounded px-2 py-1 w-fit text-xs font-semibold",
                        {
                          "bg-green-100 text-green-800": user.trained,
                          "bg-red-100 text-red-800": !user.trained,
                        }
                      )}
                    >
                      {user.trained ? "Trained" : "Not Trained"}
                    </span>
                    <span className="text-gray-500 text-xs">
                      Model v{user.model_version}
                    </span>
                  </div>

                  {/* Last Trained */}
                  <p className="text-gray-700">
                    {formatDistanceToNow(new Date(user.last_trained), {
                      addSuffix: true,
                    })}
                  </p>

                  {/* Risk */}
                  <p
                    className={clsx(
                      `${lusitana.className} font-medium`,
                      typeof user.latest_risk === "number"
                        ? user.latest_risk < 20
                          ? "text-green-700"
                          : user.latest_risk < 40
                          ? "text-yellow-600"
                          : user.latest_risk < 60
                          ? "text-orange-500"
                          : "text-red-600"
                        : "text-gray-400"
                    )}
                  >
                    {formatRisk(user.latest_risk)}
                  </p>

                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      <div className="flex items-center pt-6">
        <ArrowPathIcon className="h-5 w-5 text-gray-500" />
        <h3 className="ml-2 text-sm text-gray-500">Updated just now</h3>
      </div>
    </div>
  );
}
