import { useContexts } from "@/hooks/useContexts";
import { useSDK } from "@/hooks/useSDK";
import React from "react";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const MagicLoginVerifyPage: React.FC = ({}) => {
  const { sdk } = useSDK();
  const { authDispatch: dispatch } = useContexts();

  const navigate = useNavigate();
  const [search] = useSearchParams();

  const login = async (): Promise<void> => {
    try {
      let token = search.get("token") ?? "";
      const result = await sdk.magicLoginVerify(token);
      if (!result.error) {
        dispatch({
          type: "LOGIN",
          payload: result as any
        });
        navigate(`/${result.role}/dashboard`);
      } else {
        navigate("/user/login");
      }
    } catch (error) {
      navigate("/user/login");
    }
  };

  React.useEffect(() => {
    (async () => {
      await login();
    })();
  }, []); // Added dependency array to prevent infinite loop

  return (
    <>
      <div className="flex justify-center items-center min-w-full min-h-screen">
        <svg
          className="w-24 h-24 animate-spin"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </>
  );
};

export default MagicLoginVerifyPage;
