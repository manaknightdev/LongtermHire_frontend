import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MkdListTableV2 } from "@/components/MkdListTable";
import { LazyLoad } from "@/components/LazyLoad";
import {
  Action,
  ActionLocations,
} from "@/components/MkdListTable/MkdListTableV2";
import { EditIcon, EyeIcon, PlusIcon } from "lucide-react";
import { useContexts } from "@/hooks/useContexts";
import { ModalSidebar } from "@/components/ModalSidebar";
import {
  AddAdminWireframeTablePage,
  ViewAdminWireframeTablePage,
} from "@/routes/LazyLoad";
import { TableActionEnum } from "@/utils/Enums";

// let sdk = new MkdSDK();

// function formatDate(date) {
//   const newDate = new Date(date);
//   const year = newDate.getFullYear();
//   const month = (newDate.getMonth() + 1).toString().padStart(2, "0");
//   const day = newDate.getDate().toString().padStart(2, "0");
//   return `${year}-${month}-${day}`;
// }

interface LocalData {
  modal: TableActionEnum | null;
  showModal: boolean;
  selectedItems: number[];
}

const columns = [
  {
    header: "Row",
    accessor: "row",
  },
  {
    header: "Name",
    accessor: "name",
    isSorted: false,
    selected_column: true,
    isSortedDesc: false,
    mappingExist: false,
    mappings: {},
  },
  {
    header: "Created Date",
    accessor: "created_at",
    isSorted: false,
    selected_column: true,
    isSortedDesc: false,
    mappingExist: false,
    mappings: {},
  },
  {
    header: "Updated Date",
    accessor: "updated_at",
    isSorted: false,
    selected_column: true,
    isSortedDesc: false,
    mappingExist: false,
    mappings: {},
  },
  {
    header: "Action",
    accessor: "",
  },
];

const ActionProperties: {
  [key: string]: {
    title: string;
    icon?: React.ReactNode;
    customMinWidthInTw?: string;
  };
} = {
  add: {
    title: "Add Project",
    icon: <PlusIcon />,
    customMinWidthInTw:
      "md:min-w-[18.75rem] md:w-[18.775rem] md:max-w-[18.75rem] w-full",
  },
  view: {
    title: "View Project",
    icon: <EyeIcon />,
    customMinWidthInTw: "md:min-w-[30rem] md:w-[30rem] md:max-w-[30rem] w-full",
  },
};
const ListAdminWireframeTablePage: React.FC = () => {
  // refresh ref
  const refreshRef = useRef(null) as any;

  // context
  const { globalDispatch } = useContexts();

  // local state
  const [localData, setLocalData] = useState<LocalData>({
    modal: null,
    showModal: false,
    selectedItems: [],
  });

  // other hooks
  const navigate = useNavigate();

  // update state
  const updateState = (fields: Array<keyof LocalData>, values: Array<any>) => {
    const newState = fields.reduce((acc, field, index) => {
      acc[field] = values[index];
      return acc;
    }, {} as Partial<LocalData>);

    setLocalData((prevData) => ({
      ...prevData,
      ...newState,
    }));
  };

  // table actions
  const actions: { [key: string]: Action } = {
    [TableActionEnum.EDIT]: {
      show: true,
      action: (ids: number[]) => {
        navigate(`/admin/edit-wireframe/${ids[0]}`);
      },
      locations: [ActionLocations.DROPDOWN],
      children: "Edit",
      icon: <EditIcon />,
    },
    [TableActionEnum.ADD]: {
      show: true,
      action: (ids: number[]) => {
        updateState(
          ["modal", "showModal", "selectedItems"],
          [TableActionEnum.ADD, true, ids]
        );
      },
      locations: [],
      children: "Add",
      icon: <PlusIcon />,
    },
    [TableActionEnum.VIEW]: {
      show: true,
      action: (ids: number[]) => {
        updateState(
          ["modal", "showModal", "selectedItems"],
          [TableActionEnum.VIEW, true, ids]
        );
      },
      locations: [ActionLocations.DROPDOWN],
      children: "View",
      icon: <EyeIcon />,
    },
  };

  // useEffect
  React.useEffect(() => {
    globalDispatch({
      type: "SETPATH",
      payload: {
        path: "wireframe",
      },
    });
  }, []);

  return (
    <>
      <div className="grid h-full max-h-full min-h-full w-full grid-cols-1 grid-rows-1 p-8">
        <LazyLoad counts={[1, 3, 2, 1, 2]} count={5}>
          <MkdListTableV2
            table={"project"}
            actions={actions}
            refreshRef={refreshRef}
            useDefaultColumns={true}
            defaultColumns={columns}
            tableRole={"super_admin"}
            maxHeight={`grid-rows-[auto_1fr_auto]`}
          />
        </LazyLoad>
      </div>

      <ModalSidebar
        showHeader
        isModalActive={
          localData.showModal &&
          [TableActionEnum.ADD, TableActionEnum.VIEW].includes(localData.modal!)
        }
        closeModalFn={() =>
          updateState(
            ["showModal", "modal", "selectedItems"],
            [false, null, []]
          )
        }
        title={ActionProperties?.[localData.modal!]?.title}
        customMinWidthInTw={
          ActionProperties?.[localData.modal!]?.customMinWidthInTw
        }
      >
        {[TableActionEnum.ADD].includes(localData.modal!) ? (
          <AddAdminWireframeTablePage
            onClose={() => {
              updateState(
                ["showModal", "modal", "selectedItems"],
                [false, null, []]
              );
            }}
            onSuccess={() => {
              updateState(
                ["showModal", "modal", "selectedItems"],
                [false, null, []]
              );
              refreshRef?.current?.click();
            }}
          />
        ) : null}

        {[TableActionEnum.VIEW].includes(localData.modal!) ? (
          <ViewAdminWireframeTablePage
            activeId={localData.selectedItems[0]}
            onClose={() => {
              updateState(
                ["showModal", "modal", "selectedItems"],
                [false, null, []]
              );
            }}
          />
        ) : null}
      </ModalSidebar>
    </>
  );
};

export default ListAdminWireframeTablePage;
