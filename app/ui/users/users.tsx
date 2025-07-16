import { ArrowPathIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { lusitana } from "@/app/ui/fonts";
import { fetchUsers } from "@/app/lib/data";
import { formatDistanceToNow } from 'date-fns';
import Link from "next/link";

export default async function Users({query}: {query?: string}) {

    const users = await fetchUsers()

    const filtered = query ? users.filter((user)=>
      user.user_id.toLowerCase().includes(query.toLowerCase())
    ) : users

    return (
    <div className="flex w-full flex-col md:col-span-4">
      <h2 className={`${lusitana.className} mb-4 text-2xl md:text-3xl`}>
        Users
      </h2>
      <div className="flex flex-col justify-between rounded-xl bg-gray-50 p-4">
        {filtered.length === 0 ? (
            <p className="text-gray-500 text-sm">No user data available.</p>
        ) : (
          filtered.map((user, i) => (
  <Link 
    key={user.user_id} 
    href={`/users/${user.user_id}`}
    className={clsx(
      'flex flex-row grow items-center justify-around gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-around md:p-2 md:px-3',
      { 'border-t border-gray-200 mt-2 pt-4': i !== 0 } // Add spacing between cards
    )}
  >
    <div className="flex flex-row items-center justify-between w-full">
      <h3 className={`${lusitana.className} text-lg font-medium md:text-2xl`}>
        {user.user_id}
      </h3>

      <div className="flex items-center justify-around">
        <div className="min-w-0">
          <p
            className={clsx(`truncate text-center text-sm font-semibold md:text-base`, {
              'bg-green-100 text-green-800': user.trained,
              'bg-red-100 text-red-800': !user.trained,
            })}
          >
            {user.trained ? 'Trained' : 'Not Trained'}
          </p>
          <p className="hidden text-sm text-gray-500 sm:block">
            Model v{user.model_version}
          </p>
        </div>
      </div>

      <p className={`${lusitana.className} truncate text-sm font-medium md:text-base`}>
        {formatDistanceToNow(new Date(user.last_trained), { addSuffix: true })}
      </p>
      <p className={`${lusitana.className} text-sm font-medium md:text-base`}>
        {user.latest_risk.toFixed(2)}
      </p>
    </div>
  </Link>
))

          )}
        </div>
        <div className="flex items-center pb-2 pt-6">
          <ArrowPathIcon className="h-5 w-5 text-gray-500" />
          <h3 className="ml-2 text-sm text-gray-500 ">Updated just now</h3> 
      </div>
    </div>
  );
}