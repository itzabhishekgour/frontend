import React from "react";

// Table Component
export function Table({ children, className = "" }) {
  return <table className={`min-w-full ${className}`}>{children}</table>;
}

// TableHeader Component
export function TableHeader({ children, className = "" }) {
  return <thead className={className}>{children}</thead>;
}

// TableBody Component
export function TableBody({ children, className = "" }) {
  return <tbody className={className}>{children}</tbody>;
}

// TableRow Component
export function TableRow({ children, className = "" }) {
  return <tr className={className}>{children}</tr>;
}

// TableCell Component
export function TableCell({ children, isHeader = false, className = "" }) {
  const CellTag = isHeader ? "th" : "td";
  return <CellTag className={className}>{children}</CellTag>;
}
