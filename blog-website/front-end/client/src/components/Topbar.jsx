import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getEnv } from "@/helpers/getEnv";
import { showToast } from "@/helpers/showToast";
import { removeUser } from "@/store/user.slice";
import {
  RouteIndex,
  RouteSignIn,
  RouteSignUp,
  RouteProfile,
  RouteCategoryDetails,
  RouteBlog,
  RouteNotification,
} from "@/helpers/RouteName";

import {
  RiLoginBoxFill,
  RiMenuLine,
  RiHome2Line,
  RiMenuFoldLine,
  RiMenuUnfoldLine,
} from "react-icons/ri";
import { PiSignIn } from "react-icons/pi";
import { CiUser } from "react-icons/ci";
import { FaPlus } from "react-icons/fa";
import { IoIosLogOut, IoIosNotificationsOutline } from "react-icons/io";
import { TbCategory2 } from "react-icons/tb";
import { LiaBlogSolid } from "react-icons/lia";
import { MdOutlineModeComment } from "react-icons/md";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useSidebar } from "@/components/ui/sidebar";

import logo from "@/assets/images/logo-white.png";
import userIcon from "@/assets/images/user.png";

export const Topbar = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { toggleSidebar, open } = useSidebar();

  const handleLogout = async () => {
    try {
      const response = await fetch(
        `${getEnv("VITE_API_BASE_URL")}/user/logout`,
        { method: "GET", credentials: "include" },
      );

      const data = await response.json();

      if (!response.ok) {
        showToast("error", data.message || "Logout failed");
        return;
      }

      dispatch(removeUser());
      navigate(RouteIndex);
      showToast("success", data.message || "Logged Out successfully!");
    } catch (error) {
      showToast("error", error.message);
    }
  };

  return (
    <div className="flex justify-between items-center h-16 sticky top-0 z-40 w-full max-w-full box-border bg-white shadow-sm px-4 lg:px-6 border-b border-slate-100">
      {/* LEFT SIDE: Toggle Buttons and Logo */}
      <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="hidden md:flex h-9 w-9 text-slate-500 hover:text-black hover:bg-slate-100 rounded-lg transition-all focus-visible:ring-0"
          title={open ? "Collapse Sidebar" : "Expand Sidebar"}
        >
          {open ? (
            <RiMenuFoldLine className="text-xl" />
          ) : (
            <RiMenuUnfoldLine className="text-xl text-red-600" />
          )}
        </Button>

        <div className="block md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-lg border-slate-200"
              >
                <RiMenuLine className="h-5 w-5 text-slate-700" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="w-56 mt-2 rounded-xl p-1.5 shadow-xl border-slate-200/80 bg-white"
            >
              <DropdownMenuLabel className="text-[10px] font-black tracking-[0.15em] text-slate-400 uppercase px-2.5 py-2">
                Navigation Menu
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-100" />
              <DropdownMenuGroup className="space-y-0.5">
                <DropdownMenuItem
                  asChild
                  className="rounded-lg py-2 cursor-pointer focus:bg-slate-50 font-medium text-slate-800"
                >
                  <Link to="/" className="flex items-center gap-3">
                    <RiHome2Line className="text-lg text-slate-400" />
                    <span>Home</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  asChild
                  className="rounded-lg py-2 cursor-pointer focus:bg-slate-50 font-medium text-slate-800"
                >
                  <Link
                    to={RouteCategoryDetails}
                    className="flex items-center gap-3"
                  >
                    <TbCategory2 className="text-lg text-slate-400" />
                    <span>Categories</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  asChild
                  className="rounded-lg py-2 cursor-pointer focus:bg-slate-50 font-medium text-slate-800"
                >
                  <Link to={RouteBlog} className="flex items-center gap-3">
                    <LiaBlogSolid className="text-lg text-slate-400" />
                    <span>Blogs</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  asChild
                  className="rounded-lg py-2 cursor-pointer focus:bg-slate-50 font-medium text-slate-800"
                >
                  <Link
                    to={RouteNotification}
                    className="flex items-center gap-3"
                  >
                    <IoIosNotificationsOutline className="text-lg text-slate-400" />
                    <span>Notifications</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Platform Logo */}
        <Link to="/" className="flex items-center ml-1">
          <img src={logo} alt="Logo" className="h-7 w-auto object-contain" />
        </Link>
      </div>

      {/* RIGHT SIDE: Authentication & User Profile */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        {!user?.isLoggedIn ? (
          <>
            <Button
              variant="outline"
              asChild
              className="hidden sm:inline-flex border-slate-200 hover:bg-slate-50"
            >
              <Link to={RouteSignUp} className="flex items-center gap-2">
                <RiLoginBoxFill className="h-4 w-4 text-slate-500" />
                <span>Sign Up</span>
              </Link>
            </Button>
            <Button
              asChild
              className="bg-black text-white hover:bg-slate-900 rounded-lg shadow-sm"
            >
              <Link to={RouteSignIn} className="flex items-center gap-2">
                <PiSignIn className="h-4 w-4" />
                <span>Login</span>
              </Link>
            </Button>
          </>
        ) : (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="p-0 h-10 w-10 rounded-full border-2 border-slate-100 hover:border-slate-300 transition-all focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 overflow-hidden bg-slate-50 aspect-square"
                >
                  <Avatar className="h-full w-full rounded-full">
                    <AvatarImage
                      src={user?.user?.avatar || userIcon}
                      className="object-cover h-full w-full"
                    />
                    <AvatarFallback className="bg-black text-white font-black text-[10px] tracking-wider uppercase h-full w-full flex items-center justify-center">
                      {user?.user?.username?.substring(0, 2) || "US"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-60 mt-2 rounded-xl p-1.5 shadow-xl border-slate-200/80 bg-white"
              >
                <DropdownMenuLabel className="px-3 py-2.5">
                  <p className="text-sm font-bold text-black leading-none truncate">
                    {user?.user?.username}
                  </p>
                  <p className="text-[11px] text-slate-400 font-medium mt-1.5 truncate">
                    {user?.user?.email}
                  </p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-100" />
                <DropdownMenuGroup className="space-y-0.5">
                  <DropdownMenuItem
                    asChild
                    className="rounded-lg py-2 cursor-pointer focus:bg-slate-50 font-medium text-slate-700"
                  >
                    <Link to={RouteProfile} className="flex items-center gap-2">
                      <CiUser className="text-base text-slate-400" />
                      <span>My Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    asChild
                    className="rounded-lg py-2 cursor-pointer focus:bg-slate-50 font-medium text-slate-700"
                  >
                    <Link to="/create-blog" className="flex items-center gap-2">
                      <FaPlus className="text-xs text-slate-400" />
                      <span>Create New Blog</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="bg-slate-100" />
                <DropdownMenuItem
                  asChild
                  className="rounded-lg p-0 cursor-pointer focus:bg-red-50"
                >
                  <Button
                    variant="ghost"
                    className="w-full h-9 px-2.5 justify-start gap-2 text-sm font-bold text-red-600 hover:text-red-700 hover:bg-transparent"
                    onClick={handleLogout}
                  >
                    <IoIosLogOut className="text-base" />
                    <span>Secure Sign Out</span>
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
      </div>
    </div>
  );
};
