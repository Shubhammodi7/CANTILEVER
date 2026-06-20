import React, { useEffect } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RiArrowLeftLine, RiPriceTag3Line } from "react-icons/ri";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import slugify from "slugify";
import { showToast } from "@/helpers/showToast";
import { getEnv } from "@/helpers/getEnv";

const addCategorySchema = z.object({
  name: z
    .string()
    .min(3, { message: "Username must be at least 3 characters." }),
  slug: z.string().min(3, { message: "Slug must be at least 3 characters." }),
});

const AddCategory = () => {
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(addCategorySchema),
    defaultValues: {
      name: "",
      slug: "",
    },
  });

  const categoryName = form.watch("name");

  useEffect(() => {
    if (categoryName) {
      const slug = slugify(categoryName, { lower: true });
      form.setValue("slug", slug);
    }
  }, [categoryName]);

  const onSubmit = async (values) => {
    try {
      const response = await fetch(
        `${getEnv("VITE_API_BASE_URL")}/category/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(values),
        },
      );
      const data = await response.json();
      if (!response.ok) {
        showToast("error", data.message || "Category failed");
        return;
      }
      form.reset();
      showToast("success", data.message || "Category created successfully!");
    } catch (error) {
      showToast("error", error.message);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 mt-4">
      <div className="mb-6">
        <Link
          to=".."
          className="inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-slate-400 hover:text-red-600 transition-colors duration-200 group"
        >
          <RiArrowLeftLine className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform" />
          <span>Back to Grid</span>
        </Link>
      </div>

      <Card className="w-full shadow-lg shadow-slate-100/70 border-slate-200/80 bg-white overflow-hidden rounded-xl">
        <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-8 md:px-8">
          <h2 className="text-2xl font-black tracking-tight text-black mt-1 uppercase">
            Create New Category
          </h2>
          <p className="text-sm text-slate-500 mt-1">Create a Valid Category</p>
        </div>

        <CardContent className="p-6 md:p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        Category Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Web Development"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            const generatedSlug = e.target.value
                              .toLowerCase()
                              .replace(/[^a-z0-9\s-]/g, "")
                              .replace(/\s+/g, "-");
                            form.setValue("slug", generatedSlug, {
                              shouldValidate: true,
                            });
                          }}
                          className="h-11 bg-white border-slate-200 text-sm font-medium text-black rounded-lg focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-0 transition-all placeholder:text-slate-300"
                        />
                      </FormControl>
                      <FormMessage className="text-xs font-medium text-red-600 mt-1" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        URL Slug
                      </FormLabel>
                      <FormControl>
                        <div className="relative flex items-center">
                          <span className="absolute left-3 text-xs font-mono font-bold text-slate-300 select-none">
                            /category/
                          </span>
                          <Input
                            placeholder="web-development"
                            {...field}
                            className="h-11 pl-24 bg-white border-slate-200 text-sm font-mono text-black rounded-lg focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-0 transition-all placeholder:text-slate-300"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs font-medium text-red-600 mt-1" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Informative Help Text Box */}
              <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-4 text-xs text-slate-500 leading-relaxed">
                <strong className="text-slate-800 uppercase tracking-wider block mb-1">
                  Slug Requirement:
                </strong>
                Slugs must be lowercased, cannot contain empty spaces, and serve
                as the explicit browser path endpoint indicator for filtering
                targeted blog resource matrices.
              </div>

              {/* Form Action Controls Tray Area */}
              <div className="flex items-center justify-end pt-6 border-t border-slate-100 gap-4">
                <Button
                  type="button"
                  variant="outline"
                  asChild
                  className="h-11 border-slate-200 hover:bg-slate-50 text-slate-600 px-6 font-medium transition-colors"
                >
                  <Link to="..">Cancel</Link>
                </Button>

                <Button
                  type="submit"
                  className="h-11 bg-red-600 hover:bg-red-700 text-white font-semibold tracking-wide px-8 rounded-lg shadow-sm shadow-red-600/10 transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <RiPriceTag3Line className="h-4 w-4" />
                  <span>Save Category</span>
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddCategory;
