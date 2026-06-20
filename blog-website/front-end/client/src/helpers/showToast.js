import { toast } from "sonner";
import React from "react";
import {
  RiCheckboxCircleFill,
  RiCloseCircleFill,
  RiInformationFill,
} from "react-icons/ri";

/**
 * Dispatches a premium, corporate-grade toast notification.
 * @param {'success' | 'error' | 'info'} type - Operational tracking target status
 * @param {string} message - Headline title string
 * @param {string} [description] - Optional sub-text context details
 */
export const showToast = (type, message, description = "") => {
  const options = {
    description: description,
  };

  switch (type) {
    case "success":
      toast(message, {
        ...options,
        icon: React.createElement(RiCheckboxCircleFill, {
          className: "h-5 w-5 text-black",
        }),
        className: "!border-l-4 !border-l-black !bg-white !rounded-md",
      });
      break;

    case "error":
      toast(message, {
        ...options,
        icon: React.createElement(RiCloseCircleFill, {
          className: "h-5 w-5 text-red-600",
        }),
        className: "!border-l-4 !border-l-red-600 !bg-white !rounded-md",
      });
      break;

    case "info":
      toast(message, {
        ...options,
        icon: React.createElement(RiInformationFill, {
          className: "h-5 w-5 text-slate-800",
        }),
        className: "!border-l-4 !border-l-slate-800 !bg-white !rounded-md",
      });
      break;

    default:
      toast(message, options);
      break;
  }
};
