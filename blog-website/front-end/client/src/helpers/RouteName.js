export const RouteIndex = "/";
export const RouteSignIn = "/sign-in";
export const RouteSignUp = "/sign-up";
export const RouteProfile = "/profile";
export const RouteCategoryDetails = "/categories";
export const RouteAddCategory = "/category/add";
export const RouteNotification = "/notification";
export const RouteEditCategory = (categoryId) => {
  if (categoryId) {
    return `/category/edit/${categoryId}`;
  } else {
    return `/category/edit/:categoryId`;
  }
};

export const RouteBlog = "/blogs";
export const RouteBlogAdd = "/blogs/add";
export const RouteBlogEdit = (categoryId) => {
  if (categoryId) {
    return `/blogs/edit/${blogId}`;
  } else {
    return `/blogs/edit/:blogId`;
  }
};
