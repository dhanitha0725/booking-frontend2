# DataTable Component Migration Guide

## Overview
A reusable, configurable `DataTable` component has been created to replace repetitive MaterialReactTable implementations across the application.

## Created Files
- **`src/components/DataTable.tsx`** - Generic, configurable DataTable component

## Updated Files
- **`src/features/admin/staff/UserTable.tsx`** - Now uses DataTable
- **`src/features/employee/reservations/ReservationTable.tsx`** - Now uses DataTable
- **`src/features/admin/facilities/FacilityTable.tsx`** - Now uses DataTable
- **`src/features/accountant/inovices/InvoiceTable.tsx`** - Now uses DataTable
- **`src/features/accountant/pricing/PackageTable.tsx`** - Now uses DataTable

## DataTable Component Features

### Interfaces

#### `DataTableColumn<T = any>`
Defines table column configuration:
```typescript
{
  id?: string;
  accessorKey?: keyof T | string;
  header: string;
  size?: number;
  Cell?: (props: { cell: { getValue: () => any }; row: { original: T } }) => ReactNode;
  [key: string]: any; // Allows additional MRT properties
}
```

#### `DataTableConfig`
Table behavior configuration:
```typescript
{
  enablePagination?: boolean;          // Default: true
  enableFilters?: boolean;              // Default: true
  enableColumnFilters?: boolean;        // Default: true
  enableGlobalFilter?: boolean;         // Default: true
  enableColumnResizing?: boolean;       // Default: true
  enableSorting?: boolean;              // Default: true
  enableRowSelection?: boolean;         // Default: false
  layoutMode?: "grid" | "grid-no-grow" | "semantic"; // Default: "grid"
  pageSize?: number;                   // Default: 10
  containerSx?: SxProps<Theme>;        // Custom MUI styles
}
```

#### `DataTableProps<T = any>`
Component props:
```typescript
{
  data: T[];                           // Table data
  columns: DataTableColumn<T>[];       // Column definitions
  config?: DataTableConfig;            // Table configuration
  tableOptions?: Partial<MRT_TableOptions<any>>; // Advanced MRT options
}
```

## Usage Examples

### Basic Usage (UserTable)
```typescript
import DataTable, { type DataTableColumn, type DataTableConfig } from "../../../components/DataTable";

const UserTable: React.FC<UserTableProps> = ({ users }) => {
  const columns = useMemo<DataTableColumn<User>[]>(
    () => [
      { accessorKey: "firstName", header: "First Name", size: 150 },
      { accessorKey: "lastName", header: "Last Name", size: 150 },
      { accessorKey: "email", header: "Email", size: 200 },
      { accessorKey: "role", header: "Role", size: 120, Cell: ({ cell }) => renderRoleChip(cell.getValue()) },
    ],
    []
  );

  const config: DataTableConfig = {
    enablePagination: true,
    enableFilters: true,
    enableSorting: true,
    layoutMode: "grid",
  };

  return <DataTable data={users} columns={columns} config={config} />;
};
```

### Advanced Usage with Actions (FacilityTable)
```typescript
const columns = useMemo<DataTableColumn<AdminFacilityDetails>[]>(
  () => [
    { accessorKey: "facilityId", header: "ID", size: 100 },
    { accessorKey: "facilityName", header: "Facility Name", size: 200 },
    {
      accessorKey: "status",
      header: "Status",
      size: 150,
      Cell: ({ cell }) => renderStatusChip(cell.getValue()),
    },
    {
      id: "actions",
      header: "Actions",
      size: 180,
      Cell: ({ row }) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title="View Details">
            <IconButton size="small" color="primary" onClick={() => onViewDetails(row.original.facilityId)}>
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ],
  [onViewDetails]
);
```

## Benefits

1. **Code Reusability** - Eliminates duplicate MaterialReactTable setup
2. **Consistency** - All tables use the same configuration and behavior
3. **Maintainability** - Single source of truth for table logic
4. **Type Safety** - Full TypeScript support with generic types
5. **Flexibility** - Configurable through simple prop objects
6. **Extensibility** - Supports custom columns, formatters, and actions

## Key Improvements Made

### Before (Typical Table Component)
- 100+ lines of boilerplate code
- Repeated MaterialReactTable setup
- Manual column type definitions
- Inconsistent configurations

### After (Using DataTable)
- 30-40 lines of clean, focused code
- Column definitions only
- Consistent behavior across all tables
- Simple configuration object

## Migration Checklist

When migrating other tables to use DataTable:

- [ ] Import DataTable component
- [ ] Define column array with `DataTableColumn<T>[]` type
- [ ] Define config object with `DataTableConfig` type
- [ ] Remove MaterialReactTable imports
- [ ] Remove useMaterialReactTable hook calls
- [ ] Pass data, columns, and config to DataTable
- [ ] Test table functionality (sorting, filtering, pagination)

## Performance Considerations

- Columns are memoized to prevent unnecessary re-renders
- Table instance is created inside DataTable with proper dependencies
- Forward ref support for advanced use cases
- Configurable pagination defaults to 10 items per page

## Browser Compatibility

Same as MaterialReactTable - supports all modern browsers.

## Future Enhancements

Possible improvements:
- Export/import functionality
- Row selection handlers
- Custom cell renderers registry
- Theme customization
- Sticky headers
- Column freezing
