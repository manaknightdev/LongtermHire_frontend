import React from "react";
import { Loader } from "@/components/Loader";

const NotFoundPage = () => {
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 4000);
  }, []);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="flex justify-center items-center w-full h-screen text-7xl text-gray-700">
          Not Found
        </div>
      )}
    </>
  );
};

export default NotFoundPage;
