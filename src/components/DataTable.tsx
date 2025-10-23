/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ReactNode, useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_TableOptions,
} from "material-react-table";
import { Box, SxProps, Theme } from "@mui/material";

/**
 * Generic column configuration for DataTable
 */
export interface DataTableColumn<T = any> {
  id?: string;
  accessorKey?: keyof T | string;
  header: string;
  size?: number;
  Cell?: (props: {
    cell: { getValue: () => any };
    row: { original: T };
  }) => ReactNode;
  [key: string]: any;
}

/**
 * Configuration for table state and behavior
 */
export interface DataTableConfig {
  enablePagination?: boolean;
  enableFilters?: boolean;
  enableColumnFilters?: boolean;
  enableGlobalFilter?: boolean;
  enableColumnResizing?: boolean;
  enableSorting?: boolean;
  enableRowSelection?: boolean;
  layoutMode?: "grid" | "grid-no-grow" | "semantic";
  pageSize?: number;
  containerSx?: SxProps<Theme>;
}

/**
 * Generic DataTable component props
 */
export interface DataTableProps<T = any> {
  data: T[];
  columns: DataTableColumn<T>[];
  config?: DataTableConfig;
  tableOptions?: Partial<MRT_TableOptions<any>>;
}

/**
 * Reusable DataTable component that works with any data type
 * @template T - The data type for the table
 */
function DataTable<T = any>(
  { data, columns, config = {}, tableOptions = {} }: DataTableProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const {
    enablePagination = true,
    enableFilters = true,
    enableColumnFilters = true,
    enableGlobalFilter = true,
    enableColumnResizing = true,
    enableSorting = true,
    enableRowSelection = false,
    layoutMode = "grid",
    pageSize = 10,
    containerSx = {},
  } = config;

  // Memoize columns to prevent unnecessary re-renders
  const memoizedColumns = useMemo<Array<MRT_ColumnDef<any>>>(
    () =>
      columns.map((col) => ({
        ...col,
        id: col.id || (col.accessorKey as string),
      })) as Array<MRT_ColumnDef<any>>,
    [columns]
  );

  // Create table instance
  const table = useMaterialReactTable({
    columns: memoizedColumns,
    data,
    layoutMode: layoutMode as "grid" | "grid-no-grow" | "semantic",
    enablePagination,
    enableFilters,
    enableColumnFilters,
    enableGlobalFilter,
    enableColumnResizing,
    enableSorting,
    enableRowSelection,
    muiTableContainerProps: {
      sx: {
        maxWidth: "100%",
        ...containerSx,
      },
    },
    initialState: {
      pagination: {
        pageSize,
        pageIndex: 0,
      },
    },
    ...tableOptions,
  });

  return (
    <Box sx={{ width: "100%" }} ref={ref}>
      <MaterialReactTable table={table} />
    </Box>
  );
}

const DataTableComponent = React.forwardRef(
  DataTable
) as React.ForwardRefExoticComponent<
  DataTableProps & React.RefAttributes<HTMLDivElement>
>;
DataTableComponent.displayName = "DataTable";

export default DataTableComponent;
