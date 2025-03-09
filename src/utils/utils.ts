// import prettier from "prettier/standalone";
// import parserBabel from "prettier/parser-babel";
// recovery
export function classNames(
  ...classes: (string | boolean | undefined)[]
): string {
  return classes.filter(Boolean).join(" ");
}

export const getNonNullValue = (value: any): any | undefined => {
  if (value !== "") {
    return value;
  } else {
    return undefined;
  }
};

export function filterEmptyFields<T extends Record<string, any>>(
  object: T
): Partial<T> {
  Object.keys(object).forEach((key) => {
    if (empty(object[key])) {
      delete object[key];
    }
  });
  return object;
}

export function empty(value: any): boolean {
  return (
    value === "" ||
    value === null ||
    value === undefined ||
    value === "undefined"
  );
}

export const isImage = (file: { file: File }): boolean => {
  const validImageTypes = ["image/gif", "image/jpeg", "image/jpg", "image/png"];
  if (validImageTypes.includes(file.file.type)) return true;
  return false;
};

export const isVideo = (file: { file: File }): boolean => {
  const validVideoTypes = ["video/webm", "video/mp4"];
  if (validVideoTypes.includes(file.file.type)) return true;
  return false;
};

export const isPdf = (file: { file: File }): boolean => {
  const validPdfTypes = ["application/pdf"];
  if (validPdfTypes.includes(file.file.type)) return true;
  return false;
};

