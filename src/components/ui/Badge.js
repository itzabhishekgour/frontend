import React from "react";

const Badge = ({
  variant = "light",
  color = "primary",
  size = "md",
  startIcon,
  endIcon,
  children,
}) => {
  const baseStyles =
    "inline-flex items-center px-2.5 py-0.5 justify-center gap-1 rounded-full font-medium";

  const sizeStyles = {
    sm: "text-xs", // Adjusted to tailwind default
    md: "text-sm",
  };

  const variants = {
    light: {
      primary:
        "bg-brand-50 text-brand-500 dark:bg-brand-500/15 dark:text-brand-400",
      success:
        "bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-500",
      error:
        "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-500",
      warning:
        "bg-yellow-50 text-yellow-600 dark:bg-yellow-500/15 dark:text-yellow-400",
      info:
        "bg-blue-50 text-blue-500 dark:bg-blue-500/15 dark:text-blue-500",
      light: "bg-gray-100 text-gray-700 dark:bg-white/5 dark:text-white/80",
      dark: "bg-gray-500 text-white dark:bg-white/5 dark:text-white",
    },
    solid: {
      primary: "bg-brand-500 text-white dark:text-white",
      success: "bg-green-600 text-white dark:text-white",
      error: "bg-red-600 text-white dark:text-white",
      warning: "bg-yellow-600 text-white dark:text-white",
      info: "bg-blue-600 text-white dark:text-white",
      light: "bg-gray-400 dark:bg-white/5 text-white dark:text-white/80",
      dark: "bg-gray-700 text-white dark:text-white",
    },
  };

  const sizeClass = sizeStyles[size] || sizeStyles.md;
  const colorClass = variants[variant]?.[color] || variants.light.primary;

  return (
    <span className={`${baseStyles} ${sizeClass} ${colorClass}`}>
      {startIcon && <span className="mr-1">{startIcon}</span>}
      {children}
      {endIcon && <span className="ml-1">{endIcon}</span>}
    </span>
  );
};

export default Badge;
