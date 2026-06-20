import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { RiLoginBoxLine } from "react-icons/ri";
import { showToast } from "@/helpers/showToast";
import { getEnv } from "@/helpers/getEnv";

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
import { RouteSignUp } from "@/helpers/RouteName";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/user.slice";
import GoogleLogin from "@/components/GoogleLogin";

const signinSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

const Signin = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values) => {
    try {
      const response = await fetch(
        `${getEnv("VITE_API_BASE_URL")}/auth/login`,
        {
          method: "POST",
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
        showToast("error", data.message || "Login  failed");
        return;
      }

      dispatch(setUser(data.user));

      showToast("success", data.message || "Logged In successfully!");
      navigate("/");
    } catch (error) {
      showToast("error", error.message);
    }
  };

  const handleGoogleAuth = () => {
    console.log("Redirecting to Google OAuth Gateway...");
  };

  return (
    <div className="flex min-h-[calc(100vh-180px)] items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-md border-slate-200 bg-white">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
            Welcome back
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Enter your credentials to access your secure dashboard
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                    <div className="flex items-center justify-between">
                      <FormLabel>Password</FormLabel>
                      <Link
                        to="/forgot-password"
                        className="text-xs text-muted-foreground hover:text-slate-900 underline underline-offset-2"
                      >
                        Forgot password?
                      </Link>
                    </div>
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
                <RiLoginBoxLine className="h-4 w-4" />
                <span>Login</span>
              </Button>
            </form>
          </Form>

          {/* Visual Divider block */}
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

          {/* Social Google Connection Action Row */}
          <GoogleLogin />
        </CardContent>

        <CardFooter className="justify-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            to={RouteSignUp}
            className="ml-1 font-medium text-slate-900 underline underline-offset-4 hover:text-slate-700 transition-colors"
          >
            Register
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Signin;
