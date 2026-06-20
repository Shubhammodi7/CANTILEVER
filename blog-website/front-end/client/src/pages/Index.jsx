import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  RiHeartLine,
  RiHeartFill,
  RiChat3Line,
  RiEditLine,
  RiDeleteBin6Line,
  RiCalendarLine,
  RiCompass3Line,
  RiCloseLine,
  RiZoomInLine,
  RiFireLine,
  RiSparklingLine,
  RiNotification3Line,
  RiLockPasswordLine,
} from "react-icons/ri";
import { GoDot } from "react-icons/go";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import Loading from "@/components/Loading";
import { getEnv } from "@/helpers/getEnv";
import useFetch from "@/hooks/useFetch";
import { deleteData } from "@/helpers/handleDelete";
import { showToast } from "@/helpers/showToast";
import { RouteBlogAdd } from "@/helpers/RouteName";

import ConfirmDelete from "@/components/ConfirmDelete";
import ResponseDetails from "@/components/ResponseDetails";

const fetchOptions = {
  method: "GET",
  credentials: "include",
};

const Index = () => {
  const [refreshData, setRefreshData] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [expandedPosts, setExpandedPosts] = useState({});
  const [admiredPosts, setAdmiredPosts] = useState({});

  const [openResponses, setOpenResponses] = useState({});

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const debounceTimers = useRef({});
  const [popupImage, setPopupImage] = useState(null);

  const [pingTime, setPingTime] = useState(24);
  const [cpuUsage, setCpuUsage] = useState(12);

  const authState = useSelector((state) => state.user);
  const isLoggedIn = authState?.isLoggedIn === true;
  const loggedInUser = authState?.user;

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });

    const interval = setInterval(() => {
      setPingTime(Math.floor(Math.random() * (32 - 18 + 1)) + 18);
      setCpuUsage(Math.floor(Math.random() * (19 - 8 + 1)) + 8);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setPopupImage(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const userId = loggedInUser?._id || loggedInUser?.id;

  let fetchUrl = `${getEnv("VITE_API_BASE_URL")}/blogs/get-all?refresh=${refreshData}`;
  if (isLoggedIn && userId && userId !== "undefined") {
    fetchUrl = `${getEnv("VITE_API_BASE_URL")}/blogs/get/${userId}?refresh=${refreshData}`;
  }

  const { data: blogData, loading: blogsLoading } = useFetch(
    fetchUrl,
    fetchOptions,
  );

  const { data: categoryData, loading: catLoading } = useFetch(
    `${getEnv("VITE_API_BASE_URL")}/category/all-category`,
    fetchOptions,
  );

  const allPosts = isLoggedIn
    ? Array.isArray(blogData)
      ? blogData
      : blogData?.blog || blogData?.posts || blogData?.data || []
    : [];

  const categoriesList = categoryData?.categories || [];

  const filteredPosts = allPosts.filter((post) => {
    if (selectedCategory === "ALL") return true;
    const postCategoryId = post.category?._id || post.category;
    return postCategoryId === selectedCategory;
  });

  const trendingPosts = [...allPosts]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  const realNotifications = allPosts
    .filter((post) => post.admires && post.admires.length > 0)
    .sort((a, b) => b.admires.length - a.admires.length)
    .slice(0, 10)
    .map((post) => ({
      id: post._id,
      type: "admire",
      postTitle: post.title,
      count: post.admires.length,
      time: new Date(post.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
    }));

  const triggerDeletePrompt = (id) => {
    setItemToDelete(id);
    setDeleteModalOpen(true);
  };

  const executeFinalDelete = async () => {
    if (!itemToDelete) return;
    setDeleteModalOpen(false);

    const isDeleted = await deleteData(
      `${getEnv("VITE_API_BASE_URL")}/blogs/delete/${itemToDelete}`,
    );
    if (isDeleted) {
      setRefreshData((prev) => !prev);
      showToast("success", "Article dropped successfully.");
    } else {
      showToast("error", "Authorization token validation rejected access.");
    }
    setItemToDelete(null);
  };

  const toggleContentExpansion = (postId) => {
    setExpandedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const toggleResponseDrawer = (blogId) => {
    setOpenResponses((prev) => ({ ...prev, [blogId]: !prev[blogId] }));
  };

  const toggleAdmireState = async (blogId) => {
    const isCurrentlyAdmired = admiredPosts[blogId];
    setAdmiredPosts((prev) => ({ ...prev, [blogId]: !isCurrentlyAdmired }));

    showToast(
      !isCurrentlyAdmired ? "success" : "info",
      !isCurrentlyAdmired
        ? "Added to admired reading logs."
        : "Removed from admiration stack.",
    );

    if (debounceTimers.current[blogId]) {
      clearTimeout(debounceTimers.current[blogId]);
    }

    debounceTimers.current[blogId] = setTimeout(async () => {
      try {
        const response = await fetch(
          `${getEnv("VITE_API_BASE_URL")}/blogs/admires/${blogId}`,
          {
            method: "PUT",
            credentials: "include",
          },
        );

        if (!response.ok) {
          throw new Error("Failed to sync state.");
        }

        delete debounceTimers.current[blogId];
      } catch (error) {
        setAdmiredPosts((prev) => ({ ...prev, [blogId]: isCurrentlyAdmired }));
        showToast(
          "error",
          "Connection lost. Could not verify admiration action.",
        );
      }
    }, 500);
  };

  useEffect(() => {
    if (allPosts.length > 0 && loggedInUser) {
      const userId = loggedInUser._id || loggedInUser.id;
      const initialAdmiredState = {};

      allPosts.forEach((post) => {
        if (Array.isArray(post.admires)) {
          initialAdmiredState[post._id] = post.admires.some(
            (admire) => (admire._id || admire).toString() === userId.toString(),
          );
        }
      });

      setAdmiredPosts(initialAdmiredState);
    }
  }, [allPosts, loggedInUser]);

  if (blogsLoading || catLoading) return <Loading />;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 pt-10 pb-12 relative space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] font-black tracking-[0.25em] text-red-600 uppercase flex items-center gap-1 select-none">
              <RiSparklingLine className="animate-spin [animation-duration:5s]" />
              {isLoggedIn ? "Personal Station Hub" : "Platform Live Stream"}
            </span>
            <h1 className="text-2xl font-black tracking-tight text-black uppercase">
              {isLoggedIn
                ? `${loggedInUser?.username}'s Workspace`
                : "Discover Publications"}
            </h1>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              {isLoggedIn
                ? "Review and audit your active operational post indexes and telemetry tracking logs."
                : "Browse architectural blueprints, code patterns, and systems implementation logic."}
            </p>
          </div>

          <div className="w-full overflow-x-auto pb-2 border-b border-slate-100 flex items-center gap-1.5 whitespace-nowrap scrollbar-none">
            <button
              onClick={() => setSelectedCategory("ALL")}
              className={`px-4 h-8 flex items-center justify-center rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${
                selectedCategory === "ALL"
                  ? "bg-black border-black text-white shadow-sm"
                  : "bg-white border-slate-200 text-slate-500 hover:border-slate-400"
              }`}
            >
              All Workspace Entries
            </button>
            {categoriesList.map((cat) => (
              <button
                key={cat._id}
                onClick={() => setSelectedCategory(cat._id)}
                className={`px-4 h-8 flex items-center justify-center rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${
                  selectedCategory === cat._id
                    ? "bg-red-600 border-red-600 text-white shadow-sm shadow-red-600/10"
                    : "bg-white border-slate-200 text-slate-500 hover:border-slate-400"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {!isLoggedIn ? (
            <div className="w-full border-2 border-dashed border-slate-200 rounded-xl p-16 text-center bg-white shadow-sm mt-4">
              <div className="h-12 w-12 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center mx-auto mb-4 text-slate-400 shadow-inner">
                <RiLockPasswordLine className="text-xl" />
              </div>
              <h3 className="text-sm font-bold text-black uppercase tracking-wider">
                Workspace Locked
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                You must be authenticated to access the personal publishing hub
                and review active directory records.
              </p>
              <Button
                asChild
                className="mt-6 bg-black text-white hover:bg-slate-900 rounded-lg shadow-sm"
              >
                <Link to="/sign-in">Secure Sign In</Link>
              </Button>
            </div>
          ) : filteredPosts.length > 0 ? (
            <div className="space-y-4">
              {filteredPosts.map((blog) => {
                const isExpanded = expandedPosts[blog._id];
                const initialAdmired =
                  blog.admires?.some(
                    (id) => id === userId || id?._id === userId,
                  ) || false;
                const isAdmired = admiredPosts.hasOwnProperty(blog._id)
                  ? admiredPosts[blog._id]
                  : initialAdmired;

                let admireCount = blog.admires?.length || 0;
                if (initialAdmired && !isAdmired) admireCount--;
                if (!initialAdmired && isAdmired) admireCount++;

                const bodyText = blog.blogContent || "";
                const charLimit = 220;
                const needsTruncation = bodyText.length > charLimit;
                const displayedText =
                  needsTruncation && !isExpanded
                    ? `${bodyText.slice(0, charLimit)}...`
                    : bodyText;

                return (
                  <Card
                    key={blog._id}
                    className="bg-white border border-slate-200/90 shadow-sm rounded-xl overflow-hidden hover:border-slate-300 transition-all flex flex-col w-full"
                  >
                    <div className="p-5 flex flex-col sm:flex-row items-start gap-5">
                      {blog.blogImageFile && (
                        <div
                          onClick={() => setPopupImage(blog.blogImageFile)}
                          className="w-full sm:w-44 h-36 sm:h-28 rounded-lg overflow-hidden border border-slate-100 bg-slate-50 flex-shrink-0 relative cursor-zoom-in group shadow-inner"
                        >
                          <img
                            src={blog.blogImageFile}
                            alt=""
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <div className="p-1.5 rounded-full bg-white/90 text-black shadow-md">
                              <RiZoomInLine className="text-sm" />
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex-1 min-w-0 w-full space-y-2">
                        <div className="flex items-start justify-between gap-4">
                          <h2 className="font-black text-base text-black leading-snug tracking-tight hover:text-red-600 transition-colors line-clamp-2 cursor-pointer">
                            {blog.title}
                          </h2>
                          {(loggedInUser?._id === blog.author?._id ||
                            loggedInUser?.id === blog.author?._id) && (
                            <div className="flex items-center gap-0.5 flex-shrink-0 bg-slate-50 p-0.5 rounded-md border border-slate-100">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-slate-400 hover:text-black rounded"
                                asChild
                              >
                                <Link to={`/blogs/edit/${blog._id}`}>
                                  <RiEditLine className="h-3.5 w-3.5" />
                                </Link>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-slate-400 hover:text-red-600 rounded"
                                onClick={() => triggerDeletePrompt(blog._id)}
                              >
                                <RiDeleteBin6Line className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-medium text-slate-400">
                          <div className="flex items-center gap-1.5 text-slate-700 font-bold">
                            <Avatar className="h-4 w-4 border border-slate-200">
                              <AvatarImage src={blog.author?.avatar} />
                              <AvatarFallback className="text-[7px] bg-black text-white font-black">
                                AU
                              </AvatarFallback>
                            </Avatar>
                            <span>
                              {blog.author?.username || "Staff Writer"}
                            </span>
                          </div>
                          <span className="text-slate-300">•</span>
                          <span className="flex items-center gap-1">
                            <RiCalendarLine className="text-xs" />
                            {blog.createdAt
                              ? new Date(blog.createdAt).toLocaleDateString(
                                  "en-US",
                                  { month: "short", day: "numeric" },
                                )
                              : "Context"}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="flex items-center gap-0.5 uppercase tracking-wider text-[9px] font-black text-red-600">
                            {blog.category?.name || "General"}
                          </span>
                        </div>

                        <div className="text-xs text-slate-600 font-normal leading-relaxed break-words">
                          <p className="inline">{displayedText}</p>
                          {needsTruncation && (
                            <button
                              onClick={() => toggleContentExpansion(blog._id)}
                              className="text-[10px] font-black text-red-600 hover:text-red-700 uppercase tracking-wider ml-1.5 inline-block focus:outline-none"
                            >
                              {isExpanded ? "Less" : "More"}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-slate-100 p-5 pt-3 flex items-center gap-3">
                      <button
                        onClick={() => toggleAdmireState(blog._id)}
                        className={`flex items-center gap-1.5 h-7 px-2.5 rounded-md border text-[11px] font-bold tracking-tight transition-all active:scale-95 ${
                          isAdmired
                            ? "bg-red-50 border-red-200 text-red-600"
                            : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-black"
                        }`}
                      >
                        {isAdmired ? (
                          <RiHeartFill className="text-sm text-red-600" />
                        ) : (
                          <RiHeartLine className="text-sm text-slate-400" />
                        )}
                        <span>
                          {isAdmired ? "Admired" : "Admire"} ({admireCount})
                        </span>
                      </button>
                      <button
                        onClick={() => toggleResponseDrawer(blog._id)}
                        className={`flex items-center gap-1.5 h-7 px-2.5 rounded-md border text-[11px] font-bold tracking-tight transition-all active:scale-95 ${
                          openResponses[blog._id]
                            ? "bg-slate-100 border-slate-300 text-black"
                            : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-black"
                        }`}
                      >
                        <RiChat3Line className="text-sm" />
                        <span>Responses</span>
                      </button>
                    </div>

                    {/* 🎯 NEW: Embed Response Component */}
                    {openResponses[blog._id] && (
                      <ResponseDetails blogId={blog._id} />
                    )}
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="w-full border-2 border-dashed border-slate-200 rounded-xl p-16 text-center bg-white shadow-sm mt-4">
              <div className="h-12 w-12 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center mx-auto mb-4 text-slate-400 shadow-inner hover:bg-slate-100 transition-colors">
                <Link to={RouteBlogAdd}>
                  <RiCompass3Line className="text-xl animate-spin [animation-duration:15s]" />
                </Link>
              </div>
              <h3 className="text-sm font-bold text-black uppercase tracking-wider">
                No Articles Drafted
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                Click on the Compass to create and submit a post to establish
                your active workspace list feed.
              </p>
            </div>
          )}
        </div>

        <div className="lg:col-span-3 space-y-5 lg:sticky lg:top-24 mt-2">
          <Card className="border-slate-200/80 shadow-md shadow-slate-100/40 rounded-xl bg-white overflow-hidden">
            <div className="px-4 py-3.5 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-black text-white rounded-md">
                  <RiNotification3Line className="text-sm animate-swing" />
                </div>
                <h3 className="font-black text-xs uppercase tracking-wider text-black">
                  Activity Metrics
                </h3>
              </div>
              {isLoggedIn && (
                <GoDot className="text-red-600 text-base animate-ping" />
              )}
            </div>

            {/* 🎯 CHANGED: Made the notifications area a scrolling container */}
            <CardContent className="p-0 divide-y divide-slate-100/70 max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
              {isLoggedIn ? (
                realNotifications.length > 0 ? (
                  realNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="p-4 flex items-start gap-3 hover:bg-slate-50/30 transition-colors group cursor-default"
                    >
                      <div className="mt-0.5 flex-shrink-0">
                        <div className="p-1 bg-red-50 text-red-600 rounded-md border border-red-100 group-hover:bg-red-600 group-hover:text-white transition-colors">
                          <RiHeartFill className="text-xs" />
                        </div>
                      </div>
                      <div className="space-y-0.5 min-w-0 flex-1">
                        <p className="text-xs text-slate-800 leading-snug font-medium break-words">
                          <span className="font-bold text-black">
                            {notif.count} Developer{notif.count > 1 ? "s" : ""}
                          </span>{" "}
                          admired your publication{" "}
                          <span className="font-semibold text-slate-500 italic">
                            "{notif.postTitle}"
                          </span>
                        </p>
                        <span className="text-[10px] text-slate-400 font-medium block">
                          {notif.time}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center space-y-1 select-none">
                    <p className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                      No Activity Yet
                    </p>
                    <p className="text-[11px] text-slate-400 leading-normal">
                      Publish posts to start tracking your platform interaction
                      counts.
                    </p>
                  </div>
                )
              ) : (
                <div className="p-6 text-center space-y-1 select-none">
                  <p className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Secure Link Terminated
                  </p>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    Authenticate your token session access to stream live
                    interaction counts.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-slate-200/80 shadow-md shadow-slate-100/40 rounded-xl bg-white overflow-hidden">
            <div className="px-4 py-3.5 bg-slate-50/50 border-b border-slate-100 flex items-center gap-2">
              <div className="p-1.5 bg-red-50 text-red-600 rounded-md border border-red-100">
                <RiFireLine className="text-sm" />
              </div>
              <h3 className="font-black text-xs uppercase tracking-wider text-black">
                Trending Matrix
              </h3>
            </div>
            <CardContent className="p-0 divide-y divide-slate-100">
              {trendingPosts.length > 0 ? (
                trendingPosts.map((post, idx) => (
                  <div
                    key={post._id}
                    className="p-3.5 flex items-start gap-3 group hover:bg-slate-50/40 transition-colors"
                  >
                    <span className="font-black text-base text-slate-200 group-hover:text-red-600 transition-colors select-none">
                      0{idx + 1}
                    </span>
                    <div className="space-y-0.5 min-w-0">
                      <h4 className="font-bold text-xs text-black leading-snug tracking-tight hover:underline cursor-pointer line-clamp-2">
                        {post.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-medium truncate">
                        By {post.author?.username || "Staff Columnist"}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center py-6 text-xs text-slate-400 font-medium">
                  No analytics logged.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="w-full bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl relative group select-none mt-6">
        <div className="absolute top-0 left-0 h-[1.5px] bg-gradient-to-r from-transparent via-red-600 to-transparent w-full opacity-60 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="absolute inset-0 bg-radial-gradient from-red-950/5 via-transparent to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <CardContent className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-4 space-y-2 text-left">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-red-600 animate-pulse" />
              <span className="text-[10px] font-mono font-black tracking-[0.3em] text-zinc-400 uppercase">
                Cantilever Core
              </span>
            </div>
            <h3 className="text-lg font-black text-white uppercase tracking-tight">
              Think Deeply. <br />
              Write Cleanly.
            </h3>
            <p className="text-[11px] text-zinc-500 font-medium leading-relaxed max-w-xs">
              An open platform engineered for developers to share technical
              architecture paradigms, system patterns, and clean code
              principles.
            </p>
          </div>

          <div className="lg:col-span-5 space-y-3">
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
                Subscribe to the Dev Stream
              </h4>
              <p className="text-[11px] text-zinc-500 font-medium">
                Get strict, zero-fluff engineering technical editorials
                delivered straight to your inbox index.
              </p>
            </div>

            <div className="flex items-center gap-2 w-full max-w-md">
              <div className="relative flex-1">
                <input
                  type="email"
                  placeholder="Enter your system email address..."
                  className="w-full h-10 bg-zinc-900/60 border border-zinc-800 rounded-lg px-3 text-xs font-mono text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all"
                />
              </div>
              <Button
                onClick={() =>
                  showToast(
                    "success",
                    "System synchronized. Welcome to the feed loop.",
                  )
                }
                className="bg-white hover:bg-zinc-100 text-black font-bold text-xs uppercase tracking-wider h-10 px-4 rounded-lg flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
              >
                <span>Join</span>
              </Button>
            </div>
          </div>

          <div className="lg:col-span-3 grid grid-cols-2 gap-4 border-t lg:border-t-0 lg:border-l border-zinc-800 pt-6 lg:pt-0 lg:pl-6 text-left">
            <div className="space-y-0.5">
              <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-600 block">
                Total Indexed
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-white tracking-tight font-mono">
                  {allPosts.length}
                </span>
                <span className="text-[10px] text-zinc-500 font-medium font-sans">
                  Posts
                </span>
              </div>
            </div>

            <div className="space-y-0.5">
              <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-600 block">
                Core Engine
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-red-600 tracking-tight font-mono">
                  v1.0
                </span>
                <span className="text-[10px] text-green-500 font-bold font-sans animate-pulse">
                  Live
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {popupImage && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 cursor-zoom-out"
          onClick={() => setPopupImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[85vh] w-full h-full flex items-center justify-center select-none"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={popupImage}
              alt="Preview"
              className="max-w-full max-h-full object-contain rounded-xl shadow-2xl border border-white/5 animate-in zoom-in-95 duration-200"
            />
            <button
              onClick={() => setPopupImage(null)}
              className="absolute -top-10 right-0 sm:top-4 sm:right-4 text-white bg-white/10 hover:bg-white/20 active:scale-90 p-2 rounded-full backdrop-blur-md border border-white/10 transition-all focus:outline-none"
            >
              <RiCloseLine className="text-xl" />
            </button>
          </div>
        </div>
      )}

      {/* 🎯 NEW: Added ConfirmDelete to the absolute bottom of the layout */}
      <ConfirmDelete
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={executeFinalDelete}
        title="Drop Article"
        message="Are you sure you want to permanently erase this record? This action cannot be reversed."
      />
    </div>
  );
};

export default Index;
