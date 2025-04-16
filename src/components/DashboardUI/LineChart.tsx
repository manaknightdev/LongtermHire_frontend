import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import MkdSDK from "@/utils/MkdSDK";

const sdk = new MkdSDK();

interface LineChartProps {
  request?: any;
  options?: any;
  series?: any;
}

const LineChart = ({ request, options = {}, series = [] }: LineChartProps) => {
  const [_option, setOption] = useState(options);
  const [_serie, setSerie] = useState(series);

  useEffect(() => {
    if (request) {
      sdk
        .callRawAPI(request?.route, request?.payload ?? {}, request?.method)
        .then((res) => {
          setOption(Object.keys(res.model)), setSerie(Object.values(res.model));
        })
        .catch((err) => console.error(err));
    }
  }, []);
  return (
    <div className=" flex w-full items-center justify-center">
      <div className="">
        <div className="hidden lg:block">
          <Chart options={options} series={series} type="line" width="420" />
        </div>
        <div className="lg:hidden">
          <Chart options={options} series={series} type="line" width="355" />
        </div>
      </div>
    </div>
  );
};

export default LineChart;
