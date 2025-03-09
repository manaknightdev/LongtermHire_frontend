import React, { memo } from "react";

interface EditableStatusCellProps {
  value: string;
  mappings: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const EditableStatusCell = memo(
  ({ value, mappings, onChange }: EditableStatusCellProps) => (
    <select value={value} onChange={onChange}>
      {Object.keys(mappings).map((key, index) => (
        <option key={index} value={key}>
          {mappings[key]}
        </option>
      ))}
    </select>
  )
);

export default EditableStatusCell;
