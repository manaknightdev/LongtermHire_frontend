import NotificationItem from "./NotificationItem";

const MOCK_DATA = [
  {
    id: 1,
    type: "info",
    mainText:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam neque quasi aperiam temporibus. Minus, veniam?",
    title: "Info Notification",
    time: "5 min ago",
  },
  {
    id: 2,
    type: "warning",
    mainText:
      "Dolor sit amet consectetur adipisicing elit. Totam neque quasi aperiam temporibus. Minus, veniam?",
    title: "Warning Notification",
    time: "10 min ago",
    isRead: true,
  },
  {
    id: 3,
    type: "error",
    mainText:
      "Sit amet consectetur adipisicing elit. Totam neque quasi aperiam temporibus. Minus, veniam?",
    title: "Error Notification",
    time: "15 min ago",
  },
  {
    id: 4,
    type: "success",
    mainText:
      "Amet consectetur adipisicing elit. Totam neque quasi aperiam temporibus. Minus, veniam?",
    title: "Success Notification",
    time: "20 min ago",
  },
  {
    id: 5,
    type: "info",
    mainText:
      "Consectetur adipisicing elit. Totam neque quasi aperiam temporibus. Minus, veniam?",
    title: "Info Notification",
    time: "25 min ago",
    isRead: true,
  },
];

interface NotificationsProps {
  setSidebar: (sidebar: boolean) => void;
}
const Notifications = ({ setSidebar }: NotificationsProps) => {
  return (
    <div>
      <div
        className={`flex items-center p-3 gap-4 border-b border-b-[#E0E0E0] justify-between`}
      >
        <div className="flex items-center gap-3">
          <svg
            onClick={() => setSidebar(false)}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M14.3322 5.83203L19.8751 11.3749C20.2656 11.7654 20.2656 12.3986 19.8751 12.7891L14.3322 18.332M19.3322 12.082H3.83218"
              stroke="#A8A8A8"
              stroke-width="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-lg font-semibold">
            Notifications <sup className="text-gray-400">(3)</sup>
          </span>
        </div>
      </div>
      <div className="p-4 space-y-3">
        {MOCK_DATA.map((item) => (
          <NotificationItem
            key={item.id}
            type={item.type}
            mainText={item.mainText}
            title={item.title}
            time={item.time}
            isRead={item.isRead || false}
          />
        ))}
      </div>
    </div>
  );
};

export default Notifications;
