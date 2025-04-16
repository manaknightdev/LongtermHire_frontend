import { Fragment } from "react";
import { LazyLoad } from "@/components/LazyLoad";
import { Link } from "react-router-dom";

export type OptionType = {
  name: string;
  route: string;
};

interface RouteChangeProps {
  onClose: () => void;
  options: Array<OptionType>;
}

export const RouteChange = ({
  onClose,
  options = [
    {
      name: "",
      route: "",
    },
  ],
}: RouteChangeProps) => {
  return (
    <LazyLoad>
      <Fragment>
        <div className="grid grid-cols-2 flex-wrap gap-2 text-center">
          {options?.map((option, optionKey) => {
            return (
              <Link
                key={optionKey}
                onClick={onClose}
                to={option?.route}
                className="cursor-pointer"
              >
                {option?.name}
              </Link>
            );
          })}
        </div>
      </Fragment>
    </LazyLoad>
  );
};

export default RouteChange;
