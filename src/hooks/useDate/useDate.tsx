const useDate = (): {
  convertDate: (
    date: string | number | Date,
    opts?: Intl.DateTimeFormatOptions
  ) => string;
} => {
  
  const convertDate = (
    date: string | number | Date,
    opts?: Intl.DateTimeFormatOptions
  ): string => {
    const newDate = new Date(date);

    const options: Intl.DateTimeFormatOptions = {
      year: "2-digit",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      ...opts
    }

    return newDate.toLocaleDateString(undefined, options);
  };

  return {
    convertDate,
  };
};

export default useDate;
