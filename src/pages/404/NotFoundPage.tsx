import React from "react";
import { Loader } from "@/components/Loader";
import { useTheme } from "@/hooks/useTheme";
import { THEME_COLORS } from "@/context/Theme";

const NotFoundPage = () => {
  const { state } = useTheme();
  const mode = state?.theme;
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 4000);
  }, []);

  const containerStyles = {
    backgroundColor: THEME_COLORS[mode].BACKGROUND,
    color: THEME_COLORS[mode].TEXT_SECONDARY,
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div
          className="flex justify-center items-center w-full h-screen text-7xl font-bold transition-colors duration-200"
          style={containerStyles}
        >
          <div className="text-center">
            <h1 className="mb-4">404</h1>
            <p
              className="text-2xl font-normal"
              style={{ color: THEME_COLORS[mode].TEXT }}
            >
              Page Not Found
            </p>
            <p
              className="text-lg mt-4 font-normal"
              style={{ color: THEME_COLORS[mode].TEXT_SECONDARY }}
            >
              The page you're looking for doesn't exist.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default NotFoundPage;
