import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Dropzone from "react-dropzone";
import slugify from "slugify";

// Icon Packs
import { RiArrowLeftLine, RiArticleLine, RiImageAddLine } from "react-icons/ri";

// UI Shadcn Primitives
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// System Utilities & Hooks
import { showToast } from "@/helpers/showToast";
import { getEnv } from "@/helpers/getEnv";
import useFetch from "@/hooks/useFetch";

// Form Validation Schema
const AddBlogSchema = z.object({
  category: z
    .string()
    .min(1, { message: "Please select a valid blog category." }),
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  slug: z.string().min(3, { message: "Slug must be at least 3 characters." }),
  blogContent: z
    .string()
    .min(10, { message: "Blog content must be at least 10 characters." }),
});

const AddBlog = () => {
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState("");

  const [blogFile, setBlogFile] = useState(null);

  const { data: categoryData } = useFetch(
    `${getEnv("VITE_API_BASE_URL")}/category/all-category`,
    { method: "GET", credentials: "include" },
  );

  const form = useForm({
    resolver: zodResolver(AddBlogSchema),
    defaultValues: {
      category: "",
      title: "",
      slug: "",
      blogContent: "",
    },
  });

  const blogTitle = form.watch("title");

  useEffect(() => {
    if (blogTitle) {
      const slug = slugify(blogTitle, { lower: true, strict: true });
      form.setValue("slug", slug, { shouldValidate: true });
    }
  }, [blogTitle, form]);

  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const onSubmit = async (values) => {
    if (!blogFile) {
      showToast("error", "Please upload a cover image for your blog post.");
      return;
    }

    try {
      showToast("info", "Publishing article...");

      const submissionData = new FormData();
      submissionData.append("category", values.category);
      submissionData.append("title", values.title);
      submissionData.append("slug", values.slug);
      submissionData.append("blogContent", values.blogContent);

      submissionData.append("blogImageFile", blogFile);

      const response = await fetch(`${getEnv("VITE_API_BASE_URL")}/blogs/add`, {
        method: "POST",
        credentials: "include",
        body: submissionData,
      });

      const data = await response.json();

      if (!response.ok) {
        showToast("error", data.message || "Failed to publish blog post.");
        return;
      }

      form.reset();
      setImagePreview("");
      setBlogFile(null);
      showToast("success", "Blog post published successfully!");
      navigate("/blogs");
    } catch (error) {
      showToast("error", error.message || "An error occurred.");
    }
  };

  const handleFileSelection = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      showToast("error", "Image files must be under 3MB.");
      return;
    }

    const localObjectUrl = URL.createObjectURL(file);
    setImagePreview(localObjectUrl);
    setBlogFile(file);
    showToast("success", "Image staged for upload.");
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-10 mt-6 pb-16">
      <div className="mb-6">
        <Link
          to="/blogs"
          className="inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-slate-400 hover:text-red-600 transition-colors duration-200 group"
        >
          <RiArrowLeftLine className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform" />
          <span>Back to Articles</span>
        </Link>
      </div>

      <Card className="w-full shadow-lg shadow-slate-100 border-slate-200/80 bg-white overflow-hidden rounded-xl">
        <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-8 md:px-8">
          <span className="text-[10px] font-black tracking-[0.25em] text-red-600 uppercase">
            Post Something Nice!
          </span>
          <h2 className="text-2xl font-black tracking-tight text-black mt-1 uppercase">
            Create New Blog Post
          </h2>
        </div>

        <CardContent className="p-6 md:p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Featured Cover Image
                </label>
                <Dropzone
                  onDrop={handleFileSelection}
                  accept={{ "image/*": [] }}
                  multiple={false}
                >
                  {({ getRootProps, getInputProps, isDragActive }) => (
                    <div
                      {...getRootProps()}
                      className={`w-full min-h-[160px] max-h-[500px] border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all bg-slate-50/30 overflow-hidden group ${
                        isDragActive
                          ? "border-red-600 bg-red-50/20"
                          : "border-slate-200 hover:border-slate-400"
                      }`}
                    >
                      <input {...getInputProps()} />

                      {imagePreview ? (
                        <div className="w-full relative">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-auto max-h-[480px] object-contain rounded-lg block mx-auto"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                            <p className="text-white text-xs font-bold uppercase tracking-wider">
                              Replace Image
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-center p-8 space-y-2">
                          <RiImageAddLine className="h-8 w-8 text-slate-400 group-hover:text-red-600 transition-colors" />
                          <p className="text-sm font-semibold text-slate-700">
                            {isDragActive
                              ? "Drop image file here"
                              : "Drag & drop cover image or click to browse"}
                          </p>
                          <p className="text-xs text-slate-400">
                            Supports PNG, JPG, or WEBP layouts up to 3MB
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </Dropzone>
              </div>

              {/* TWO-COLUMN GRID MATRIX */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        Blog Category
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-11 border-slate-200 text-sm font-medium focus:ring-2 focus:ring-red-600">
                            <SelectValue placeholder="Select classification index" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white border-slate-200">
                          {categoryData?.categories &&
                          categoryData.categories.length > 0 ? (
                            categoryData.categories.map((category) => (
                              <SelectItem
                                key={category._id}
                                value={category._id}
                                className="focus:bg-slate-50 cursor-pointer"
                              >
                                {category.name}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="disabled" disabled>
                              No dynamic indexes found
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs font-medium text-red-600" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        Blog Title
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., The Future of Full-Stack Engineering"
                          {...field}
                          className="h-11 bg-white border-slate-200 text-sm font-medium text-black focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-0 transition-all"
                        />
                      </FormControl>
                      <FormMessage className="text-xs font-medium text-red-600" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Canonical Target URL Path
                    </FormLabel>
                    <FormControl>
                      <div className="relative flex items-center">
                        <span className="absolute left-3 text-xs font-mono font-bold text-slate-300 select-none">
                          /blogs/
                        </span>
                        <Input
                          placeholder="future-of-full-stack-engineering"
                          {...field}
                          className="h-11 pl-16 bg-white border-slate-200 text-sm font-mono text-black focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-0 transition-all"
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs font-medium text-red-600" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="blogContent"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Article Content Body
                    </FormLabel>
                    <FormControl>
                      <textarea
                        placeholder="Draft your editorial copy layout here..."
                        {...field}
                        className="flex min-h-[220px] w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-black placeholder:text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-0 transition-all resize-none leading-relaxed"
                      />
                    </FormControl>
                    <FormMessage className="text-xs font-medium text-red-600" />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-end pt-6 border-t border-slate-100 gap-4">
                <Button
                  type="button"
                  variant="outline"
                  asChild
                  className="h-11 border-slate-200 hover:bg-slate-50 text-slate-600 px-6 font-medium transition-colors"
                >
                  <Link to="/blogs">Cancel</Link>
                </Button>

                <Button
                  type="submit"
                  className="h-11 bg-red-600 hover:bg-red-700 text-white font-semibold tracking-wide px-8 rounded-lg shadow-sm shadow-red-600/10 transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <RiArticleLine className="h-4 w-4" />
                  <span>Publish Article</span>
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddBlog;
