import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { RiEditLine, RiDeleteBin6Line } from "react-icons/ri";
import { CiSquarePlus } from "react-icons/ci";

// Shadcn Primitives
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RouteAddCategory, RouteEditCategory } from "@/helpers/RouteName";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Custom Hooks & Utilities
import useFetch from "@/hooks/useFetch";
import { getEnv } from "@/helpers/getEnv";
import Loading from "@/components/Loading";
import { deleteData } from "@/helpers/handleDelete";
import { showToast } from "@/helpers/showToast";

const CategoryDetails = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, []);

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

  const handleDelete = async (id) => {
    const isDeleted = await deleteData(
      `${getEnv("VITE_API_BASE_URL")}/category/delete/${id}`,
    );

    if (isDeleted) {
      setRefreshData((prev) => !prev);
      showToast("success", "Category deleted successfully");
    } else {
      showToast("error", "Data could not be deleted");
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="pt-12 px-6 md:px-8 w-full max-w-5xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-black uppercase mt-1">
            Category Configurations
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Review, modify, or append
          </p>
        </div>

        <Button
          asChild
          className="bg-black hover:bg-slate-900 text-white font-semibold gap-2 self-start sm:self-auto h-10 px-5 shadow-sm transition-all duration-200 active:scale-[0.98]"
        >
          <Link to={RouteAddCategory}>
            <CiSquarePlus className="h-4 w-4 stroke-[1]" />
            <span>Add Category</span>
          </Link>
        </Button>
      </div>

      <Card className="w-full border-slate-200/80 shadow-md shadow-slate-100/50 rounded-xl overflow-hidden bg-white">
        <CardContent className="p-0">
          {" "}
          <Table>
            <TableHeader className="bg-slate-50/70 border-b border-slate-100">
              <TableRow className="hover:bg-transparent">
                <TableHead className="h-12 text-xs font-bold uppercase tracking-wider text-slate-700 pl-6">
                  Category Identifier
                </TableHead>
                <TableHead className="h-12 text-xs font-bold uppercase tracking-wider text-slate-700">
                  URL Route Path Slug
                </TableHead>
                <TableHead className="h-12 text-xs font-bold uppercase tracking-wider text-slate-700 text-right pr-6">
                  Action Panel
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {categoryData?.categories &&
              categoryData.categories.length > 0 ? (
                categoryData.categories.map((category) => (
                  <TableRow
                    key={category._id}
                    className="border-b border-slate-100/80 hover:bg-slate-50/40 transition-colors group"
                  >
                    <TableCell className="font-semibold text-sm text-black py-4 pl-6">
                      {category.name}
                    </TableCell>

                    <TableCell className="font-mono text-xs text-slate-500 py-4">
                      <span className="text-slate-300 select-none">
                        /category/
                      </span>
                      <span className="text-red-600 font-medium">
                        {category.slug}
                      </span>
                    </TableCell>

                    <TableCell className="text-right py-4 pr-6">
                      <div className="inline-flex items-center gap-1.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-400 hover:text-purple-500 hover:bg-slate-100 rounded-md transition-all"
                          asChild
                        >
                          <Link to={RouteEditCategory(category._id)}>
                            <RiEditLine className="h-4 w-4 " />
                          </Link>
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50/60 rounded-md transition-all"
                          onClick={() => handleDelete(category._id)}
                        >
                          <RiDeleteBin6Line className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-center py-12 text-sm text-slate-400 font-medium"
                  >
                    No matching structural classifications found. Create one to
                    begin.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <div className="border-t border-slate-100 px-6 py-4 flex items-center justify-between bg-slate-50/30">
            <div>
              <p className="text-xs text-slate-400 font-medium">
                Showing <span className="text-black font-bold">1</span> to{" "}
                <span className="text-black font-bold">
                  {categoryData?.categories?.length || 0}
                </span>{" "}
                entries
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled
                className="h-8 text-xs font-semibold px-3 border-slate-200 disabled:opacity-40"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled
                className="h-8 text-xs font-semibold px-3 border-slate-200 disabled:opacity-40"
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoryDetails;
