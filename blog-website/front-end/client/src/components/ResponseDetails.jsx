import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  RiSendPlaneFill,
  RiMessage2Line,
  RiMoreFill,
  RiEditLine,
  RiDeleteBin6Line,
  RiCloseLine,
  RiCheckLine,
} from "react-icons/ri";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getEnv } from "@/helpers/getEnv";
import { showToast } from "@/helpers/showToast";
import ConfirmDelete from "./ConfirmDelete";

const ResponseDetails = ({ blogId }) => {
  const { user: loggedInUser } = useSelector((state) => state.user);

  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [visibleCount, setVisibleCount] = useState(2);

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");

  const loggedInUserId = loggedInUser?._id || loggedInUser?.id;

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const res = await fetch(
          `${getEnv("VITE_API_BASE_URL")}/response/get/${blogId}`,
        );
        const data = await res.json();
        if (data.success) {
          setResponses(data.responses);
        }
      } catch (error) {
        console.error("Failed to fetch responses", error);
      } finally {
        setLoading(false);
      }
    };
    fetchResponses();
  }, [blogId]);

  const handlePostResponse = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(
        `${getEnv("VITE_API_BASE_URL")}/response/add/${blogId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ content: newComment }),
        },
      );

      const data = await res.json();

      if (data.success) {
        showToast("success", "Response added to thread.");
        setResponses([data.response, ...responses]);
        setNewComment("");
      } else {
        showToast("error", data.message || "Failed to post response.");
      }
    } catch (error) {
      showToast("error", "Network error. Could not post response.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteResponse = async (responseId) => {
    try {
      const res = await fetch(
        `${getEnv("VITE_API_BASE_URL")}/response/delete/${responseId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );
      const data = await res.json();

      if (data.success) {
        showToast("success", "Response removed.");

        setResponses(responses.filter((r) => r._id !== responseId));
      } else {
        showToast("error", data.message || "Failed to delete.");
      }
    } catch (error) {
      showToast("error", "Network error during deletion.");
    }
  };

  const handleStartEdit = (response) => {
    setActiveDropdown(null);
    setEditingId(response._id);
    setEditContent(response.content);
  };

  const handleSaveEdit = async (responseId) => {
    if (!editContent.trim()) return;

    try {
      const res = await fetch(
        `${getEnv("VITE_API_BASE_URL")}/response/update/${responseId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ newContent: editContent }),
        },
      );
      const data = await res.json();

      if (data.success) {
        showToast("success", "Response updated.");

        setResponses(
          responses.map((r) => (r._id === responseId ? data.newResponse : r)),
        );
        setEditingId(null);
      } else {
        showToast("error", data.message || "Failed to update.");
      }
    } catch (error) {
      showToast("error", "Network error during update.");
    }
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 10);
  };

  if (loading)
    return (
      <div className="text-xs text-slate-400 py-4 text-center">
        Loading network responses...
      </div>
    );

  return (
    <div className="w-full bg-slate-50 border-t border-slate-100 p-4 sm:p-5">
      {loggedInUser ? (
        <form onSubmit={handlePostResponse} className="flex gap-3 mb-6">
          <Avatar className="h-8 w-8 border border-slate-200 shadow-sm flex-shrink-0">
            <AvatarImage src={loggedInUser.avatar} />
            <AvatarFallback className="bg-black text-white text-[10px]">
              ME
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500 transition-all shadow-sm">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Draft your response logic..."
              className="w-full text-xs py-2.5 px-3 focus:outline-none text-slate-700"
              disabled={isSubmitting}
            />
            <button
              type="submit"
              disabled={isSubmitting || !newComment.trim()}
              className="px-3 text-slate-400 hover:text-red-600 disabled:opacity-50 transition-colors"
            >
              <RiSendPlaneFill className="text-lg" />
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-6 p-3 bg-white border border-slate-200 rounded-lg text-center text-[11px] text-slate-500 font-medium">
          Secure sign-in required to append to this response thread.
        </div>
      )}

      {/* 🎯 Responses List */}
      <div className="space-y-4">
        {responses.length > 0 ? (
          responses.slice(0, visibleCount).map((res) => {
            const isMyResponse = loggedInUserId === res.author?._id;
            const isEditing = editingId === res._id;

            return (
              <div
                key={res._id}
                className="flex gap-3 animate-in fade-in slide-in-from-top-2 duration-300"
              >
                <Avatar className="h-7 w-7 border border-slate-200 flex-shrink-0">
                  <AvatarImage src={res.author?.avatar} />
                  <AvatarFallback className="bg-slate-200 text-slate-600 text-[9px]">
                    {res.author?.username?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 bg-white border border-slate-100 rounded-lg p-3 shadow-sm relative group">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold text-slate-800">
                      {res.author?.username || "Unknown Entity"}
                    </span>

                    <div className="flex items-center gap-2">
                      <span className="text-[9px] text-slate-400 font-medium">
                        {new Date(res.createdAt).toLocaleDateString()}
                      </span>

                      {/* 🎯 3-Dot Menu Logic */}
                      {isMyResponse && !isEditing && (
                        <div className="relative">
                          <button
                            onClick={() =>
                              setActiveDropdown(
                                activeDropdown === res._id ? null : res._id,
                              )
                            }
                            className="text-slate-400 hover:text-black transition-colors"
                          >
                            <RiMoreFill className="text-sm" />
                          </button>

                          {activeDropdown === res._id && (
                            <div className="absolute right-0 top-5 w-24 bg-white border border-slate-200 shadow-lg rounded-md py-1 z-10 animate-in fade-in zoom-in-95 duration-100">
                              <button
                                onClick={() => handleStartEdit(res)}
                                className="w-full text-left px-3 py-1.5 text-[10px] font-bold text-slate-600 hover:bg-slate-50 hover:text-black flex items-center gap-1.5"
                              >
                                <RiEditLine /> Edit
                              </button>
                              <button
                                onClick={() => handleDeleteResponse(res._id)}
                                className="w-full text-left px-3 py-1.5 text-[10px] font-bold text-red-600 hover:bg-red-50 flex items-center gap-1.5"
                              >
                                <RiDeleteBin6Line /> Delete
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 🎯 Edit Form vs Normal Text display */}
                  {isEditing ? (
                    <div className="mt-2 flex flex-col gap-2">
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full text-xs p-2 border border-slate-200 rounded focus:outline-none focus:border-red-500 resize-none"
                        rows="2"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setEditingId(null)}
                          className="text-[10px] px-2 py-1 border border-slate-200 rounded text-slate-500 hover:bg-slate-50 flex items-center gap-1 font-bold"
                        >
                          <RiCloseLine /> Cancel
                        </button>
                        <button
                          onClick={() => handleSaveEdit(res._id)}
                          disabled={!editContent.trim()}
                          className="text-[10px] px-2 py-1 bg-black text-white rounded hover:bg-slate-800 flex items-center gap-1 font-bold disabled:opacity-50"
                        >
                          <RiCheckLine /> Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">
                      {res.content}
                    </p>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center flex flex-col items-center py-4 text-slate-400">
            <RiMessage2Line className="text-2xl mb-1 opacity-50" />
            <p className="text-[11px]">No responses indexed yet.</p>
          </div>
        )}
      </div>

      {/* 🎯 Pagination: Load More Button */}
      {visibleCount < responses.length && (
        <div className="mt-4 text-center">
          <button
            onClick={handleLoadMore}
            className="text-[10px] font-bold text-slate-500 hover:text-black uppercase tracking-wider transition-colors border-b border-transparent hover:border-black pb-0.5"
          >
            Load More Responses...
          </button>
        </div>
      )}
    </div>
  );
};

export default ResponseDetails;