export function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function capitalize(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function dateHandle(date: string | Date): string {
  return new Date(date).toLocaleDateString();
}

export function ghrapDate(date: string | Date): string {
  const d = new Date(date);
  const month = d.toLocaleString("default", { month: "short" });
  const day = d.getDate();
  const year = d.getFullYear();
  return `${month} ${day}, ${year}`;
}

// export function formatCode(code: string): string {
//   try {
//     return prettier.format(code, {
//       parser: "babel",
//       plugins: [parserBabel],
//     });
//   } catch (error) {
//     console.error("Error formatting code:", error);
//     return code;
//   }
// }

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

interface StringCaserOptions {
  separator?: "space" | string;
  casetype?:
    | "uppercase"
    | "lowercase"
    | "capitalize"
    | "camelCase"
    | "PascalCase";
}

export function StringCaser(
  string: string,
  options: StringCaserOptions = {}
): string {
  const { separator, casetype = "lowercase" } = options;
  let words = string.split(/[\s_-]/);

  switch (casetype) {
    case "uppercase":
      words = words.map((word) => word.toUpperCase());
      break;
    case "lowercase":
      words = words.map((word) => word.toLowerCase());
      break;
    case "capitalize":
      words = words.map(
        (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      );
      break;
    case "camelCase":
      words = words.map((word, index) =>
        index === 0
          ? word.toLowerCase()
          : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      );
      break;
    case "PascalCase":
      words = words.map(
        (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      );
      break;
  }

  if (separator === "space") {
    return words.join(" ");
  } else if (separator) {
    return words.join(separator);
  }

  return words.join("");
}

interface TableColumn {
  header: string;
  accessor: string;
  show: boolean;
  isSorted?: boolean;
  isSortedDesc?: boolean;
  mappingExist?: boolean;
  mappings?: Record<string | number, string>;
}

export const testColumns: TableColumn[] = [
  {
    header: "Action",
    accessor: "",
    show: true,
  },
  {
    header: "Id",
    accessor: "id",
    show: false,
    isSorted: false,
    isSortedDesc: false,
    mappingExist: false,
    mappings: {},
  },
  {
    header: "User Id",
    accessor: "user_id",
    show: false,
    isSorted: false,
    isSortedDesc: false,
    mappingExist: false,
    mappings: {},
  },
  {
    header: "First Name",
    accessor: "first_name",
    show: true,
    isSorted: false,
    isSortedDesc: false,
    mappingExist: false,
    mappings: {},
  },
  {
    header: "Last Name",
    accessor: "last_name",
    show: true,
    isSorted: false,
    isSortedDesc: false,
    mappingExist: false,
    mappings: {},
  },
  {
    header: "Email",
    accessor: "email",
    show: true,
    isSorted: false,
    isSortedDesc: false,
    mappingExist: false,
    mappings: {},
  },
  {
    header: "Role",
    accessor: "role",
    show: true,
    isSorted: false,
    isSortedDesc: false,
    mappingExist: true,
    mappings: {
      admin: "Admin",
      employee: "Employee",
    },
  },
  {
    header: "Photo",
    accessor: "photo",
    show: true,
    isSorted: false,
    isSortedDesc: false,
    mappingExist: false,
    mappings: {},
  },
  {
    header: "Phone",
    accessor: "phone",
    show: true,
    isSorted: false,
    isSortedDesc: false,
    mappingExist: false,
    mappings: {},
  },
  {
    header: "Status",
    accessor: "status",
    show: false,
    isSorted: false,
    isSortedDesc: false,
    mappingExist: true,
    mappings: { 0: "pending", 1: "approved" },
  },
  {
    header: "Type",
    accessor: "type",
    show: false,
    isSorted: false,
    isSortedDesc: false,
    mappingExist: true,
    mappings: {
      0: "normal",
      1: "facebook",
      2: "google",
    },
  },
  {
    header: "Verify",
    accessor: "verify",
    show: false,
    isSorted: false,
    isSortedDesc: false,
    mappingExist: true,
    mappings: {
      0: "not verified",
      1: "verified",
    },
  },
  {
    header: "Create At",
    accessor: "create_at",
    show: false,
    isSorted: false,
    isSortedDesc: false,
    mappingExist: false,
    mappings: {},
  },
  {
    header: "Update At",
    accessor: "update_at",
    show: false,
    isSorted: false,
    isSortedDesc: false,
    mappingExist: false,
    mappings: {},
  },
];

interface Component {
  id: string;
  parent?: string;
  children: Component[];
}

interface Config {
  [key: string]: {
    nodes: string[];
  };
}

const reorderingFunction = (
  node: string[],
  component: Component
): Component[] => {
  return node.map((nodeId) => {
    // Find the component that matches the current node ID
    const orderedComponent = component.children.find(
      (componentChild) => componentChild.id === nodeId
    );
    return orderedComponent!;
  });
};

export function insertChildrenIntoParents(
  components: Component[],
  config: Config
): Component[] {
  const componentsMap: { [key: string]: Component } = {};
  components.forEach((component) => {
    componentsMap[component.id] = component;
    component.children = [];
    // Initialize an empty children array for each component
  });

  // Iterate through the components and insert each child into its parent's children array
  components.forEach((component) => {
    const parentId = component.parent;
    if (parentId && componentsMap[parentId]) {
      const parent = componentsMap[parentId];
      const child = componentsMap[component.id];
      parent.children.push(child);
    }
  });

  // sort children according to their parents node
  components.forEach((component) => {
    if (component.children.length > 0) {
      const reorderedComponents = reorderingFunction(
        config[component.id].nodes,
        component
      );
      component.children = reorderedComponents;
    }
  });

  // Remove the "parent" property from each component
  components.forEach((component) => {
    delete component.parent;
  });

  return components;
}

export const RoleMap = {
  super_admin: "admin",
  admin: "admin",
};

export const updatedRolesFn = (role: keyof typeof RoleMap, location: any) => {
  const determinedRole = role ? RoleMap?.[role] : RoleMap.admin;
  if (!determinedRole) {
    if (location.pathname.includes("admin")) {
      return "admin";
    }
    return "user";
  }

  return determinedRole;
};

export function truncate(
  text: string,
  length: number | null
): string | undefined {
  if (typeof text !== "string") return;
  const substring = length
    ? `${text.substring(0, length)}${text.length > length ? "..." : ""}`
    : text.substring(0);
  return substring;
}
