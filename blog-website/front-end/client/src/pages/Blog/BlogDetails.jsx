import React, { useState, useEffect } from "react";

import ConfirmDelete from "@/components/ConfirmDelete";
import { deleteData } from "@/helpers/handleDelete";

import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import {
  RiHeartLine,
  RiHeartFill,
  RiChat3Line,
  RiEditLine,
  RiDeleteBin6Line,
  RiCalendarLine,
  RiCompass3Line,
  RiFolder4Line,
  RiCloseLine,
  RiZoomInLine,
  RiEyeLine,
} from "react-icons/ri";
import { CiSquarePlus } from "react-icons/ci";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import Loading from "@/components/Loading";
import { getEnv } from "@/helpers/getEnv";
import useFetch from "@/hooks/useFetch";

import { showToast } from "@/helpers/showToast";
import { RouteBlogAdd } from "@/helpers/RouteName";
import ResponseDetails from "@/components/ResponseDetails";

const BlogDetails = () => {
  const [refreshData, setRefreshData] = useState(false);

  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const categoryFromUrl = queryParams.get("category") || "ALL";

  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl);

  useEffect(() => {
    const currentCategory = queryParams.get("category") || "ALL";
    setSelectedCategory(currentCategory);
  }, [location.search]);

  const [expandedPosts, setExpandedPosts] = useState({});
  const [admiredPosts, setAdmiredPosts] = useState({});

  const [openResponses, setOpenResponses] = useState({});

  const [popupImage, setPopupImage] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const { user: loggedInUser } = useSelector((state) => state.user);

  const { data: blogData, loading: blogsLoading } = useFetch(
    `${getEnv("VITE_API_BASE_URL")}/blogs/get-all?refresh=${refreshData}`,
    { method: "GET", credentials: "include" },
  );

  const { data: categoryData, loading: catLoading } = useFetch(
    `${getEnv("VITE_API_BASE_URL")}/category/all-category`,
    { method: "GET", credentials: "include" },
  );

  const allPosts = Array.isArray(blogData)
    ? blogData
    : blogData?.blog || blogData?.posts || blogData?.data || [];

  const categoriesList = categoryData?.categories || [];

  const filteredPosts = allPosts.filter((post) => {
    if (selectedCategory === "ALL") return true;
    const postCategoryId = post.category?._id || post.category;
    return postCategoryId === selectedCategory;
  });

  const triggerDeletePrompt = (blogId) => {
    setItemToDelete(blogId);
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
      showToast("error", "Target file doesn't belong to you.");
    }

    setItemToDelete(null);
  };

  const toggleContentExpansion = (postId) => {
    setExpandedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));
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
    } catch (error) {
      setAdmiredPosts((prev) => ({ ...prev, [blogId]: isCurrentlyAdmired }));
      showToast(
        "error",
        "Connection lost. Could not verify admiration action.",
      );
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setPopupImage(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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

  const toggleResponseDrawer = (blogId) => {
    setOpenResponses((prev) => ({ ...prev, [blogId]: !prev[blogId] }));
  };

  if (blogsLoading || catLoading) return <Loading />;

  return (
    <div className="pt-12 px-4 sm:px-6 md:px-8 w-full max-w-3xl mx-auto pb-24 mt-4 relative">
      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <span className="text-[10px] font-black tracking-[0.25em] text-red-600 uppercase">
            Hey,{" "}
            <span className="text-[18px] tracking-[0.35em]">
              {loggedInUser?.username}
            </span>
          </span>
          <h1 className="text-xl font-black tracking-tight text-black uppercase mt-1">
            Activity Feed
          </h1>
        </div>
        <Button
          asChild
          className="bg-black hover:bg-slate-900 text-white font-semibold gap-2 self-start sm:self-auto h-10 px-5 shadow-sm transition-all duration-200 active:scale-[0.98] rounded-lg text-xs uppercase tracking-wider"
        >
          <Link to={RouteBlogAdd}>
            <CiSquarePlus className="text-xl stroke-[1.5]" />
            <span>Post Article</span>
          </Link>
        </Button>
      </div>

      <div className="w-full overflow-x-auto pb-3 mb-8 border-b border-slate-100 flex items-center gap-1.5 whitespace-nowrap scrollbar-none">
        <button
          onClick={() => setSelectedCategory("ALL")}
          className={`px-4 h-8 flex items-center justify-center rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${
            selectedCategory === "ALL"
              ? "bg-black border-black text-white shadow-sm"
              : "bg-white border-slate-200 text-slate-500 hover:border-slate-400 hover:text-black"
          }`}
        >
          All Streams
        </button>
        {categoriesList.map((cat) => (
          <button
            key={cat._id}
            onClick={() => setSelectedCategory(cat._id)}
            className={`px-4 h-8 flex items-center justify-center rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${
              selectedCategory === cat._id
                ? "bg-red-600 border-red-600 text-white shadow-sm shadow-red-600/10"
                : "bg-white border-slate-200 text-slate-500 hover:border-slate-400 hover:text-black"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {filteredPosts.length > 0 ? (
        <div className="space-y-5">
          {filteredPosts.map((blog) => {
            const isExpanded = expandedPosts[blog._id];
            const isAdmired = admiredPosts[blog._id];
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
                className="bg-white border border-slate-200/90 shadow-sm rounded-xl overflow-hidden hover:border-slate-300/80 transition-all duration-200 flex flex-col w-full p-5"
              >
                <div className="flex flex-col sm:flex-row items-start gap-5">
                  {blog.blogImageFile && (
                    <div
                      onClick={() => setPopupImage(blog.blogImageFile)}
                      className="w-full sm:w-44 h-40 sm:h-28 rounded-lg overflow-hidden border border-slate-100 bg-slate-50 flex-shrink-0 relative cursor-zoom-in group shadow-inner"
                      title="Click to view full image resolution popup"
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
                      <h2 className="font-black text-base text-black leading-snug tracking-tight hover:text-red-600 transition-colors cursor-pointer line-clamp-2">
                        {blog.title}
                      </h2>

                      <div className="flex items-center gap-0.5 flex-shrink-0 bg-slate-50 p-0.5 rounded-md border border-slate-100">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-slate-400 hover:text-black rounded"
                          asChild
                        >
                          <Link to={`/blogs/edit/${blog._id}`}>
                            <RiEyeLine className="h-3.5 w-3.5" />
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
                          {blog.author?.username || "Staff Columnist"}
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
                          : "Draft"}
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
                          {isExpanded ? "Show Less" : "More"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-3 mt-4 flex items-center gap-3">
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
                    <span>{isAdmired ? "Admired" : "Admire"}</span>
                  </button>

                  <button
                    onClick={() => toggleResponseDrawer(blog._id)}
                    className="flex items-center gap-1.5 h-7 px-2.5 rounded-md border border-slate-200 bg-white text-[11px] font-bold tracking-tight text-slate-500 hover:bg-slate-50 hover:text-black transition-all active:scale-95"
                  >
                    <RiChat3Line className="text-sm text-slate-400" />
                    <span>Responses</span>
                  </button>
                </div>
                {openResponses[blog._id] && (
                  <ResponseDetails blogId={blog._id} />
                )}
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="w-full border-2 border-dashed border-slate-200 rounded-xl p-16 text-center bg-white shadow-sm mt-4">
          <div className="h-12 w-12 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center mx-auto mb-4 text-slate-400 shadow-inner">
            <RiCompass3Line className="text-xl animate-spin [animation-duration:12s]" />
          </div>
          <h3 className="text-sm font-bold text-black uppercase tracking-wider">
            Stream Endpoint Vacant
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
            No matching records are currently filed under this specific
            classification category tag.
          </p>
        </div>
      )}

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
              alt="Expanded Preview View"
              className="max-w-full max-h-full object-contain rounded-xl shadow-2xl border border-white/5 animate-in zoom-in-95 duration-200"
            />

            <button
              onClick={() => setPopupImage(null)}
              className="absolute -top-10 right-0 sm:top-4 sm:right-4 text-white bg-white/10 hover:bg-white/20 active:scale-90 p-2 rounded-full backdrop-blur-md border border-white/10 transition-all focus:outline-none"
              title="Dismiss image overlay popup window (Esc)"
            >
              <RiCloseLine className="text-xl" />
            </button>
          </div>
        </div>
      )}
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

export default BlogDetails;
