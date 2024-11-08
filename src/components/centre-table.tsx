"use client";

import * as React from "react";
import {
  CaretSortIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
  DotsHorizontalIcon,
  MagnifyingGlassIcon,
  CircleIcon,
  StopwatchIcon,
  CheckCircledIcon,
} from "@radix-ui/react-icons";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type Centre = {
  id: number;
  nomFr: string;
  typeCentre: { id: number; nom: string };
  commune: { id: number; nom: string };
  adresse: string;
  etat: string;
};

const data: Centre[] = [
  {
    id: 1,
    nomFr: "Centre de Formation Professionnelle",
    typeCentre: { id: 1, nom: "CFA" },
    commune: { id: 1, nom: "Casablanca" },
    adresse: "123 Rue de la Formation, Casablanca",
    etat: "Bon",
  },
  {
    id: 2,
    nomFr: "Centre d'Apprentissage",
    typeCentre: { id: 2, nom: "CEF" },
    commune: { id: 2, nom: "Rabat" },
    adresse: "45 Avenue de l'Education, Rabat",
    etat: "Mauvais",
  },
  {
    id: 3,
    nomFr: "Institut Technique Spécialisé",
    typeCentre: { id: 1, nom: "CEF" },
    commune: { id: 3, nom: "Marrakech" },
    adresse: "78 Boulevard Hassan II, Marrakech",
    etat: "Mauvais",
  },
  {
    id: 4,
    nomFr: "Centre de Qualification Professionnelle",
    typeCentre: { id: 3, nom: "CFA" },
    commune: { id: 4, nom: "Tanger" },
    adresse: "15 Rue Ibn Batouta, Tanger",
    etat: "Bon",
  },
  {
    id: 5,
    nomFr: "École des Métiers",
    typeCentre: { id: 2, nom: "CFA" },
    commune: { id: 5, nom: "Fès" },
    adresse: "230 Avenue des FAR, Fès",
    etat: "Moyen",
  },
];

const statuses = [
  {
    value: "Bon",
    label: "Bon",
    icon: CircleIcon,
  },
  {
    value: "Moyen",
    label: "Moyen",
    icon: StopwatchIcon,
  },
  {
    value: "Mauvais",
    label: "Mauvais",
    icon: CheckCircledIcon,
  },
];

const typeCentres = [
  { id: 1, nom: "CFA" },
  { id: 2, nom: "CEF" },
];

