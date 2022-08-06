import React from "react";

const Input = ({ type, value, onChange, className, placeholder }) => {
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      required
      className={className}
    />
  );
};

export default Input;
