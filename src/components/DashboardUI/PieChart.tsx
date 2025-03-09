import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import MkdSDK from "@/utils/MkdSDK";

const sdk = new MkdSDK();

interface PieChartProps {
  request?: any;
  options?: any;
  series?: any;
}

const PieChart = ({ request, options = {}, series = [] }: PieChartProps) => {
  const [option, setOption] = useState(options);
  const [serie, setSerie] = useState(series);
  // const [label, setLabel] = useState(labels);

  useEffect(() => {
    if (request) {
      sdk
        .callRawAPI(request?.route, request?.payload ?? {}, request?.method)
        .then((res) => {
          setOption(Object.keys(res.model)), setSerie(Object.values(res.model));
        })
        .catch((err) => console.error(err));
    }
  }, [request]);
  return (
    <div className="flex w-full flex-col items-center justify-center">
      <p>piechart</p>
      <div className="hidden lg:block">
        <Chart options={option} series={serie} type="donut" width="420" />
      </div>
      <div className=" lg:hidden">
        <Chart options={option} series={serie} type="donut" width="350" />
      </div>
    </div>
  );
};

// class PieChart extends Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       options: props.options,
//       series: props.series ?? [],
//     };
//   }

//   componentDidMount() {
//     let { request } = this.props;
//     // lables would be the keys and the values would be the series
//     sdk
//       .callRawAPI(request?.route, request?.payload ?? {}, request?.method)
//       .then((res) =>
//         this.setState({
//           options: Object.keys(res.model),
//           series: Object.values(res.model),
//         })
//       )
//       .catch((err) => console.error(err));
//   }

//   render() {
//     return (
//       <div className="donut flex w-full flex-col items-center justify-center">
//         <p>piechart</p>
//         <div className="hidden lg:block">
//           <Chart
//             options={this.state.options}
//             series={this.state.series}
//             type="donut"
//             width="420"
//           />
//         </div>
//         <div className=" lg:hidden">
//           <Chart
//             options={this.state.options}
//             series={this.state.series}
//             type="donut"
//             width="350"
//           />
//         </div>
//       </div>
//     );
//   }
// }

export default PieChart;
