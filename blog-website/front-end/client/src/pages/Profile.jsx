import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link } from "react-router-dom";
import { RiSaveLine, RiLockPasswordLine, RiLoader4Line } from "react-icons/ri";
import { IoCameraOutline } from "react-icons/io5";
import Dropzone from "react-dropzone";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

import { showToast } from "@/helpers/showToast";
import userIcon from "@/assets/images/user.png";
import { getEnv } from "@/helpers/getEnv";
import { setUser } from "@/store/user.slice";

const profileSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(50),
    email: z.string().email("Invalid email address"),
    bio: z.string().max(160, "Bio cannot exceed 160 characters").optional(),
    currentPassword: z.string().optional(),
    newPassword: z.string().optional(),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.newPassword && data.newPassword !== data.confirmPassword) {
        return false;
      }
      return true;
    },
    {
      message: "New passwords do not match",
      path: ["confirmPassword"],
    },
  )
  .refine(
    (data) => {
      if (data.newPassword && !data.currentPassword) {
        return false;
      }
      return true;
    },
    {
      message: "Current password is required to set a new password",
      path: ["currentPassword"],
    },
  );

const Profile = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [avatarPreview, setAvatarPreview] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: "",
      email: "",
      bio: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        username: user.username || "",
        email: user.email || "",
        bio: user.bio || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setAvatarPreview(user.avatar || "");
    }
  }, [user, form]);

  useEffect(() => {
    return () => {
      if (avatarPreview && avatarPreview.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  const onSubmit = async (values) => {
    try {
      const response = await fetch(
        `${getEnv("VITE_API_BASE_URL")}/user/update-profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(values),
          credentials: "include",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        showToast(
          "error",
          typeof data.message === "string" ? data.message : "Update failed",
        );
        return;
      }

      if (data.user) {
        dispatch(setUser(data.user));
      }

      showToast("success", data.message || "Profile updated successfully!");
      form.setValue("currentPassword", "");
      form.setValue("newPassword", "");
      form.setValue("confirmPassword", "");
    } catch (error) {
      showToast("error", error.message || "Failed to update profile");
    }
  };

  const handleFileSelection = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      showToast("error", "Image size must be smaller than 3MB");
      return;
    }

    const localObjectUrl = URL.createObjectURL(file);
    setAvatarPreview(localObjectUrl);
    setIsUploading(true);

    const formData = new FormData();
    formData.append("avatarFile", file);

    try {
      showToast("info", "Uploading image...");

      const response = await fetch(
        `${getEnv("VITE_API_BASE_URL")}/user/update-avatar`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to upload avatar");
      }

      dispatch(setUser(data.user));
      showToast("success", "Avatar updated successfully!");
    } catch (error) {
      showToast("error", error.message || "Upload failed");
      setAvatarPreview(user?.avatar || "");
    } finally {
      setIsUploading(false);
    }
  };

  const isGoogleUser = user?.avatar?.includes("googleusercontent.com");

  return (
    <div className="mt-24 max-w-2xl mx-auto px-4 mb-12">
      <Card className="shadow-lg border-slate-200/80 bg-white rounded-xl overflow-hidden">
        <CardHeader className="space-y-1 bg-slate-50/50 border-b border-slate-100 p-6 md:p-8">
          <CardTitle className="text-2xl font-black tracking-tight text-black uppercase">
            Profile Details
          </CardTitle>
          <CardDescription className="text-sm text-slate-500">
            View or update your personal identity elements and configuration
            fields.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 md:p-8 space-y-8">
          {/* Avatar Interaction Layer Block */}
          <div className="flex flex-col items-center justify-center gap-3 pb-6 border-b border-slate-100">
            <Dropzone
              onDrop={handleFileSelection}
              accept={{ "image/*": [] }}
              multiple={false}
              disabled={isUploading}
            >
              {/* Added destructuring parameters to get tracking utilities cleanly */}
              {({ getRootProps, getInputProps, isDragActive }) => (
                <div
                  {...getRootProps()}
                  className="relative cursor-pointer group outline-none select-none rounded-full"
                  title="Drag and drop an image or click to upload"
                >
                  <input {...getInputProps()} />

                  <Avatar
                    className={`h-24 w-24 border-2 shadow-sm transition-all duration-300 relative ${
                      isDragActive
                        ? "border-red-600 scale-105 ring-4 ring-red-500/10"
                        : "border-slate-100 hover:border-slate-300"
                    } ${isUploading ? "opacity-60 pointer-events-none" : ""}`}
                  >
                    <AvatarImage
                      src={avatarPreview || userIcon}
                      alt={user?.username}
                      className="rounded-full object-cover h-full w-full"
                    />
                    <AvatarFallback className="bg-slate-900 text-white font-bold text-sm">
                      {user?.username?.slice(0, 2).toUpperCase() || "US"}
                    </AvatarFallback>

                    {/* Camera Floating Status Indicator Icon Badge */}
                    <div
                      className={`absolute bottom-0 right-0 z-10 flex h-8 w-8 items-center justify-center rounded-full border bg-white shadow-md transition-all duration-200 ${
                        isDragActive
                          ? "border-red-600 bg-red-50 text-red-600"
                          : "border-slate-200 text-slate-500 group-hover:text-red-600 group-hover:scale-105"
                      }`}
                    >
                      {isUploading ? (
                        <RiLoader4Line className="text-lg animate-spin text-red-600" />
                      ) : (
                        <IoCameraOutline className="text-lg" />
                      )}
                    </div>

                    {/* Drag and Drop Active Status Text Shield */}
                    {isDragActive && (
                      <div className="absolute inset-0 bg-white/90 rounded-full flex items-center justify-center text-[10px] font-black text-red-600 tracking-wider uppercase text-center p-2 backdrop-blur-[1px] border border-red-600">
                        Drop Image
                      </div>
                    )}
                  </Avatar>
                </div>
              )}
            </Dropzone>

            <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">
              @{user?.username || "username"}
            </span>
          </div>

          {/* Form Fields Stack */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Username
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your username"
                        {...field}
                        className="h-11 bg-white border-slate-200 focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-0 text-black transition-all"
                      />
                    </FormControl>
                    <FormMessage className="text-xs font-medium text-red-600" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="name@example.com"
                        {...field}
                        className="h-11 bg-slate-50/50 border-slate-200 text-slate-400 font-medium cursor-not-allowed select-none"
                        disabled
                      />
                    </FormControl>
                    <FormMessage className="text-xs font-medium text-red-600" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Bio
                    </FormLabel>
                    <FormControl>
                      <textarea
                        placeholder="Tell us a little bit about yourself..."
                        {...field}
                        className="flex min-h-[100px] w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-black placeholder:text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-0 transition-all resize-none"
                      />
                    </FormControl>
                    <FormMessage className="text-xs font-medium text-red-600" />
                  </FormItem>
                )}
              />

              {!isGoogleUser && (
                <div className="border-t border-slate-100 pt-6 mt-8 space-y-4">
                  <div className="flex items-center gap-2 mb-2 text-black">
                    <RiLockPasswordLine className="h-5 w-5 text-slate-400" />
                    <h3 className="text-sm font-black tracking-wider uppercase">
                      Security Parameters
                    </h3>
                  </div>

                  <FormField
                    control={form.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-700">
                          Current Password
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            {...field}
                            className="h-11 bg-white border-slate-200 focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-0 text-black transition-all"
                          />
                        </FormControl>
                        <FormMessage className="text-xs font-medium text-red-600" />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem className="space-y-1.5">
                          <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-700">
                            New Password
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Min. 6 characters"
                              {...field}
                              className="h-11 bg-white border-slate-200 focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-0 text-black transition-all"
                            />
                          </FormControl>
                          <FormMessage className="text-xs font-medium text-red-600" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem className="space-y-1.5">
                          <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-700">
                            Confirm New Password
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="••••••••"
                              {...field}
                              className="h-11 bg-white border-slate-200 focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-0 text-black transition-all"
                            />
                          </FormControl>
                          <FormMessage className="text-xs font-medium text-red-600" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end pt-6 gap-4 border-t border-slate-100 mt-8">
                <Button
                  type="button"
                  variant="outline"
                  asChild
                  className="h-11 px-5 border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                >
                  <Link to="/">Cancel</Link>
                </Button>
                <Button
                  type="submit"
                  className="h-11 bg-red-600 hover:bg-red-700 text-white font-semibold tracking-wide px-6 rounded-lg shadow-sm shadow-red-600/10 transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <RiSaveLine className="h-4 w-4" />
                  <span>Save Changes</span>
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
