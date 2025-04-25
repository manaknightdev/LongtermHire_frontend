# MkdListTable Components

This directory contains various table components for displaying and interacting with tabular data.

## MkdListTableWithQuery

`MkdListTableWithQuery` is a wrapper around `MkdListTableV2` that integrates with React Query for efficient data fetching, caching, and state management.

### Features

- Automatic data fetching using React Query
- Built-in caching and invalidation
- Pagination, sorting, and filtering through query parameters
- Seamless integration with the existing MkdListTableV2 component
- Support for all MkdListTableV2 features (actions, columns, etc.)

### Usage

```tsx
import { MkdListTableWithQuery } from "@/components/MkdListTable";
import { ActionLocations, DisplayEnum } from "@/utils/Enums";

const MyTableComponent = () => {
  // Define columns
  const columns = [
    {
      Header: "ID",
      accessor: "id",
      isSorted: true,
      isSortedDesc: false,
    },
    {
      Header: "Name",
      accessor: "name",
      isSorted: true,
      isSortedDesc: false,
    },
    // Add more columns as needed
  ];

  // Define actions
  const actions = {
    view: {
      show: true,
      multiple: true,
      action: (ids) => console.log("View items:", ids),
      locations: [ActionLocations.DROPDOWN],
      children: "View",
    },
    // Add more actions as needed
  };

  return (
    <MkdListTableWithQuery
      table="project" // Must be a key in queryKeys
      tableRole="admin"
      tableTitle="Projects"
      actions={actions}
      useDefaultColumns={true}
      defaultColumns={columns}
      maxHeight="grid-rows-[auto_1fr_auto]"
      actionPostion={[ActionLocations.DROPDOWN]}
      filterDisplays={[
        DisplayEnum.COLUMNS,
        DisplayEnum.FILTER,
        DisplayEnum.SORT,
      ]}
      defaultPageSize={10}
      onReady={(data) => console.log("Data ready:", data)}
      initialQueryOptions={{
        order: "id",
        direction: "desc",
      }}
    />
  );
};
```

### Props

`MkdListTableWithQuery` accepts all the props of `MkdListTableV2` plus the following:

| Prop | Type | Description |
|------|------|-------------|
| `table` | `keyof typeof queryKeys` | The table/entity name to fetch data for (must be a key in queryKeys) |
| `initialQueryOptions` | `TreeSDKOptions` | Initial options for the query (sorting, filtering, etc.) |

### Refreshing Data

You can refresh the data in two ways:

1. Using the `refreshRef` prop (automatically handled by the component):

```tsx
const refreshRef = useRef(null);

// Later in your component
<button onClick={() => refreshRef.current.click()}>Refresh</button>

<MkdListTableWithQuery
  refreshRef={refreshRef}
  // other props
/>
```

2. Using React Query's invalidation:

```tsx
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/query/queryKeys";

const MyComponent = () => {
  const queryClient = useQueryClient();
  
  const handleRefresh = () => {
    queryClient.invalidateQueries({
      queryKey: [queryKeys.project.paginate, "project"],
    });
  };
  
  // Use handleRefresh in your component
};
```

### Handling Actions

When implementing actions like delete, make sure to invalidate the query to refresh the data:

```tsx
const handleDelete = async (ids) => {
  // Delete logic here
  
  // After successful deletion, invalidate the query
  queryClient.invalidateQueries({
    queryKey: [queryKeys.project.paginate, "project"],
  });
};
```

## See Also

- `MkdListTableV2`: The base table component
- `MkdListTable`: The original table component
- Other related components in this directory
