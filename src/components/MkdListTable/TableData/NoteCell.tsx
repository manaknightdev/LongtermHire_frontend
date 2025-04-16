import { memo } from "react";
// import { NotesIcon } from "@/assets/svgs";

interface NoteCellProps {
  value: string;
  showNote: (value: string) => void;
}

const NoteCell = memo(({ value, showNote }: NoteCellProps) => (
  <button
    onClick={() => showNote(value)}
    type="button"
    className="flex items-center gap-2 "
  >
    {/* <NotesIcon className="h-[1.0313rem] w-[1.0313rem]" /> */}
    View
  </button>
));

export default NoteCell;
