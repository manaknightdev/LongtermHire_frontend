import { Link } from "react-router-dom";
import { MKDLOGO } from "@/assets/images";

export const PublicHeader = () => {
  return (
    <div>
      <nav className="flex min-h-[50px] items-center justify-between border-b border-b-[#C6C6C6] bg-white px-6 py-2">
        <Link
          to="/"
          className={`h-14 min-h-14 max-h-14 gap-5 flex items-center `}
        >
          <img className={"h-[70%] object-contain "} src={MKDLOGO} />
          MTP - Builder
        </Link>
        <div className="flex cursor-pointer items-center rounded-md border border-[#C6C6C6] px-3 py-2 shadow-sm hover:scale-95">
          Support
        </div>
      </nav>
    </div>
  );
};

export default PublicHeader;
