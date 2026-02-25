import React from "react";
import type { UserCardProps } from "../types/userCard";

const UserCard: React.FC<UserCardProps> = ({ user }) => (
  <div className="p-4 bg-white border border-green-100 rounded-xl hover:bg-green-50 transition-colors shadow-sm cursor-pointer">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold shrink-0">
        {user.userId.charAt(0).toUpperCase()}
      </div>
      <div className="overflow-hidden">
        <h2 className="text-sm font-bold text-gray-800 truncate">
          ID: {user.userId.slice(0, 12)}...
        </h2>
        {user.distance ? (
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] font-medium px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
              {user.distance}
            </span>
            <span className="text-[10px] text-gray-400 font-medium">
              {user.eta}
            </span>
          </div>
        ) : (
          <p className="text-[10px] text-gray-400 italic">
            Calculating distance...
          </p>
        )}
      </div>
    </div>
  </div>
);

export default UserCard;
