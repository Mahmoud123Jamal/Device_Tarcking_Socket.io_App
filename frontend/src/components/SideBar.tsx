import React from "react";
import UserCard from "./UserCard";
import type { SidebarProps } from "../types/SidebarProps";
import type { User } from "../types/User";

const Sidebar: React.FC<SidebarProps> = ({
  users,
  onSelectUser,
  selectedUserId,
  isOpen,
  setIsOpen,
  windowWidth,
}) => {
  const handleUserSelect = (user: User) => {
    if (!user.isMe) {
      onSelectUser(user);
      if (windowWidth < 768) setIsOpen(false);
    }
  };

  const handleClose = () => setIsOpen(false);

  return (
    <>
      <div
        className={`
                    fixed top-0 left-0 z-40 h-full w-4/5 max-w-xs md:static md:z-10 md:w-80
                    transition-transform duration-300 ease-in-out
                    ${isOpen ? "translate-x-0" : "-translate-x-full"}
                    bg-white shadow-2xl md:shadow-md border-r border-blue-200
                    p-5 rounded-r-2xl md:rounded-none flex flex-col
                `}
        style={{ height: "100vh" }}
      >
        <div className="flex justify-between items-center mb-5 shrink-0">
          <h2 className="text-xl font-bold text-green-700 italic tracking-tight">
            Active Devices
          </h2>
          {windowWidth < 768 && (
            <button
              className="bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-transform active:scale-90"
              onClick={handleClose}
              aria-label="Close sidebar"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
          {users.length > 1 ? (
            users.map((user) => (
              <div
                key={user.userId}
                onClick={() => handleUserSelect(user)}
                className={`
                                    ${user.isMe ? "hidden" : "block"}
                                    ${
                                      selectedUserId === user.userId
                                        ? "ring-2 ring-green-600 bg-green-50 scale-[1.02]"
                                        : "hover:bg-blue-50 cursor-pointer"
                                    }
                                    rounded-xl transition-all duration-200 shadow-sm
                                `}
              >
                <UserCard user={user} />
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-gray-400">
              <p className="text-sm">No other users in room</p>
            </div>
          )}
        </div>
      </div>

      {isOpen && windowWidth < 768 && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden transition-opacity"
          onClick={handleClose}
        />
      )}
    </>
  );
};

export default Sidebar;
