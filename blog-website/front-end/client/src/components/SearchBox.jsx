import React from "react";
import { Input } from "./ui/input";
import { RiSearchLine } from "react-icons/ri";

export const SearchBox = () => {
  const handleSearch = (e) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-xl flex-1">
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground">
        <RiSearchLine className="h-4 w-4" />
      </div>

      <Input
        type="search"
        placeholder="Search articles, categories, users..."
        className="h-9 w-full rounded-full bg-slate-50 pl-9 pr-4 text-sm border-slate-200 shadow-none transition-all placeholder:text-muted-foreground/70 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:border-transparent"
      />
    </form>
  );
};
