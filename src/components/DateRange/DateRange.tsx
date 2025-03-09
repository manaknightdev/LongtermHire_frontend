import { memo } from "react";
import "@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css";
import { Calendar, utils } from "@hassanmojab/react-modern-calendar-datepicker";
interface DateRangeProps {
  selectedDayRange: any;
  setSelectedDayRange: (value: any) => void;
}
const DateRange = ({
  selectedDayRange,
  setSelectedDayRange,
}: DateRangeProps) => {
  return (
    <Calendar
      value={selectedDayRange}
      onChange={setSelectedDayRange}
      shouldHighlightWeekends={true}
      minimumDate={utils().getToday()}
      colorPrimary="#0fbcf9" // added this
      colorPrimaryLight="rgba(75, 207, 250, 0.4)"
    />
  );
};

export default memo(DateRange);
