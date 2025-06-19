import { MkdButton } from "@/components/MkdButton";
import { LazyLoad } from "@/components/LazyLoad";
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import { Calendar } from "react-modern-calendar-datepicker";
import { useTheme } from "@/hooks/useTheme";
import { THEME_COLORS } from "@/context/Theme";

interface MkdCalendarProps {
  selectedDay: any;
  setSelectedDay: (date: any) => void;
  showDate?: boolean;
  showTime?: boolean;
  onSave?: () => void;
}

const MkdCalendar = ({
  selectedDay,
  setSelectedDay,
  showDate = true,
  // showTime = true,
  onSave,
}: MkdCalendarProps) => {
  const { state } = useTheme();
  const mode = state?.theme;

  return (
    <>
      <style>
        {`.custom-selected-date {
          background-color: ${THEME_COLORS[mode].PRIMARY} !important;
          color: ${THEME_COLORS[mode].TEXT_ON_PRIMARY} !important;
          border-radius: 50% !important;
        }
        .Calendar__day:hover {
          background-color: ${THEME_COLORS[mode].PRIMARY_HOVER} !important;
          color: ${THEME_COLORS[mode].TEXT_ON_PRIMARY} !important;
        }
        .Calendar__monthArrow {
          color: ${THEME_COLORS[mode].TEXT} !important;
        }
        .Calendar__monthText {
          color: ${THEME_COLORS[mode].TEXT} !important;
        }
        .Calendar__day {
          color: ${THEME_COLORS[mode].TEXT} !important;
        }
        .Calendar__weekDay {
          color: ${THEME_COLORS[mode].TEXT_SECONDARY} !important;
        }`}
      </style>
      <div>
        {showDate && <Calendar value={selectedDay} onChange={setSelectedDay} />}

        <LazyLoad>
          <MkdButton
            className="!h-full !w-full "
            showPlus={false}
            onClick={onSave}
          >
            Save
          </MkdButton>
        </LazyLoad>
      </div>
    </>
  );
};

export default MkdCalendar;

// const locale = useMemo(
//   () => ({
//     weekDays: [
//       {
//         name: "Sunday",
//         short: "sun",
//         isWeekend: true,
//       },
//       {
//         name: "Monday",
//         short: "mon",
//         isWeekend: false,
//       },
//       {
//         name: "Tuesday",
//         short: "tue",
//         isWeekend: false,
//       },
//       {
//         name: "Wednesday",
//         short: "wed",
//         isWeekend: false,
//       },
//       {
//         name: "Thursday",
//         short: "thu",
//         isWeekend: false,
//       },
//       {
//         name: "Friday",
//         short: "fri",
//         isWeekend: false,
//       },
//       {
//         name: "Saturday",
//         short: "sat",
//         isWeekend: true,
//       },
//     ],
//   }),
//   []
// );
