import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RiHeartFill, RiChat3Line, RiArticleLine } from "react-icons/ri";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getEnv } from "@/helpers/getEnv";
import useFetch from "@/hooks/useFetch";
import Loading from "@/components/Loading";
import { Link } from "react-router-dom";

const Notifications = () => {
  const authState = useSelector((state) => state.user);
  const isLoggedIn = authState?.isLoggedIn === true;

  const { data: notifData, loading: notifLoading } = useFetch(
    isLoggedIn ? `${getEnv("VITE_API_BASE_URL")}/notification/get` : null,
    { method: "GET", credentials: "include" },
  );

  const { data: blogData, loading: blogsLoading } = useFetch(
    `${getEnv("VITE_API_BASE_URL")}/blogs/get-all`,
    { method: "GET", credentials: "include" },
  );

  if ((isLoggedIn && notifLoading) || blogsLoading) return <Loading />;

  const notifications = notifData?.notifications || [];
  const recentBlogs = Array.isArray(blogData)
    ? blogData.slice(0, 5)
    : (blogData?.blog || []).slice(0, 5);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-black tracking-tight text-black uppercase">
          Command Center
        </h1>
        <p className="text-xs text-slate-400 font-medium mt-1">
          Review your personal alerts and global network activity.
        </p>
      </div>

      <div className="space-y-8">
        {/* --- PERSONAL ALERTS SECTION --- */}
        <section>
          <h2 className="text-[10px] font-black tracking-[0.2em] text-red-600 uppercase mb-4 border-b border-slate-100 pb-2">
            Direct Alerts
          </h2>

          {!isLoggedIn ? (
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <p className="text-xs text-slate-500 font-bold">
                Secure Sign-In Required
              </p>
              <p className="text-[10px] text-slate-400 mt-1">
                Log in to view your personal interaction logs.
              </p>
            </div>
          ) : notifications.length > 0 ? (
            <div className="space-y-3">
              {notifications.map((notif) => (
                <div
                  key={notif._id}
                  className="flex items-start gap-3 p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-slate-300 transition-colors"
                >
                  <div className="mt-1">
                    {notif.type === "admire" ? (
                      <div className="p-1.5 bg-red-50 text-red-600 rounded-md border border-red-100">
                        <RiHeartFill className="text-sm" />
                      </div>
                    ) : (
                      <div className="p-1.5 bg-slate-900 text-white rounded-md">
                        <RiChat3Line className="text-sm" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-700 leading-relaxed">
                      <span className="font-bold text-black">
                        {notif.sender?.username}
                      </span>
                      {notif.type === "admire"
                        ? " admired your publication "
                        : " dropped a response on "}
                      <span className="font-bold italic text-slate-500">
                        "{notif.blog?.title}"
                      </span>
                    </p>
                    <span className="text-[10px] text-slate-400 font-medium block mt-1">
                      {new Date(notif.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">
              No personal alerts at this time.
            </p>
          )}
        </section>

        {/* --- GLOBAL RECENT BLOGS SECTION --- */}
        <section>
          <h2 className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase mb-4 border-b border-slate-100 pb-2">
            Network Global Feed
          </h2>

          <div className="space-y-3">
            {recentBlogs.map((blog) => (
              <Link
                key={blog._id}
                to={`/blogs/edit/${blog._id}`}
                className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 hover:bg-white hover:border-slate-200 rounded-xl transition-all group"
              >
                <div className="p-1.5 bg-white border border-slate-200 text-slate-400 rounded-md group-hover:text-black transition-colors">
                  <RiArticleLine className="text-sm" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-800 truncate group-hover:text-red-600 transition-colors">
                    {blog.title}
                  </h4>
                  <p className="text-[10px] text-slate-500 font-medium">
                    Published by {blog.author?.username || "Unknown"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Notifications;
