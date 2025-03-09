import { memo } from "react";
import { MkdInput } from "@/components/MkdInput";

import { LazyLoad } from "@/components/LazyLoad";

// const fillZero = (value, length = 2) => {
//   return value < 10 ? `0${value}` : value;
// };

interface MkdListTableFilterDateRangeProps {
  data: any;
  setValue: any;
  field: string;
}
const MkdListTableFilterDateRange = ({
  data = {},
  setValue,
  field,
}: MkdListTableFilterDateRangeProps) => {
  const handleSetData = (value: string, position: string) => {
    if (["start"].includes(position)) {
      const [_, end] = data?.value?.split(",");
      setValue(
        field,
        [`'${value?.replaceAll("'", "")}'`, `'${end?.replaceAll("'", "")}'`]
          .filter(Boolean)
          .join(","),
        data?.uid
      );
    }

    if (["end"].includes(position)) {
      const [start, _] = data?.value?.split(",");
      setValue(
        field,
        [`'${start?.replaceAll("'", "")}'`, `'${value?.replaceAll("'", "")}'`]
          .filter(Boolean)
          .join(","),
        data?.uid
      );
    }
  };

  return (
    <div className="grid w-full grid-cols-2 items-end gap-2 md:w-full">
      <div className={`!grow`}>
        <LazyLoad>
          <MkdInput
            type="date"
            // disabled={true}
            // errors={errors}
            // register={register}
            value={data?.value?.split(",")[0]?.replaceAll("'", "")}
            onChange={(e: { target: { value: any } }) => {
              handleSetData(e?.target?.value, "start");
            }}
            name={"date_from"}
            label={"From"}
            placeholder={"Date From..."}
            labelClassName="text-left"
            className={`!h-[2.25rem] !rounded-[0.125rem] !border !py-[0.5rem]`}
          />
        </LazyLoad>
      </div>
      <div className={`!grow`}>
        <LazyLoad>
          <MkdInput
            type="date"
            // errors={errors}
            // register={register}
            value={data?.value?.split(",")[1]?.replaceAll("'", "")}
            onChange={(e: { target: { value: any } }) => {
              handleSetData(e?.target?.value, "end");
            }}
            name={"date_to"}
            label={"To"}
            placeholder={"Date To..."}
            labelClassName="text-left"
            className={`!h-[2.25rem] !rounded-[0.125rem] !border !py-[0.5rem]`}
          />
        </LazyLoad>
      </div>
    </div>
  );
};
export default memo(MkdListTableFilterDateRange);
