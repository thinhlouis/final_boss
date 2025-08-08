import React from "react";

export default function SelectComponent({
  data,
  value,
  onChange,
  defaultName,
}) {
  return (
    <select value={value} onChange={onChange}>
      <option value="">{defaultName}</option>
      {data.map((item, index) => (
        <option key={index} value={item.slug}>
          {item.name}
        </option>
      ))}
    </select>
  );
}
