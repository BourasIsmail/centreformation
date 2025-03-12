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
import { useQuery } from "react-query";
import { getBeneficiaireByProvince, getBenefs } from "@/app/api/Beneficiaire";
import { Beneficiaire } from "@/app/type/Beneficiaire";
import { Commune } from "@/app/type/Commune";
import Link from "next/link";
import { UserInfo } from "@/app/type/UserInfo";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/app/api/index";
import { useRouter } from "next/navigation";

const sexes = [
  { value: "M", label: "Masculin", color: "bg-blue-200 text-blue-800" },
  { value: "F", label: "Féminin", color: "bg-pink-200 text-pink-800" },
];

export const columns: ColumnDef<Beneficiaire>[] = [
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
    accessorKey: "nom",
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
    cell: ({ row }) => <div>{row.getValue("nom")}</div>,
  },
  {
    accessorKey: "prenom",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Prénom
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("prenom")}</div>,
  },
  {
    accessorKey: "dateNaissance",
    header: "Date de naissance",
    cell: ({ row }) => <div>{row.getValue("dateNaissance")}</div>,
  },
  {
    accessorKey: "sexe",
    header: "Sexe",
    cell: ({ row }) => {
      const sexe = sexes.find((s) => s.value === row.getValue("sexe"));
      return (
        <Badge
          className={`font-normal ${
            sexe?.color || "bg-gray-200 text-gray-800"
          }`}
        >
          {sexe?.label || row.getValue("sexe")}
        </Badge>
      );
    },
  },
  {
    accessorKey: "cin",
    header: "CIN",
    cell: ({ row }) => <div>{row.getValue("cin")}</div>,
  },
  {
    accessorKey: "telephone",
    header: "Téléphone",
    cell: ({ row }) => <div>{row.getValue("telephone")}</div>,
  },
  {
    accessorKey: "commune",
    header: "Commune",
    cell: ({ row }) => {
      const commune = row.getValue("commune") as Commune | undefined;
      return <div>{commune?.name || "N/A"}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const beneficiaire = row.original;
      const router = useRouter();
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
            <Link 
            href={beneficiaire.id ? `/beneficiaire/${beneficiaire.id}/suivie`: `#`}>
            <DropdownMenuItem>historique</DropdownMenuItem>
            </Link>
            
            <DropdownMenuItem onClick={() => router.push(`/beneficiaire/${beneficiaire.id}`)}>Modifier</DropdownMenuItem>
            
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

export function BeneficiaireTableComponent() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [sexeFilter, setSexeFilter] = React.useState<string[]>([]);
  const [user, setUser] = useState<UserInfo | null>(null);
    useEffect(() => {
      const fetchUser = async () => {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      };
      fetchUser();
    }, []);
    const {
      data: beneficiaires = [],
      isLoading,
      error,
    } = useQuery({
      queryKey: user?.roles === "ADMIN_ROLES" && user?.province 
        ? ["beneficiaires", user.province.id] 
        : ["beneficiaires"],
      queryFn: () => {
        if (user?.roles === "ADMIN_ROLES" && user?.province) {
          return getBeneficiaireByProvince(user?.province?.id!);
        }
        return getBenefs();
      },
      enabled: !!user, // Ensures the query doesn't run if user is undefined
    });
    
  

  const table = useReactTable({
    data: beneficiaires || [],
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

  React.useEffect(() => {
    table
      .getColumn("sexe")
      ?.setFilterValue(sexeFilter.length ? sexeFilter : undefined);
  }, [sexeFilter, table]);

  if (isLoading) {
    return <div>Chargement des données...</div>;
  }

  if (error) {
    return <div>Une erreur s'est produite lors du chargement des données.</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bénéficiaires</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Input
            placeholder="Rechercher par nom..."
            value={(table.getColumn("nom")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("nom")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <Input
            placeholder="Rechercher par CIN..."
            value={(table.getColumn("cin")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("cin")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="border-dashed">
                Sexe
                <ChevronDownIcon className="ml-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0" align="start">
              <div className="p-2">
                <div className="flex items-center px-2 pb-2">
                  <MagnifyingGlassIcon className="mr-2 h-4 w-4 opacity-50" />
                  <Input
                    placeholder="Rechercher un sexe..."
                    className="h-8 w-full"
                    onChange={(event) => {
                      const searchValue = event.target.value.toLowerCase();
                      const filteredSexes = sexes
                        .filter((sexe) =>
                          sexe.label.toLowerCase().includes(searchValue)
                        )
                        .map((sexe) => sexe.value);
                      setSexeFilter(filteredSexes);
                    }}
                  />
                </div>
                <Separator />
              </div>
              <div className="max-h-[300px] overflow-auto px-2 py-2">
                {sexes.map((sexe) => (
                  <div
                    key={sexe.value}
                    className="flex items-center space-x-2 py-1.5"
                  >
                    <Checkbox
                      checked={sexeFilter.includes(sexe.value)}
                      onCheckedChange={(checked) => {
                        setSexeFilter((prev) =>
                          checked
                            ? [...prev, sexe.value]
                            : prev.filter((s) => s !== sexe.value)
                        );
                      }}
                    />
                    <div className="flex flex-1 items-center space-x-2">
                      <Badge className={`font-normal ${sexe.color}`}>
                        {sexe.label}
                      </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {
                        beneficiaires?.filter(
                          (item) => item.sexe === sexe.value
                        ).length
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
                    setSexeFilter([]);
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
                      {column.id === "nom"
                        ? "Nom"
                        : column.id === "prenom"
                        ? "Prénom"
                        : column.id === "dateNaissance"
                        ? "Date de naissance"
                        : column.id === "sexe"
                        ? "Sexe"
                        : column.id === "cin"
                        ? "CIN"
                        : column.id === "telephone"
                        ? "Téléphone"
                        : column.id === "commune"
                        ? "Commune"
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
