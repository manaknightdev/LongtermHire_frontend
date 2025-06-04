import React from "react";
import { useTheme } from "@/hooks/useTheme";
import { THEME_COLORS } from "@/context/Theme";

export const ThemeStyles: React.FC = () => {
  const { state } = useTheme();
  const mode = state?.theme;

  const styles = `
    :root {
      --primary-color: ${THEME_COLORS[mode].PRIMARY};
      --primary-hover-color: ${THEME_COLORS[mode].PRIMARY_HOVER};
      --primary-active-color: ${THEME_COLORS[mode].PRIMARY_ACTIVE};
      --primary-disabled-color: ${THEME_COLORS[mode].PRIMARY_DISABLED};
      --primary-selected-color: ${THEME_COLORS[mode].PRIMARY_SELECTED};
      --primary-selected-hover-color: ${THEME_COLORS[mode].PRIMARY_SELECTED_HOVER};
      --primary-selected-active-color: ${THEME_COLORS[mode].PRIMARY_SELECTED_ACTIVE};
      --primary-selected-disabled-color: ${THEME_COLORS[mode].PRIMARY_SELECTED_DISABLED};
      --primary-disabled-selected-color: ${THEME_COLORS[mode].PRIMARY_DISABLED_SELECTED};
      --primary-disabled-selected-hover-color: ${THEME_COLORS[mode].PRIMARY_DISABLED_SELECTED_HOVER};
      --primary-disabled-selected-active-color: ${THEME_COLORS[mode].PRIMARY_DISABLED_SELECTED_ACTIVE};
      --primary-disabled-selected-disabled-color: ${THEME_COLORS[mode].PRIMARY_DISABLED_SELECTED_DISABLED};

      --secondary-color: ${THEME_COLORS[mode].SECONDARY};
      --secondary-hover-color: ${THEME_COLORS[mode].SECONDARY_HOVER};
      --secondary-active-color: ${THEME_COLORS[mode].SECONDARY_ACTIVE};
      --secondary-disabled-color: ${THEME_COLORS[mode].SECONDARY_DISABLED};
      --secondary-selected-color: ${THEME_COLORS[mode].SECONDARY_SELECTED};
      --secondary-selected-hover-color: ${THEME_COLORS[mode].SECONDARY_SELECTED_HOVER};
      --secondary-selected-active-color: ${THEME_COLORS[mode].SECONDARY_SELECTED_ACTIVE};
      --secondary-selected-disabled-color: ${THEME_COLORS[mode].SECONDARY_SELECTED_DISABLED};
      --secondary-disabled-selected-color: ${THEME_COLORS[mode].SECONDARY_DISABLED_SELECTED};
      --secondary-disabled-selected-hover-color: ${THEME_COLORS[mode].SECONDARY_DISABLED_SELECTED_HOVER};
      --secondary-disabled-selected-active-color: ${THEME_COLORS[mode].SECONDARY_DISABLED_SELECTED_ACTIVE};
      --secondary-disabled-selected-disabled-color: ${THEME_COLORS[mode].SECONDARY_DISABLED_SELECTED_DISABLED};

      --background-color: ${THEME_COLORS[mode].BACKGROUND};
      --background-hover-color: ${THEME_COLORS[mode].BACKGROUND_HOVER};
      --background-active-color: ${THEME_COLORS[mode].BACKGROUND_ACTIVE};
      --background-disabled-color: ${THEME_COLORS[mode].BACKGROUND_DISABLED};
      --background-selected-color: ${THEME_COLORS[mode].BACKGROUND_SELECTED};
      --background-selected-hover-color: ${THEME_COLORS[mode].BACKGROUND_SELECTED_HOVER};
      --background-selected-active-color: ${THEME_COLORS[mode].BACKGROUND_SELECTED_ACTIVE};
      --background-selected-disabled-color: ${THEME_COLORS[mode].BACKGROUND_SELECTED_DISABLED};
      --background-disabled-selected-color: ${THEME_COLORS[mode].BACKGROUND_DISABLED_SELECTED};
      --background-disabled-selected-hover-color: ${THEME_COLORS[mode].BACKGROUND_DISABLED_SELECTED_HOVER};
      --background-disabled-selected-active-color: ${THEME_COLORS[mode].BACKGROUND_DISABLED_SELECTED_ACTIVE};
      --background-disabled-selected-disabled-color: ${THEME_COLORS[mode].BACKGROUND_DISABLED_SELECTED_DISABLED};

      --border-color: ${THEME_COLORS[mode].BORDER};
      --border-hover-color: ${THEME_COLORS[mode].BORDER_HOVER};
      --border-active-color: ${THEME_COLORS[mode].BORDER_ACTIVE};
      --border-disabled-color: ${THEME_COLORS[mode].BORDER_DISABLED};
      --border-selected-color: ${THEME_COLORS[mode].BORDER_SELECTED};
      --border-selected-hover-color: ${THEME_COLORS[mode].BORDER_SELECTED_HOVER};
      --border-selected-active-color: ${THEME_COLORS[mode].BORDER_SELECTED_ACTIVE};
      --border-selected-disabled-color: ${THEME_COLORS[mode].BORDER_SELECTED_DISABLED};
      --border-disabled-selected-color: ${THEME_COLORS[mode].BORDER_DISABLED_SELECTED};
      --border-disabled-selected-hover-color: ${THEME_COLORS[mode].BORDER_DISABLED_SELECTED_HOVER};
      --border-disabled-selected-active-color: ${THEME_COLORS[mode].BORDER_DISABLED_SELECTED_ACTIVE};
      --border-disabled-selected-disabled-color: ${THEME_COLORS[mode].BORDER_DISABLED_SELECTED_DISABLED};

      --text-color: ${THEME_COLORS[mode].TEXT};
      --text-hover-color: ${THEME_COLORS[mode].TEXT_HOVER};
      --text-active-color: ${THEME_COLORS[mode].TEXT_ACTIVE};
      --text-disabled-color: ${THEME_COLORS[mode].TEXT_DISABLED};
      --text-selected-color: ${THEME_COLORS[mode].TEXT_SELECTED};
      --text-selected-hover-color: ${THEME_COLORS[mode].TEXT_SELECTED_HOVER};
      --text-selected-active-color: ${THEME_COLORS[mode].TEXT_SELECTED_ACTIVE};
      --text-selected-disabled-color: ${THEME_COLORS[mode].TEXT_SELECTED_DISABLED};
      --text-disabled-selected-color: ${THEME_COLORS[mode].TEXT_DISABLED_SELECTED};
      --text-disabled-selected-hover-color: ${THEME_COLORS[mode].TEXT_DISABLED_SELECTED_HOVER};
      --text-disabled-selected-active-color: ${THEME_COLORS[mode].TEXT_DISABLED_SELECTED_ACTIVE};
      --text-disabled-selected-disabled-color: ${THEME_COLORS[mode].TEXT_DISABLED_SELECTED_DISABLED};

      --icon-color: ${THEME_COLORS[mode].ICON};
      --icon-hover-color: ${THEME_COLORS[mode].ICON_HOVER};
      --icon-active-color: ${THEME_COLORS[mode].ICON_ACTIVE};
      --icon-disabled-color: ${THEME_COLORS[mode].ICON_DISABLED};
      --icon-selected-color: ${THEME_COLORS[mode].ICON_SELECTED};
      --icon-selected-hover-color: ${THEME_COLORS[mode].ICON_SELECTED_HOVER};
      --icon-selected-active-color: ${THEME_COLORS[mode].ICON_SELECTED_ACTIVE};
      --icon-selected-disabled-color: ${THEME_COLORS[mode].ICON_SELECTED_DISABLED};
      --icon-disabled-selected-color: ${THEME_COLORS[mode].ICON_DISABLED_SELECTED};
      --icon-disabled-selected-hover-color: ${THEME_COLORS[mode].ICON_DISABLED_SELECTED_HOVER};
      --icon-disabled-selected-active-color: ${THEME_COLORS[mode].ICON_DISABLED_SELECTED_ACTIVE};
      --icon-disabled-selected-disabled-color: ${THEME_COLORS[mode].ICON_DISABLED_SELECTED_DISABLED};

      --input-color: ${THEME_COLORS[mode].INPUT};
      --input-hover-color: ${THEME_COLORS[mode].INPUT_HOVER};
      --input-active-color: ${THEME_COLORS[mode].INPUT_ACTIVE};
      --input-disabled-color: ${THEME_COLORS[mode].INPUT_DISABLED};
      --input-selected-color: ${THEME_COLORS[mode].INPUT_SELECTED};
      --input-selected-hover-color: ${THEME_COLORS[mode].INPUT_SELECTED_HOVER};
      --input-selected-active-color: ${THEME_COLORS[mode].INPUT_SELECTED_ACTIVE};
      --input-selected-disabled-color: ${THEME_COLORS[mode].INPUT_SELECTED_DISABLED};
      --input-disabled-selected-color: ${THEME_COLORS[mode].INPUT_DISABLED_SELECTED};
      --input-disabled-selected-hover-color: ${THEME_COLORS[mode].INPUT_DISABLED_SELECTED_HOVER};
      --input-disabled-selected-active-color: ${THEME_COLORS[mode].INPUT_DISABLED_SELECTED_ACTIVE};
      --input-disabled-selected-disabled-color: ${THEME_COLORS[mode].INPUT_DISABLED_SELECTED_DISABLED};

      --accent-color: ${THEME_COLORS[mode].ACCENT};
      --accent-hover-color: ${THEME_COLORS[mode].ACCENT_HOVER};
      --accent-active-color: ${THEME_COLORS[mode].ACCENT_ACTIVE};
      --accent-disabled-color: ${THEME_COLORS[mode].ACCENT_DISABLED};
      --accent-selected-color: ${THEME_COLORS[mode].ACCENT_SELECTED};
      --accent-selected-hover-color: ${THEME_COLORS[mode].ACCENT_SELECTED_HOVER};
      --accent-selected-active-color: ${THEME_COLORS[mode].ACCENT_SELECTED_ACTIVE};
      --accent-selected-disabled-color: ${THEME_COLORS[mode].ACCENT_SELECTED_DISABLED};
      --accent-disabled-selected-color: ${THEME_COLORS[mode].ACCENT_DISABLED_SELECTED};
      --accent-disabled-selected-hover-color: ${THEME_COLORS[mode].ACCENT_DISABLED_SELECTED_HOVER};
      --accent-disabled-selected-active-color: ${THEME_COLORS[mode].ACCENT_DISABLED_SELECTED_ACTIVE};
      --accent-disabled-selected-disabled-color: ${THEME_COLORS[mode].ACCENT_DISABLED_SELECTED_DISABLED};

      --side-bar-nav-color: ${THEME_COLORS[mode].SIDE_BAR_NAV};
      --side-bar-nav-hover-color: ${THEME_COLORS[mode].SIDE_BAR_NAV_HOVER};
      --side-bar-nav-active-color: ${THEME_COLORS[mode].SIDE_BAR_NAV_ACTIVE};
      --side-bar-nav-disabled-color: ${THEME_COLORS[mode].SIDE_BAR_NAV_DISABLED};
      --side-bar-nav-selected-color: ${THEME_COLORS[mode].SIDE_BAR_NAV_SELECTED};
      --side-bar-nav-selected-hover-color: ${THEME_COLORS[mode].SIDE_BAR_NAV_SELECTED_HOVER};
      --side-bar-nav-selected-active-color: ${THEME_COLORS[mode].SIDE_BAR_NAV_SELECTED_ACTIVE};
      --side-bar-nav-selected-disabled-color: ${THEME_COLORS[mode].SIDE_BAR_NAV_SELECTED_DISABLED};
      --side-bar-nav-disabled-selected-color: ${THEME_COLORS[mode].SIDE_BAR_NAV_DISABLED_SELECTED};
      --side-bar-nav-disabled-selected-hover-color: ${THEME_COLORS[mode].SIDE_BAR_NAV_DISABLED_SELECTED_HOVER};
      --side-bar-nav-disabled-selected-active-color: ${THEME_COLORS[mode].SIDE_BAR_NAV_DISABLED_SELECTED_ACTIVE};
      --side-bar-nav-disabled-selected-disabled-color: ${THEME_COLORS[mode].SIDE_BAR_NAV_DISABLED_SELECTED_DISABLED};

      --table-color: ${THEME_COLORS[mode].TABLE};
      --table-header-color: ${THEME_COLORS[mode].TABLE_HEADER};
      --table-header-hover-color: ${THEME_COLORS[mode].TABLE_HEADER_HOVER};
      --table-header-active-color: ${THEME_COLORS[mode].TABLE_HEADER_ACTIVE};
      --table-header-selected-color: ${THEME_COLORS[mode].TABLE_HEADER_SELECTED};
      --table-header-column-color: ${THEME_COLORS[mode].TABLE_HEADER_COLUMN};
      --table-header-column-hover-color: ${THEME_COLORS[mode].TABLE_HEADER_COLUMN_HOVER};
      --table-header-column-active-color: ${THEME_COLORS[mode].TABLE_HEADER_COLUMN_ACTIVE};
      --table-header-column-selected-color: ${THEME_COLORS[mode].TABLE_HEADER_COLUMN_SELECTED};
      --table-row-color: ${THEME_COLORS[mode].TABLE_ROW};
      --table-row-hover-color: ${THEME_COLORS[mode].TABLE_ROW_HOVER};
      --table-row-active-color: ${THEME_COLORS[mode].TABLE_ROW_ACTIVE};
      --table-row-selected-color: ${THEME_COLORS[mode].TABLE_ROW_SELECTED};
      --table-row-column-color: ${THEME_COLORS[mode].TABLE_ROW_COLUMN};
      --table-row-column-hover-color: ${THEME_COLORS[mode].TABLE_ROW_COLUMN_HOVER};
      --table-row-column-active-color: ${THEME_COLORS[mode].TABLE_ROW_COLUMN_ACTIVE};
      --table-row-column-selected-color: ${THEME_COLORS[mode].TABLE_ROW_COLUMN_SELECTED};

      --font-size: 1rem;
      --line-height: normal;
    }

    /* Base styles that will be applied to the entire app */
    body {
      @apply bg-background text-base leading-base;
    }

    /* Utility classes for theme colors */
    .theme-primary {
      @apply text-primary;
    }

    .theme-secondary {
      @apply text-secondary;
    }

    .theme-bg-primary {
      @apply bg-primary;
    }

    .theme-bg-secondary {
      @apply bg-secondary;
    }

    .theme-border-primary {
      @apply border-primary;
    }

    .theme-border-secondary {
      @apply border-secondary;
    }
  `;

  return <style>{styles}</style>;
};
