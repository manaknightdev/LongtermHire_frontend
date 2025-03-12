import { useMemo } from "react";
import { useContexts } from "@/hooks/useContexts";
import { ToastStatusEnum } from "@/utils/Enums";
import {
  FlowState,
  Role,
  Route,
  Model,
  Settings
} from "@/context/Global/types";

interface UseProjectConfigHookResult {
  handleFileChange: (e: any) => void;
  configuration: FlowState;
  handleDeleteConfig: () => void;
}

const useProjectConfigHook = (): UseProjectConfigHookResult => {
  const {
    projectConfig: { updateSettings, updateModels, updateRoutes, updateRoles },
    showToast,
    globalState: { settings, models, routes, roles }
  } = useContexts();

  const configuration: FlowState = useMemo(() => {
    return {
      settings,
      models,
      routes,
      roles
    };
  }, [settings, models, routes, roles]);

  const handleFileUpload = (content: string) => {
    try {
      const configuration = JSON.parse(content);

      // Update all state directly
      if (configuration.settings) {
        updateSettings(configuration.settings);
      }
      if (configuration.models) {
        updateModels(configuration.models);
      }
      if (configuration.routes) {
        updateRoutes(configuration.routes);
      }
      if (configuration.roles) {
        updateRoles(configuration.roles);
      }

      showToast(
        "Configuration imported successfully",
        500,
        ToastStatusEnum.SUCCESS
      );
    } catch (error) {
      console.error("Error importing configuration:", error);
      showToast(
        "Failed to import configuration. Invalid file format.",
        5000,
        ToastStatusEnum.ERROR
      );
    }
  };

  const handleFileChange = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        handleFileUpload(content);
      };
      reader.readAsText(file);
    }
  };
  const handleDeleteConfig = () => {
    updateSettings({} as Settings);
    updateModels([] as Model[]);
    updateRoutes([] as Route[]);
    updateRoles([] as Role[]);
  };

  return {
    handleFileChange,
    configuration,
    handleDeleteConfig
  };
};
export default useProjectConfigHook;
