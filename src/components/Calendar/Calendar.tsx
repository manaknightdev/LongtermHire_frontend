import { useState } from "react";
import "@fullcalendar/react/dist/vdom";
import { formatDate } from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { Modal } from "@/components/Modal/Modal";
import ModalPrompt from "@/components/Modal/ModalPrompt";
import { useTheme } from "@/hooks/useTheme";
import { THEME_COLORS } from "@/context/Theme";
import "./calendar.css";

interface CalendarProps {
  defaulEvents: any[];
  setEvents: (events: any[]) => void;
  isCalendarFullWidth?: boolean;
}

const Calendar = ({
  defaulEvents,
  setEvents,
  isCalendarFullWidth = true,
}: CalendarProps) => {
  const { state } = useTheme();
  const mode = state?.theme;

  const [currentEvents, setCurrentEvents] = useState<any[]>([]);
  const [showAddEventmodal, setShowAddEventmodal] = useState(false);
  const [showDeleteEventmodal, setShowDeleteEventmodal] = useState(false);
  const [newEventName, setNewEventName] = useState("");
  const [currentSelectedDate, setCurrentSelectedDate] = useState<any>();
  const [currentSelectedEvent, setCurrentSelectedEvent] = useState<any>();

  const handleDateClick = (selected: any) => {
    if (selected.date && selected.dateStr) {
      setCurrentSelectedDate(selected);
      setShowAddEventmodal(true);
    }
  };

  const handleEventsSet = (events: any) => {
    setCurrentEvents(events);
    if (setEvents) {
      setEvents(events);
    }
  };

  const handleAddModalSubmit = () => {
    const calendarApi = currentSelectedDate?.view?.calendar;
    calendarApi?.unselect();

    if (newEventName) {
      setShowAddEventmodal(false);
      calendarApi?.addEvent({
        id: `${currentSelectedDate?.dateStr}-${newEventName}`,
        title: newEventName,
        start: currentSelectedDate.startStr,
        end: currentSelectedDate.endStr,
        allDay: currentSelectedDate.allDay,
      });
    }
    setNewEventName("");
  };

  const handleEventClick = (selected: any) => {
    setCurrentSelectedEvent(selected);
    setShowDeleteEventmodal(true);
  };

  const handleDeletEventClick = () => {
    currentSelectedEvent.event.remove();
    setShowDeleteEventmodal(false);
  };

  const sidebarStyles = {
    backgroundColor: THEME_COLORS[mode].BACKGROUND_SECONDARY,
    borderColor: THEME_COLORS[mode].BORDER,
    color: THEME_COLORS[mode].TEXT,
  };

  const eventItemStyles = {
    backgroundColor: THEME_COLORS[mode].BACKGROUND,
    borderColor: THEME_COLORS[mode].BORDER,
    color: THEME_COLORS[mode].TEXT_SECONDARY,
  };

  const inputStyles = {
    backgroundColor: THEME_COLORS[mode].INPUT_BACKGROUND,
    borderColor: THEME_COLORS[mode].BORDER,
    color: THEME_COLORS[mode].TEXT,
    border: `1px solid ${THEME_COLORS[mode].BORDER}`,
    padding: "8px 12px",
    borderRadius: "6px",
  };

  const buttonStyles = {
    backgroundColor: THEME_COLORS[mode].PRIMARY,
    color: THEME_COLORS[mode].TEXT_ON_PRIMARY,
  };

  return (
    <>
      <div className="m-5">
        <div className="flex items-center justify-center">
          {/* CALENDAR SIDEBAR */}
          <div
            className="w-[15%] flex-col rounded-md border p-4 transition-colors duration-200"
            style={sidebarStyles}
          >
            <h5 style={{ color: THEME_COLORS[mode].TEXT }}>Events</h5>
            <ul className="mt-2 space-y-2 rounded-md text-center">
              {currentEvents.map((event) => (
                <li
                  key={event?.id}
                  className="mx-3 rounded-md border p-4 font-medium transition-all duration-200 hover:shadow-md hover:scale-105"
                  style={eventItemStyles}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      THEME_COLORS[mode].BACKGROUND_HOVER;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                      THEME_COLORS[mode].BACKGROUND;
                  }}
                >
                  <div>
                    <div>{event.title}</div>
                    <p>
                      {formatDate(event.start, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* CALENDAR */}
          <div
            className={`ml-4 flex w-[85%] ${
              isCalendarFullWidth ? "calendar-full-width" : ""
            }`}
          >
            <FullCalendar
              height="500px"
              // aspectRatio={5}
              viewHeight={"200px"}
              eventBorderColor={THEME_COLORS[mode].PRIMARY}
              eventBackgroundColor={THEME_COLORS[mode].PRIMARY}
              plugins={[
                dayGridPlugin,
                timeGridPlugin,
                interactionPlugin,
                listPlugin,
              ]}
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
              }}
              initialView="dayGridMonth"
              editable={true}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={true}
              select={handleDateClick}
              eventClick={handleEventClick}
              eventsSet={(events) => handleEventsSet(events)}
              initialEvents={defaulEvents}
            />
          </div>
        </div>
      </div>

      {showAddEventmodal && (
        <Modal
          title={"Add Event"}
          isOpen={showAddEventmodal}
          modalCloseClick={() => setShowAddEventmodal(false)}
          modalHeader={true}
          classes={{
            modal: "w-1/2",
          }}
        >
          <div className="flex flex-col flex-wrap items-center justify-center">
            <input
              className="mb-3 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200"
              style={inputStyles}
              type="text"
              name="addEvent"
              value={newEventName}
              onChange={(e) => setNewEventName(e.target.value)}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = THEME_COLORS[mode].PRIMARY;
                e.currentTarget.style.boxShadow = `0 0 0 2px ${THEME_COLORS[mode].PRIMARY}40`;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = THEME_COLORS[mode].BORDER;
                e.currentTarget.style.boxShadow = "";
              }}
            />
            <button
              className="rounded-md p-4 transition-all duration-200 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={buttonStyles}
              onClick={handleAddModalSubmit}
              onFocus={(e) => {
                e.currentTarget.style.boxShadow = `0 0 0 2px ${THEME_COLORS[mode].PRIMARY}40`;
              }}
              onBlur={(e) => {
                e.currentTarget.style.boxShadow = "";
              }}
            >
              Add
            </button>
          </div>
        </Modal>
      )}

      <ModalPrompt
        open={showDeleteEventmodal}
        closeModalFunction={() => {
          setShowDeleteEventmodal(false);
        }}
        message="Are you sure you want to delete this event?"
        title="Delete Event"
        loading={false}
        actionHandler={handleDeletEventClick}
      />
    </>
  );
};

export default Calendar;