export const columns: ColumnDef<Centre>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Sélectionner tout"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Sélectionner la ligne"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "nomFr",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nom
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("nomFr")}</div>,
  },
  {
    accessorKey: "typeCentre",
    header: "Type de Centre",
    cell: ({ row }) => {
      const typeCentre = row.getValue("typeCentre") as
        | { nom: string }
        | undefined;
      return (
        <Badge variant="outline" className="font-normal">
          {typeCentre?.nom || "N/A"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "commune",
    header: "Commune",
    cell: ({ row }) => {
      const commune = row.getValue("commune") as { nom: string } | undefined;
      return commune?.nom || "N/A";
    },
  },
  {
    accessorKey: "adresse",
    header: "Adresse",
    cell: ({ row }) => <div>{row.getValue("adresse")}</div>,
  },
  {
    accessorKey: "etat",
    header: "État",
    cell: ({ row }) => {
      const etat = row.getValue("etat") as string;
      return (
        <Badge
          variant={
            etat === "Bon"
              ? "secondary"
              : etat === "Moyen"
              ? "default"
              : etat === "Mauvais"
              ? "outline"
              : "destructive"
          }
        >
          {etat}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const centre = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Ouvrir le menu</span>
              <DotsHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>Modifier</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function CentreTableComponent() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [statusFilter, setStatusFilter] = React.useState<string[]>([]);
  const [typeCentreFilter, setTypeCentreFilter] = React.useState<string[]>([]);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  // Apply the status filter
  React.useEffect(() => {
    table
      .getColumn("etat")
      ?.setFilterValue(statusFilter.length ? statusFilter : undefined);
  }, [statusFilter, table]);

  // Apply the type centre filter
  React.useEffect(() => {
    table
      .getColumn("typeCentre")
      ?.setFilterValue(
        typeCentreFilter.length
          ? (value: { nom: string }) => typeCentreFilter.includes(value?.nom)
          : undefined
      );
  }, [typeCentreFilter, table]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Centres de Formation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Input
            placeholder="Rechercher des centres..."
            value={(table.getColumn("nomFr")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("nomFr")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <Input
            placeholder="Filtrer par adresse..."
            value={
              (table.getColumn("adresse")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("adresse")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="border-dashed">
                Type de Centre
                <ChevronDownIcon className="ml-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0" align="start">
              <div className="p-2">
                <div className="flex items-center px-2 pb-2">
                  <MagnifyingGlassIcon className="mr-2 h-4 w-4 opacity-50" />
                  <Input
                    placeholder="Rechercher un type..."
                    className="h-8 w-full"
                    onChange={(event) => {
                      const searchValue = event.target.value.toLowerCase();
                      const filteredTypes = typeCentres
                        .filter((type) =>
                          type.nom.toLowerCase().includes(searchValue)
                        )
                        .map((type) => type.nom);
                      setTypeCentreFilter(filteredTypes);
                    }}
                  />
                </div>
                <Separator />
              </div>
              <div className="max-h-[300px] overflow-auto px-2 py-2">
                {typeCentres.map((type) => (
                  <div
                    key={type.id}
                    className="flex items-center space-x-2 py-1.5"
                  >
                    <Checkbox
                      checked={typeCentreFilter.includes(type.nom)}
                      onCheckedChange={(checked) => {
                        setTypeCentreFilter((prev) =>
                          checked
                            ? [...prev, type.nom]
                            : prev.filter((t) => t !== type.nom)
                        );
                      }}
                    />
                    <div className="flex flex-1 items-center space-x-2">
                      <span className="text-sm">{type.nom}</span>
                    </div>
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {
                        data.filter((item) => item.typeCentre.nom === type.nom)
                          .length
                      }
                    </span>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="p-2">
                <Button
                  variant="ghost"
                  className="w-full justify-center text-sm"
                  onClick={() => {
                    setTypeCentreFilter([]);
                  }}
                >
                  Réinitialiser les filtres
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="border-dashed">
                État
                <ChevronDownIcon className="ml-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0" align="start">
              <div className="p-2">
                <div className="flex items-center px-2 pb-2">
                  <MagnifyingGlassIcon className="mr-2 h-4 w-4 opacity-50" />
                  <Input
                    placeholder="Rechercher un statut..."
                    className="h-8 w-full"
                    onChange={(event) => {
                      const searchValue = event.target.value.toLowerCase();
                      const filteredStatuses = statuses
                        .filter((status) =>
                          status.label.toLowerCase().includes(searchValue)
                        )
                        .map((status) => status.value);
                      setStatusFilter(filteredStatuses);
                    }}
                  />
                </div>
                <Separator />
              </div>
              <div className="max-h-[300px] overflow-auto px-2 py-2">
                {statuses.map((status) => (
                  <div
                    key={status.value}
                    className="flex items-center space-x-2 py-1.5"
                  >
                    <Checkbox
                      checked={statusFilter.includes(status.value)}
                      onCheckedChange={(checked) => {
                        setStatusFilter((prev) =>
                          checked
                            ? [...prev, status.value]
                            : prev.filter((s) => s !== status.value)
                        );
                      }}
                    />
                    <div className="flex flex-1 items-center space-x-2">
                      <status.icon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{status.label}</span>
                    </div>
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {data.filter((item) => item.etat === status.value).length}
                    </span>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="p-2">
                <Button
                  variant="ghost"
                  className="w-full justify-center text-sm"
                  onClick={() => {
                    setStatusFilter([]);
                  }}
                >
                  Réinitialiser les filtres
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Colonnes <ChevronDownIcon className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id === "nomFr"
                        ? "Nom"
                        : column.id === "typeCentre"
                        ? "Type de Centre"
                        : column.id === "commune"
                        ? "Commune"
                        : column.id === "adresse"
                        ? "Adresse"
                        : column.id === "etat"
                        ? "État"
                        : column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    Aucun résultat.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} sur{" "}
            {table.getFilteredRowModel().rows.length} ligne(s) sélectionnée(s).
          </div>
          <div className="flex items-center space-x-6 lg:space-x-8">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">Lignes par page</p>
              <select
                className="h-8 w-[70px] rounded-md border border-input bg-transparent px-2 py-1 text-sm outline-none"
                value={table.getState().pagination.pageSize}
                onChange={(e) => {
                  table.setPageSize(Number(e.target.value));
                }}
              >
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex w-[100px] items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} sur{" "}
              {table.getPageCount()}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Aller à la première page</span>
                <DoubleArrowLeftIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Page précédente</span>
                <ChevronLeftIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Page suivante</span>
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Aller à la dernière page</span>
                <DoubleArrowRightIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
