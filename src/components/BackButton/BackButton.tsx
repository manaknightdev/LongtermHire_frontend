import { CaretLeft } from "@/assets/svgs";
import { NavLink, To, useNavigate } from "react-router-dom";

interface BackButtonProps {
  text?: string;
  link?: To;
}

const BackButton = ({ text, link }: BackButtonProps) => {
  const navigate = useNavigate();

  return (
    <div>
      {link ? (
        <NavLink className="flex items-center gap-3 text-[#262626]" to={link}>
          <CaretLeft />
          {text && text}
        </NavLink>
      ) : (
        <button
          type="button"
          className="flex items-center gap-3 text-[#262626]"
          onClick={() => navigate(-1)}
        >
          <CaretLeft />
          {text && text}
        </button>
      )}
    </div>
  );
};

export default BackButton;
