import { memo } from "react";

interface CurrencyCellProps {
  currency: string;
  value: string;
}

const CurrencyCell = memo(({ currency, value }: CurrencyCellProps) => (
  <>
    {currency}
    {value}
  </>
));

export default CurrencyCell;
