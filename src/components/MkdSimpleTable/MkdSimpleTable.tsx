interface MkdSimpleTableProps {
  data: any[];
  className?: string;
  title?: string;
}

const MkdSimpleTable = ({
  data = [],
  className = "",
  title,
}: MkdSimpleTableProps) => {
  return (
    <div className={`w-full p-5 ${className}`}>
      <div className="flex flex-col gap-[2.5rem]">
        <div className="relative min-h-fit w-full ">
          <div
            className={`absolute left-0 top-[-15px] m-auto flex gap-5 bg-background text-text`}
          >
            {/* <TableCellsIcon className="h-6 w-6" /> */}
            {title ? title : "Data Table"}
          </div>
          <div className="relative mt-5 min-h-fit w-full max-w-full overflow-auto">
            {data.length ? (
              <table className="min-h-[6.25rem] w-full border border-border bg-table">
                <thead className="min-h-[50px] bg-table-header">
                  <tr className="w-fit ">
                    {data.length
                      ? Object.keys(data[0]).map((item, index) => (
                          <th
                            key={`${item}_${index}`}
                            scope="col"
                            className="border border-border px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text"
                          >
                            {item}
                          </th>
                        ))
                      : null}
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, rowIndex) => (
                    <tr
                      key={rowIndex}
                      className="w-fit hover:bg-table-row-hover transition-colors duration-200"
                    >
                      {Object.values(row).map((value: any, valueKey: any) => (
                        <td
                          key={valueKey}
                          // scope="col"
                          className="border border-border px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text"
                        >
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MkdSimpleTable;
