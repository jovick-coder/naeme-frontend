import React from "react";

export default function Label({ label, children, className }) {
  return (
    <div className="block my-3">
      <span className={className}>{label}</span>
      {children}
    </div>
  );
}
