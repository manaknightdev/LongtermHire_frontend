import { useEffect, useState } from "react";
import MkdSDK from "@/utils/MkdSDK";

const sdk = new MkdSDK();

interface StatsProps {
  heading: string;
  request: any;
  unit: string;
  unitPosition: string;
}

const Stats = ({ heading, request, unit, unitPosition }: StatsProps) => {
  const [data, setData] = useState("");

  useEffect(() => {
    (async () => {
      let res = await sdk
        .callRawAPI(request?.route, request?.payload ?? {}, request?.method)
        .catch((err) => console.error(err));
      setData(res.model);
    })();
  }, []);

  const getStat = (stat: string, unit = "", unitPosition = "left") => {
    return unitPosition == "left" ? `${unit}${stat}` : `${stat}${unit}`;
  };

  return (
    <div>
      <article className="rounded-lg border border-gray-100 bg-white p-6">
        <div>
          <p className="text-sm text-gray-500">{heading}</p>

          <p className="text-2xl font-medium text-gray-900">
            {getStat(data, unit, unitPosition)}
          </p>
        </div>
      </article>
    </div>
  );
};

export default Stats;
