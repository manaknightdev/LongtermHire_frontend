import React, { useCallback, useEffect, useState } from "react";
import { MkdInput } from "@/components/MkdInput";
import { MkdButton } from "@/components/MkdButton";
import {
  GlobalContext,
  createRequest,
  getSingleModel,
  updateRequest
} from "@/context/Global";
import { AuthContext } from "@/context/Auth";
import { InteractiveButton } from "@/components/InteractiveButton";
import { StringCaser } from "@/utils/utils";
import { useProfile } from "@/hooks/useProfile";
import { LazyLoad } from "@/components/LazyLoad";
import { ActionConfirmationModal } from "@/components/ActionConfirmationModal";
import { Modal } from "@/components/Modal";
import { ColumnsIcon, DotIcon, PlusIcon } from "lucide-react";

interface SetColumnsProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (data: any) => void;
  onSuccess: (data: any) => void;
  columnModel: string;
  columnData: any;
}

const SetColumns = ({
  isOpen = false,
  onClose,
  onUpdate,
  onSuccess,
  columnModel = "",
  columnData = null
}: SetColumnsProps) => {
  const { Capitalize } = new StringCaser();

  // if (!isOpen) return null;
  const { dispatch } = React.useContext(AuthContext);
  const {
    dispatch: globalDispatch,
    state: { updateModel, createModel }
  } = React.useContext(GlobalContext);

  const { profile } = useProfile();

  const [states, setStates] = useState({
    modal: "",
    viewName: "",
    showModal: false,
    isDirty: false
  });
  const [toKey, setToKey] = useState(null);
  const [fromKey, setFromKey] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [localColumnData, setLocalColumnData] = useState({
    views: [],
    data: null,
    columns: [],
    columnId: 0,
    ...columnData
  });
  const [selectedId, setSelectedId] = useState(columnData?.data?.id);
  const [localColumns, setLocalColumns] = useState([...columnData?.columns]);

  const onToggleColumn = (column: any, key: number) => {
    const tempColumns = [...localColumns];
    tempColumns.splice(key, 1, {
      ...column,
      selected_column: !column?.selected_column
    });
    setLocalColumns(() => [...tempColumns]);
    if (!states.isDirty) {
      setStates((prev) => {
        return {
          ...prev,
          isDirty: true
        };
      });
    }
  };

  const setCurrentView = (view: any) => {
    const scopedColumns = view?.columns && JSON.parse(view?.columns);
    setSelectedId(view?.id);
    setLocalColumnData((prev: any) => {
      return {
        ...prev,
        columnId: view?.column_id,
        columns: scopedColumns,
        data: view
      };
    });
    setLocalColumns(() => [...scopedColumns]);
    if (!states.isDirty) {
      setStates((prev) => {
        return {
          ...prev,
          isDirty: true
        };
      });
    }
  };
  const saveColumns = async () => {
    if (localColumnData && localColumnData?.data?.user_id) {
      updateColumns();
    } else {
      createColumns("");
    }
  };

  const updateColumns = async () => {
    const scopedColumns = [...localColumns];
    const tempLocalColumnData = localColumnData;

    const result = states?.isDirty
      ? await updateRequest(
          globalDispatch,
          dispatch,
          "column_views",
          selectedId,
          {
            columns: JSON.stringify(scopedColumns),
            current_view: true
          }
        )
      : { error: true };

    if (!result?.error) {
      const columnViewResult = await getSingleModel(
        globalDispatch,
        dispatch,
        "column_views",
        selectedId,
        {
          allowToast: false
        }
      );
      const currentView = tempLocalColumnData?.views?.find(
        (item: any) => item?.current_view && item?.id !== selectedId
      );
      if (currentView) {
        await updateRequest(
          globalDispatch,
          dispatch,
          "column_views",
          currentView?.id,
          {
            current_view: false
          }
        );
      }
      if (states.isDirty) {
        setStates((prev) => {
          return {
            ...prev,
            isDirty: false
          };
        });
      }
      if (onSuccess) {
        onSuccess({
          ...tempLocalColumnData,
          data: columnViewResult?.data,
          columns: localColumns,
          views: [
            ...tempLocalColumnData?.views.filter(
              (view: any) => view?.id !== selectedId
            ),
            columnViewResult?.data
          ]
        });
      }
    } else {
      if (onSuccess) {
        onSuccess({
          ...tempLocalColumnData,
          columns: localColumns
        });
      }
    }
  };

  const createNewView = useCallback(
    async (data = { name: "", id: null }) => {
      const tempLocalColumnData = localColumnData;
      const payload = {
        ...data,
        model: columnModel,
        current_view: true,
        column_id: localColumnData?.columnId,
        user_id: profile?.id,
        columns: JSON.stringify(localColumns)
      };
      const currentView = tempLocalColumnData?.views?.find(
        (item: any) => item?.current_view
      );
      if (currentView) {
        await updateRequest(
          globalDispatch,
          dispatch,
          "column_views",
          currentView?.id,
          {
            current_view: false
          }
        );
      }
      setLocalColumnData((prev: any) => {
        return {
          ...prev,
          data: payload,
          columnId: localColumnData?.columnId,
          views: [...prev?.views, payload]
        };
      });
      setSelectedId(data?.id);
      if (onUpdate) {
        onUpdate({
          ...tempLocalColumnData,
          data: payload,
          columns: localColumns,
          views: [...tempLocalColumnData?.views, payload]
        });
      }
      if (states.isDirty) {
        setStates((prev) => {
          return {
            ...prev,
            isDirty: false
          };
        });
      }
    },
    [states, onSuccess, localColumns, localColumnData, columnModel, onUpdate]
  );

  const createColumns = useCallback(
    async (viewName: string) => {
      const scopedColumns = [...localColumns];
      const tempLocalColumnData = localColumnData;
      // console.log("columnData?.user_id >>", Boolean(columnData?.user_id));
      if (!states?.viewName || !viewName) {
        return setStates((prev) => {
          return {
            ...prev,
            showModal: true,
            modal: "enter_name"
          };
        });
      }
      // return console.log("columnData >>", columnData);
      const result = await createRequest(
        globalDispatch,
        dispatch,
        "column_views",
        {
          model: columnModel,
          current_view: true,
          column_id: localColumnData?.columnId,
          user_id: profile?.id,
          name: states?.viewName || viewName,
          columns: JSON.stringify(scopedColumns)
        }
      );

      if (!result?.error) {
        const columnViewResult = await getSingleModel(
          globalDispatch,
          dispatch,
          "column_views",
          result?.data,
          {
            allowToast: false
          }
        );

        const currentView = tempLocalColumnData?.views?.find(
          (item: any) => item?.current_view && item?.id !== selectedId
        );
        if (currentView) {
          await updateRequest(
            globalDispatch,
            dispatch,
            "column_views",
            currentView?.id,
            {
              current_view: false
            }
          );
        }
        if (states.isDirty) {
          setStates((prev) => {
            return {
              ...prev,
              isDirty: false
            };
          });
        }
        if (onSuccess) {
          onSuccess({
            ...tempLocalColumnData,
            data: columnViewResult?.data,
            columns: localColumns,
            views: [...tempLocalColumnData?.views, columnViewResult?.data]
          });
        }
      }
    },
    [states, onSuccess, localColumns, localColumnData, columnModel]
  );

  const onDragStart = (_e: any, key: any) => {
    // e.preventDefault();
    // console.log("onDragStart");
    setFromKey(key);
    setDragging(true);
  };
  const onDrop = (e: any) => {
    e.preventDefault();
    if (fromKey && toKey && fromKey != toKey) {
      const tempColumns = [...localColumns];
      const fromColumn = tempColumns[fromKey];
      // const toColumn = tempColumns[toKey];

      tempColumns.splice(fromKey, 1);
      tempColumns.splice(toKey, 0, fromColumn);
      setLocalColumns(() => [...tempColumns]);
      if (!states.isDirty) {
        setStates((prev) => {
          return {
            ...prev,
            isDirty: true
          };
        });
      }
    }
    setToKey(null);
    setFromKey(null);
    setDragging(false);
  };
  const onDragOver = (e: any, key: any) => {
    e.preventDefault();

    setToKey(key);
    // if (fromKey != key) {
    // }
  };
  // const onDragEnter = (e: any) => {
  //   e.preventDefault();
  // };
  const onDragEnd = (e: any) => {
    e.preventDefault();
    setToKey(null);
    setFromKey(null);
    // console.log("onDragEnd");

    setDragging(false);
  };
  const onDragLeave = (e: any) => {
    e.preventDefault();
    setToKey(null);
    // setFromKey(null);
  };

  useEffect(() => {
    if (columnData?.data?.name) {
      setStates((prev) => {
        return {
          ...prev,
          viewName: columnData?.data?.name
        };
      });
    }

    if (columnData?.columns) {
      setLocalColumns(() => [...columnData?.columns]);
    }
    setLocalColumnData(() => columnData);
    setSelectedId(columnData?.data?.id);
  }, [columnData?.data?.name, columnData?.columns]);

  return (
    <>
      <Modal
        isOpen={isOpen}
        modalCloseClick={() => onClose && onClose()}
        modalHeader
        title={
          <div className="font-inter flex items-center gap-2 text-[1.125rem] font-bold leading-[1.5rem] text-[#18181B]">
            <ColumnsIcon /> Columns
          </div>
        }
        // headerContent={
        //   <ModalSidebarHeader
        //     cancelText="Close"
        //     onToggleModal={() => setOpenColumns(false)}
        //   />
        // }
        classes={{
          modalDialog:
            "!grid grid-rows-[auto_90%] !gap-0 !w-full !px-0 md:!w-[30.375rem] md:min-h-[70%] md:h-[70%] md:max-h-[70%] max-h-[70%] min-h-[70%]",
          modalContent: `!z-10 !mt-0 !px-0 overflow-hidden !pt-0`,
          modal: "h-full"
        }}
      >
        <div
          className={`!font-inter relative mx-auto grid h-full max-h-full min-h-full w-full grow grid-cols-1 grid-rows-[auto_1fr_auto] gap-5 rounded px-5 text-start leading-snug tracking-wide`}
        >
          <div className="grid w-full min-w-full max-w-full grid-cols-[1fr_auto] grid-rows-1 items-center justify-start gap-2 py-1">
            <div className="scrollbar-hide flex w-full min-w-full max-w-full items-center justify-start gap-2 overflow-auto">
              {localColumnData?.views?.length
                ? localColumnData?.views.map((view: any, viewKey: any) => {
                    return (
                      <MkdButton
                        type="button"
                        key={viewKey}
                        animation={false}
                        showPlus={false}
                        onClick={() => setCurrentView(view)}
                        className={`flex h-full w-fit min-w-fit max-w-fit items-center justify-between rounded-md !py-0 ${
                          view?.id === selectedId
                            ? "!bg-primary !text-white"
                            : "!border-soft-200 !text-sub-500 !bg-transparent"
                        }`}
                      >
                        {view?.name}
                      </MkdButton>
                    );
                  })
                : null}
            </div>
            <MkdButton
              type="button"
              onClick={() => {
                setStates((prev) => {
                  return {
                    ...prev,
                    showModal: true,
                    modal: "new_view"
                  };
                });
              }}
              className={`flex h-full w-fit items-center justify-between rounded-md !border-0 !bg-white !py-0`}
            >
              <PlusIcon className="h-5 w-5" />
            </MkdButton>
          </div>
          <div className="space-y-5 overflow-auto">
            <div
              className={`h-full max-h-full min-h-full w-full overflow-y-auto`}
            >
              {localColumns.map((column, columnKey) => {
                if (!["Row", "Action"].includes(column?.header)) {
                  return (
                    <div
                      draggable
                      onDragStart={(e) => onDragStart(e, columnKey)}
                      onDragEnd={onDragEnd}
                      onDragOver={(e) => onDragOver(e, columnKey)}
                      onDragLeave={(e) => onDragLeave(e)}
                      onDrop={(e) => onDrop(e)}
                      className={`${
                        dragging ? "cursor-grabbing" : "cursor-grab"
                      } flex h-[2.5rem] w-full items-center justify-between rounded-md p-2 ${
                        toKey == columnKey ? "bg-primary-light text-white" : ""
                      }`}
                      key={columnKey}
                    >
                      <DotIcon
                        className={`${
                          dragging ? "cursor-grabbing" : "cursor-grab"
                        }`}
                      />
                      <div className="grow px-5 text-left !capitalize">
                        {Capitalize(column?.header, {
                          separator: " "
                        })}
                      </div>
                      <div>
                        <MkdInput
                          type="toggle"
                          onChange={() => onToggleColumn(column, columnKey)}
                          value={column?.selected_column}
                        />
                      </div>
                    </div>
                  );
                }
              })}
            </div>
          </div>

          <div className="relative flex gap-5">
            <div className="w-1/2">
              <MkdButton
                onClick={() => onClose && onClose()}
                disabled={updateModel?.loading || createModel?.loading}
                className={`!bg-soft-200 !text-sub-500 !w-full !grow !border-none`}
              >
                Cancel
              </MkdButton>
            </div>
            {/* <div
          className={`flex h-fit w-1/2 items-center justify-end gap-[.75rem] border`}
        > */}
            <InteractiveButton
              type={"button"}
              disabled={updateModel?.loading || createModel?.loading}
              loading={updateModel?.loading || createModel?.loading}
              onClick={() => {
                // if (onSuccess) {
                //   onSuccess(localColumns);
                // }
                saveColumns();
              }}
              // onClick={saveColumns}
              className={`w-1/2`}
            >
              Save and Close
            </InteractiveButton>
            {/* </div> */}
          </div>
        </div>
      </Modal>
      <LazyLoad>
        <ActionConfirmationModal
          isOpen={
            states?.showModal &&
            ["enter_name", "new_view"].includes(states?.modal)
          }
          title="Save View"
          modalClasses={{
            modalDialog:
              "max-h-[90%] min-h-[12rem] overflow-y-auto !w-full md:!w-[29.0625rem]",
            modal: "h-full"
          }}
          // data={{ id: selectedItems, data }}
          onClose={() => {
            setStates((prev) => {
              return {
                ...prev,
                modal: "",
                viewName: "",
                showModal: false
              };
            });
          }}
          onSuccess={(data: any) => {
            if (["new_view"].includes(states?.modal)) {
              createNewView(data);
            }
            if (["enter_name"].includes(states?.modal)) {
              createColumns(data?.["name"]);
            }
            setStates((prev) => {
              return {
                ...prev,
                modal: "",
                viewName: data?.["name"],
                showModal: false
              };
            });
          }}
          data={{
            model: columnModel,
            current_view: true,
            column_id: localColumnData?.columnId,
            user_id: profile?.id,
            name: states?.viewName,
            columns: JSON.stringify(localColumns)
          }}
          action={["new_view"].includes(states?.modal) ? "create" : "save"}
          mode={["new_view"].includes(states?.modal) ? "input_create" : "input"}
          input={"name"}
          customMessage="Enter View Name"
          multiple={false}
          table={"column_views"}
          // inputConfirmation={false}
          role={profile?.role}
        />
      </LazyLoad>
    </>
  );
};

export default SetColumns;
