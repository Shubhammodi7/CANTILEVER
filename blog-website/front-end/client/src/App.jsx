import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";

import {
  RouteAddCategory,
  RouteBlog,
  RouteBlogAdd,
  RouteBlogEdit,
  RouteCategoryDetails,
  RouteEditCategory,
  RouteIndex,
  RouteNotification,
  RouteProfile,
  RouteSignIn,
  RouteSignUp,
} from "./helpers/RouteName";

import { Layout } from "./Layout/Layout";
import Index from "./pages/Index";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import AddCategory from "./pages/Category/AddCategory";
import EditCategory from "./pages/Category/EditCategory";
import CategoryDetails from "./pages/Category/CategoryDetails";

import { getEnv } from "./helpers/getEnv";
import useFetch from "./hooks/useFetch";
import { removeUser, setUser } from "./store/user.slice";
import Loading from "./components/Loading";
import AddBlog from "./pages/Blog/AddBlog";
import EditBlog from "./pages/Blog/EditBlog";
import BlogDetails from "./pages/Blog/BlogDetails";

import { Toaster } from "sonner";
import Notifications from "./components/Notifications";

function App() {
  const dispatch = useDispatch();

  const { data, loading, error } = useFetch(
    `${getEnv("VITE_API_BASE_URL")}/auth/get-user`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  useEffect(() => {
    if (data?.user) {
      dispatch(setUser(data.user));
    } else if (error || data?.success === false) {
      dispatch(removeUser());
    }
  }, [data, error, dispatch]);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Toaster
        position="top-right"
        expand={false}
        visibleToasts={4}
        closeButton
        toastOptions={{
          className:
            "bg-white border border-slate-200 text-black rounded-lg shadow-lg font-sans py-3 px-4 flex items-center gap-3",
          descriptionClassName: "text-slate-400 text-xs mt-0.5",
        }}
      />
      <BrowserRouter>
        <Routes>
          <Route path={RouteIndex} element={<Layout />}>
            <Route index element={<Index />} />
            <Route path={RouteNotification} element={<Notifications />} />
            <Route path={RouteProfile} element={<Profile />} />
            <Route path={RouteAddCategory} element={<AddCategory />} />
            <Route path={RouteCategoryDetails} element={<CategoryDetails />} />
            <Route path={RouteEditCategory()} element={<EditCategory />} />

            <Route path={RouteBlogAdd} element={<AddBlog />} />
            <Route path={RouteBlog} element={<BlogDetails />} />
            <Route path={RouteBlogEdit()} element={<EditBlog />} />
          </Route>

          <Route path={RouteSignIn} element={<Signin />} />
          <Route path={RouteSignUp} element={<Signup />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
