import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "@/assets/images/logo-white.png";

import {
  RiHome2Line,
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiMenuFoldLine,
  RiMenuUnfoldLine,
} from "react-icons/ri";
import { TbCategory2 } from "react-icons/tb";
import { LiaBlogSolid } from "react-icons/lia";
import { MdOutlineModeComment } from "react-icons/md";
import { IoIosNotificationsOutline } from "react-icons/io";
import { GoDot } from "react-icons/go";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { getEnv } from "@/helpers/getEnv";
import useFetch from "@/hooks/useFetch";

import { RouteNotification } from "../helpers/RouteName";

export const AppSidebar = () => {
  const { setOpenMobile, isMobile, toggleSidebar, open } = useSidebar();
  const location = useLocation();

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const isActive = (path) => location.pathname === path;

  const [refreshData, setRefreshData] = useState(false);

  const {
    data: categoryData,
    loading,
    error,
  } = useFetch(
    `${getEnv("VITE_API_BASE_URL")}/category/all-category?refresh=${refreshData}`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  const [showAll, setShowAll] = useState(false);

  const allCategories = categoryData?.categories || [
    { _id: 1, name: "No Category Item" },
  ];

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-slate-100 bg-white transitions-all duration-300"
    >
      <SidebarHeader
        className={`bg-white border-b border-slate-100 h-16 flex items-center justify-between transition-all duration-300 ${open ? "px-4" : "px-2 justify-center"}`}
      >
        {open && (
          <div className="flex items-center justify-center flex-1 pl-4 animate-in fade-in duration-200">
            <img src={logo} width={115} alt="Cantilever logo" />
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="hidden lg:flex items-center justify-center h-9 w-9 text-slate-500 hover:text-black hover:bg-slate-100 rounded-lg transition-all flex-shrink-0 border border-transparent hover:border-slate-200/60 shadow-sm"
          title={open ? "Collapse Sidebar" : "Expand Sidebar"}
        >
          {/* MODIFIED FEATURE: Toggle between fold (double lines pointing left) and unfold (double lines pointing right) depending on the sidebar slider state */}
          {open ? (
            <RiMenuFoldLine className="text-lg" />
          ) : (
            <RiMenuUnfoldLine className="text-lg text-red-600 animate-pulse" />
          )}
        </button>
      </SidebarHeader>

      <SidebarContent className="bg-white px-3 pt-6 flex-1 space-y-6 overflow-x-hidden">
        <SidebarGroup className="p-0">
          {open && (
            <SidebarGroupLabel className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase px-3 mb-2 animate-in fade-in duration-200">
              Workspace Core
            </SidebarGroupLabel>
          )}

          <SidebarMenu className="space-y-1">
            {[
              { path: "/", label: "Home", icon: RiHome2Line },
              {
                path: "/categories",
                label: "Categories",
                icon: TbCategory2,
              },
              { path: "/blogs", label: "Blogs", icon: LiaBlogSolid },
              {
                path: RouteNotification,
                label: "Notifications",
                icon: IoIosNotificationsOutline,
              },
            ].map((item) => {
              const IconComponent = item.icon;
              const active = isActive(item.path);

              return (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    asChild
                    className={`h-10 w-full px-3 rounded-lg flex items-center gap-3 transition-all duration-200 ${
                      active
                        ? "bg-slate-900 text-white shadow-sm"
                        : "text-slate-600 hover:text-black hover:bg-slate-50"
                    }`}
                    title={!open ? item.label : ""}
                  >
                    <Link to={item.path} onClick={handleLinkClick}>
                      <IconComponent
                        className={`text-lg transition-colors flex-shrink-0 ${active ? "text-red-500" : "text-slate-400"}`}
                      />
                      {open && (
                        <span className="font-semibold text-sm tracking-tight animate-in fade-in duration-200">
                          {item.label}
                        </span>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup className="p-0">
          {open && (
            <SidebarGroupLabel className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase px-3 mb-2 animate-in fade-in duration-200">
              Quick Filter Engine
            </SidebarGroupLabel>
          )}

          <SidebarMenu>
            {allCategories.length > 0 &&
              (showAll || !open
                ? allCategories
                : allCategories.slice(0, 4)
              ).map((category) => {
                return (
                  <SidebarMenuItem key={category._id}>
                    <SidebarMenuButton
                      asChild
                      className="h-10 w-full px-3 rounded-lg flex items-center gap-3 text-slate-600 hover:text-black hover:bg-slate-50 transition-all"
                      title={!open ? category.name : ""}
                    >
                      <Link
                        to={`/blogs/?category=${category._id}`}
                        onClick={handleLinkClick}
                      >
                        {open && (
                          <span className="font-semibold text-sm tracking-tight text-slate-800 truncate animate-in fade-in duration-200">
                            {category.name}
                          </span>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}

            {allCategories.length > 4 && open && (
              <SidebarMenuItem className="animate-in fade-in duration-200">
                <SidebarMenuButton
                  onClick={() => setShowAll((prev) => !prev)}
                  className="h-10 w-full px-3 rounded-lg flex items-center gap-3 text-slate-500 hover:text-black hover:bg-slate-50 font-bold text-xs uppercase tracking-wider transition-all"
                >
                  {showAll ? (
                    <>
                      <RiArrowUpSLine className="text-slate-400 text-base flex-shrink-0" />
                      <span>Show Less</span>
                    </>
                  ) : (
                    <>
                      <RiArrowDownSLine className="text-red-600 text-base animate-bounce [animation-duration:3s] flex-shrink-0" />
                      <span>More (+{allCategories.length - 4})</span>
                    </>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
