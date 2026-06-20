import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { RiUserAddLine } from "react-icons/ri";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RouteSignIn } from "@/helpers/RouteName";
import { getEnv } from "@/helpers/getEnv";
import { showToast } from "@/helpers/showToast";
import GoogleLogin from "@/components/GoogleLogin";

// Define validation rules matching your backend schema rules
const signupSchema = z
  .object({
    username: z
      .string()
      .min(3, { message: "Username must be at least 3 characters." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters." }),
    confirmPassword: z
      .string()
      .min(6, { message: "Please confirm your password." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

const Signup = () => {
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values) => {
    try {
      const response = await fetch(
        `${getEnv("VITE_API_BASE_URL")}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        showToast("error", data.message || "Registration failed");
        return;
      }

      showToast("success", data.message || "Account created successfully!");
      navigate(RouteSignIn);
    } catch (error) {
      showToast("error", error.message);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-180px)] items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-md border-slate-200 bg-white">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
            Create an account
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Get started by creating your user profile below
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Native Form Execution Layer */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Username Field */}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="johndoe"
                        {...field}
                        className="focus-visible:ring-slate-900"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="name@example.com"
                        {...field}
                        className="focus-visible:ring-slate-900"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                        className="focus-visible:ring-slate-900"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                        className="focus-visible:ring-slate-900"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full mt-2 flex items-center justify-center gap-2"
              >
                <RiUserAddLine className="h-4 w-4" />
                <span>Sign Up</span>
              </Button>
            </form>
          </Form>

          {/* Contextual Separator Section */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          {/* Social Auth Action Row */}
          <GoogleLogin />
        </CardContent>

        <CardFooter className="justify-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            to={RouteSignIn}
            className="ml-1 font-medium text-slate-900 underline underline-offset-4 hover:text-slate-700 transition-colors"
          >
            Login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Signup;
