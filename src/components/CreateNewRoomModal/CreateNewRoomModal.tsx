import React from "react";
import { AuthContext } from "@/context/Auth";
import MkdSDK from "@/utils/MkdSDK";

export const renderName = (user: any) => {
  if (user?.first_name && user?.last_name) {
    return `${user?.first_name} ${user.last_name}`;
  } else if (user?.first_name || user?.last_name) {
    if (user?.first_name) {
      return user?.first_name;
    } else {
      return user?.last_name;
    }
  } else {
    return user?.email;
  }
};

interface CreateNewRoomModalProps {
  roles: string[];
  createNewRoom: (user?: any) => void;
  setCreateRoom: (value?: boolean) => void;
}

const CreateNewRoomModal = ({
  roles,
  createNewRoom,
  setCreateRoom,
}: CreateNewRoomModalProps) => {
  const [otherUsers, setOtherUsers] = React.useState<any[]>([]);
  const [unfilteredUsers, setUnfilteredUsers] = React.useState<any[]>([]);
  const [search, setSearch] = React.useState("");
  const { state } = React.useContext(AuthContext);

  let sdk = new MkdSDK();
  const getAllUsers = async () => {
    try {
      let users = await sdk.getAllUsers();

      if (!users.error) {
        let filtered: any[] = [];
        if (roles.length) {
          filtered = users?.list.filter(
            (user: any) => roles.includes(user.role) && state.user !== user?.id
          );
        } else {
          filtered = users?.list.filter((user: any) => state.user !== user?.id);
        }
        setOtherUsers(filtered);
        setUnfilteredUsers(
          users?.list.filter((user: any) => user.id !== state.user)
        );
      }
    } catch (err) {
      console.log("Error", err);
    }
  };

  const filterList = (value: string) => {
    setSearch(value);
    if (value.length > 0) {
      setOtherUsers(
        [...unfilteredUsers].filter((user) =>
          `${user.first_name.toLowerCase()} ${user.last_name.toLowerCase()}`.includes(
            value.toLowerCase()
          )
        )
      );
    } else {
      setOtherUsers(unfilteredUsers);
    }
  };

  React.useEffect(() => {
    (async function () {
      await getAllUsers();
    })();
  }, []);

  return (
    <>
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div
          className="fixed inset-0 h-full w-full bg-black opacity-40"
          onClick={() => setCreateRoom(false)}
        ></div>
        <div className="flex min-h-screen items-center px-4 py-8">
          <div className="relative mx-auto w-full max-w-lg rounded-md bg-white p-4 shadow-lg">
            <div className="mt-3 sm:flex">
              <div className="mt-2 w-full px-2 text-center sm:ml-4 sm:text-left">
                <input
                  type="text"
                  className="block w-full border-b-2 border-gray-200 bg-transparent py-2 outline-none"
                  placeholder="Search"
                  value={search}
                  onChange={(e) => filterList(e.target.value)}
                />
                <ul className="scrollbar-hide mt-4 h-[50vh] w-full overflow-y-scroll text-sm font-medium text-gray-900">
                  {otherUsers &&
                    otherUsers.map((user) => (
                      <li
                        key={user.id}
                        onClick={() => createNewRoom(user)}
                        className={`w-full cursor-pointer bg-white px-4 py-2 hover:bg-gray-200 user-${user.id}`}
                      >
                        {renderName(user)}
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateNewRoomModal;
