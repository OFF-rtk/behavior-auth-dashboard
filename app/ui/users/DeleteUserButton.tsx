"use client";

import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Description,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import { resetUserData } from "@/app/lib/data";
import { useRouter } from "next/navigation";

export default function DeleteUserCard({ user_id }: { user_id: string }) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isDeleted, setIsDeleted] = useState(false);
  const [deleteError, setDeleteError] = useState(false);
  const router = useRouter();

  const correctPhrase = `delete user ${user_id}'s data`;
  const isCorrect =
    inputValue.trim().toLowerCase() === correctPhrase.toLowerCase();

  const handleDelete = async () => {
    try {
      await resetUserData(user_id);
      setIsDeleted(true);
      setTimeout(() => {
        router.push("/users"); // ✅ Redirect to users page
      }, 2000); // Slight delay so toast can show
    } catch (error) {
      console.error("❌ Failed to delete user data:", error);
      setDeleteError(true);
    } finally {
      setOpen(false);
    }
  };

  useEffect(() => {
    if (isDeleted || deleteError) {
      const timer = setTimeout(() => {
        setIsDeleted(false);
        setDeleteError(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isDeleted, deleteError]);

  return (
    <>
      {/* Danger Zone Card */}
      <div className="rounded-xl bg-red-100 p-4 shadow-sm flex justify-between items-center mt-4">
        <div>
          <h3 className="text-md font-medium text-red-700">Danger Zone</h3>
          <p className="text-sm text-red-500">
            Deleting this user's data is permanent.
          </p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-1 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none"
        >
          <TrashIcon className="h-4 w-4" />
          Delete
        </button>
      </div>

      {/* Delete Modal */}
      <Transition show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setOpen(false)}>
          <div className="fixed inset-0 bg-black/30" />
          <div className="fixed inset-0 z-10 flex items-center justify-center p-4">
            <TransitionChild
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                <DialogTitle className="text-lg font-semibold text-gray-800">
                  Confirm Deletion
                </DialogTitle>
                <Description className="text-sm text-gray-500 mb-4">
                  This will permanently delete user{" "}
                  <span className="font-semibold text-black">{user_id}</span>'s data. This action
                  cannot be undone.
                </Description>

                <p className="text-sm mb-2 text-gray-600">
                  Please type{" "}
                  <span className="font-mono text-red-600 font-medium">
                    {correctPhrase}
                  </span>{" "}
                  to confirm:
                </p>

                <input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setOpen(false)}
                    className="rounded-md px-4 py-2 text-sm font-medium text-gray-600 hover:text-black"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={!isCorrect}
                    onClick={handleDelete}
                    className={`rounded-md px-4 py-2 text-sm font-medium ${
                      isCorrect
                        ? "bg-red-600 text-white hover:bg-red-700"
                        : "bg-red-200 text-red-400 cursor-not-allowed"
                    }`}
                  >
                    Delete
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>

      {/* ✅ Success Toast */}
      {isDeleted && (
        <div className="fixed bottom-4 right-4 z-50 rounded-lg bg-green-100 px-4 py-3 shadow-lg text-green-800 text-sm font-semibold animate-fade-in-out">
          ✅ Successfully deleted data for user{" "}
          <span className="font-mono">{user_id}</span>. Redirecting...
        </div>
      )}

      {/* ❌ Error Toast */}
      {deleteError && (
        <div className="fixed bottom-4 right-4 z-50 rounded-lg bg-red-100 px-4 py-3 shadow-lg text-red-800 text-sm font-semibold animate-fade-in-out">
          ❌ Failed to delete data for user{" "}
          <span className="font-mono">{user_id}</span>.
        </div>
      )}
    </>
  );
}
