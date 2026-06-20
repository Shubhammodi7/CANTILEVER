import React from "react";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "@/helpers/firebase";
import { showToast } from "@/helpers/showToast";
import { getEnv } from "@/helpers/getEnv";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/user.slice";

const GoogleLogin = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleGoogleAuth = async () => {
    try {
      const googleResponse = await signInWithPopup(auth, provider);
      const { displayName, email, photoURL } = googleResponse.user;

      try {
        const response = await fetch(
          `${getEnv("VITE_API_BASE_URL")}/auth/google-login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              username: displayName,
              email: email,
              avatar: photoURL,
            }),
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
    } catch (error) {
      console.error(error.message);
      showToast("error", error.message || "Google authentication failed");
    }
  };

  return (
    <Button
      variant="outline"
      type="button"
      className="w-full flex items-center justify-center gap-2"
      onClick={handleGoogleAuth}
    >
      <FcGoogle className="h-5 w-5" />
      <span>Continue with Google</span>
    </Button>
  );
};

export default GoogleLogin;
