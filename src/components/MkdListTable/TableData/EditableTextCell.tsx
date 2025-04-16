import { memo } from "react";

interface EditableTextCellProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const EditableTextCell = memo(({ value, onChange }: EditableTextCellProps) => (
  <input
    className="text-ellipsis border-0"
    type="text"
    value={value}
    onChange={onChange}
  />
));

export default EditableTextCell;
