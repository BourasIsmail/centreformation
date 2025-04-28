"use client"

import * as React from "react"
import {
  CaretSortIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
  DotsHorizontalIcon,
  MagnifyingGlassIcon,
} from "@radix-ui/react-icons"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "react-query"
import { getPersonnelByProvince, getPersonnels } from "@/app/api/Personnel"
import type { Personnel } from "@/app/type/Personnel"
import type { UserInfo } from "@/app/type/UserInfo"
import { useEffect, useState } from "react"
import { getCurrentUser } from "@/app/api/index"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/app/api"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function PersonnelTableComponent() {
  const router = useRouter()
  const { toast } = useToast()

  const niveauEtudeOptions = [
    { value: "bac", label: "Baccalauréat", color: "bg-purple-200 text-purple-800" },
    { value: "licence", label: "Licence", color: "bg-indigo-200 text-indigo-800" },
    { value: "master", label: "Master", color: "bg-pink-200 text-pink-800" },
    { value: "doctorat", label: "Doctorat", color: "bg-red-200 text-red-800" },
  ]

  const columns: ColumnDef<Personnel>[] = [
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
      accessorKey: "nomComplet",
      header: ({ column }) => {
        return (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
              Nom Complet
              <CaretSortIcon className="ml-2 h-4 w-4" />
            </Button>
        )
      },
      cell: ({ row }) => <div>{row.getValue("nomComplet")}</div>,
    },
    {
      accessorKey: "telephone",
      header: "Téléphone",
      cell: ({ row }) => <div>{row.getValue("telephone")}</div>,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => <div>{row.getValue("email")}</div>,
    },
    {
      accessorKey: "cin",
      header: "CIN",
      cell: ({ row }) => <div>{row.getValue("cin")}</div>,
    },
    {
      accessorKey: "fonction",
      header: "Fonction",
      cell: ({ row }) => <div>{row.getValue("fonction")}</div>,
    },
    {
      accessorKey: "vacataire",
      header: "Vacataire",
      cell: ({ row }) => {
        const vacataire = row.getValue("vacataire") as boolean
        return (
            <Badge className={vacataire ? "bg-green-200 text-green-800" : "bg-gray-200 text-gray-800"}>
              {vacataire ? "Oui" : "Non"}
            </Badge>
        )
      },
    },
    {
      accessorKey: "niveauEtude",
      header: "Niveau d'Étude",
      cell: ({ row }) => {
        const niveauEtude = row.getValue("niveauEtude") as string
        const status = niveauEtudeOptions.find((s) => s.value === niveauEtude)

        if (!row.original.vacataire || !niveauEtude) {
          return <div className="text-gray-400">N/A</div>
        }

        return (
            <Badge className={`font-normal ${status?.color || "bg-gray-200 text-gray-800"}`}>
              {status?.label || niveauEtude}
            </Badge>
        )
      },
    },
    {
      accessorKey: "province",
      header: "Province",
      cell: ({ row }) => {
        const province = row.original.province
        return province?.name || "N/A"
      },
    },
    {
      accessorKey: "commune",
      header: "Commune",
      cell: ({ row }) => {
        const commune = row.original.commune
        return commune?.name || "N/A"
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const personnel = row.original

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
                <DropdownMenuItem onClick={() => router.push(`/personnels/${personnel.id}`)}>Modifier</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => {
                      setPersonnelToDelete(personnel)
                      setIsDeleteDialogOpen(true)
                    }}
                >
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        )
      },
    },
  ]
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [vacataireFilter, setVacataireFilter] = React.useState<boolean | null>(null)
  const [niveauEtudeFilter, setNiveauEtudeFilter] = React.useState<string[]>([])
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [personnelToDelete, setPersonnelToDelete] = useState<Personnel | null>(null)

  const [user, setUser] = useState<UserInfo | null>(null)
  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
    }
    fetchUser()
  }, [])

  const handleDeletePersonnel = async () => {
    if (!personnelToDelete || !personnelToDelete.id) return

    try {
      await api.delete(`/personnel/${personnelToDelete.id}`)
      toast({
        title: "Succès",
        description: "Le personnel a été supprimé avec succès.",
        className: "bg-green-500 text-white",
      })
      refetch()
    } catch (error) {
      console.error("Erreur lors de la suppression du personnel:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression du personnel.",
        variant: "destructive",
      })
    } finally {
      setPersonnelToDelete(null)
      setIsDeleteDialogOpen(false)
    }
  }

  const {
    data: personnels,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: user?.roles === "ADMIN_ROLES" && user?.province ? ["personnels", user?.province?.id] : ["personnels"],
    queryFn:
        user?.roles === "ADMIN_ROLES" && user?.province
            ? () => getPersonnelByProvince(user?.province?.id!)
            : getPersonnels,
  })
  const table = useReactTable({
    data: personnels || [],
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
  })

  React.useEffect(() => {
    if (vacataireFilter !== null) {
      table.getColumn("vacataire")?.setFilterValue(vacataireFilter)
    } else {
      table.getColumn("vacataire")?.setFilterValue(undefined)
    }
  }, [vacataireFilter, table])

  React.useEffect(() => {
    table.getColumn("niveauEtude")?.setFilterValue(niveauEtudeFilter.length ? niveauEtudeFilter : undefined)
  }, [niveauEtudeFilter, table])

  if (isLoading) {
    return <div>Chargement des données...</div>
  }

  if (error) {
    return <div>Une erreur s'est produite lors du chargement des données.</div>
  }

  return (
      <Card>
        <CardHeader>
          <CardTitle>Liste du Personnel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Input
                placeholder="Rechercher par nom..."
                value={(table.getColumn("nomComplet")?.getFilterValue() as string) ?? ""}
                onChange={(event) => table.getColumn("nomComplet")?.setFilterValue(event.target.value)}
                className="max-w-sm"
            />
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="border-dashed">
                  Vacataire
                  <ChevronDownIcon className="ml-2 h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0" align="start">
                <div className="max-h-[300px] overflow-auto px-2 py-2">
                  <div className="flex items-center space-x-2 py-1.5">
                    <Checkbox
                        checked={vacataireFilter === true}
                        onCheckedChange={(checked) => {
                          setVacataireFilter(checked ? true : vacataireFilter === false ? null : false)
                        }}
                    />
                    <div className="flex flex-1 items-center space-x-2">
                      <span className="text-sm">Oui</span>
                    </div>
                    <span className="text-xs text-muted-foreground tabular-nums">
                    {personnels?.filter((item) => item.vacataire === true).length}
                  </span>
                  </div>
                  <div className="flex items-center space-x-2 py-1.5">
                    <Checkbox
                        checked={vacataireFilter === false}
                        onCheckedChange={(checked) => {
                          setVacataireFilter(checked ? false : vacataireFilter === true ? null : true)
                        }}
                    />
                    <div className="flex flex-1 items-center space-x-2">
                      <span className="text-sm">Non</span>
                    </div>
                    <span className="text-xs text-muted-foreground tabular-nums">
                    {personnels?.filter((item) => item.vacataire === false).length}
                  </span>
                  </div>
                </div>
                <Separator />
                <div className="p-2">
                  <Button
                      variant="ghost"
                      className="w-full justify-center text-sm"
                      onClick={() => {
                        setVacataireFilter(null)
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
                  Niveau d'Étude
                  <ChevronDownIcon className="ml-2 h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0" align="start">
                <div className="p-2">
                  <div className="flex items-center px-2 pb-2">
                    <MagnifyingGlassIcon className="mr-2 h-4 w-4 opacity-50" />
                    <Input
                        placeholder="Rechercher un niveau..."
                        className="h-8 w-full"
                        onChange={(event) => {
                          const searchValue = event.target.value.toLowerCase()
                          const filteredNiveaux = niveauEtudeOptions
                              .filter((niveau) => niveau.label.toLowerCase().includes(searchValue))
                              .map((niveau) => niveau.value)
                          setNiveauEtudeFilter(filteredNiveaux)
                        }}
                    />
                  </div>
                  <Separator />
                </div>
                <div className="max-h-[300px] overflow-auto px-2 py-2">
                  {niveauEtudeOptions.map((niveau) => (
                      <div key={niveau.value} className="flex items-center space-x-2 py-1.5">
                        <Checkbox
                            checked={niveauEtudeFilter.includes(niveau.value)}
                            onCheckedChange={(checked) => {
                              setNiveauEtudeFilter((prev) =>
                                  checked ? [...prev, niveau.value] : prev.filter((n) => n !== niveau.value),
                              )
                            }}
                        />
                        <div className="flex flex-1 items-center space-x-2">
                          <span className="text-sm">{niveau.label}</span>
                        </div>
                        <span className="text-xs text-muted-foreground tabular-nums">
                      {personnels?.filter((item) => item.niveauEtude === niveau.value).length}
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
                        setNiveauEtudeFilter([])
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
                              onCheckedChange={(value) => column.toggleVisibility(!!value)}
                          >
                            {column.id}
                          </DropdownMenuCheckboxItem>
                      )
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
                              {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                            </TableHead>
                        )
                      })}
                    </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                        <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                          {row.getVisibleCells().map((cell) => (
                              <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                          ))}
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="h-24 text-center">
                        Aucun résultat.
                      </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} sur {table.getFilteredRowModel().rows.length} ligne(s)
              sélectionnée(s).
            </div>
            <div className="flex items-center space-x-6 lg:space-x-8">
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium">Lignes par page</p>
                <select
                    className="h-8 w-[70px] rounded-md border border-input bg-transparent px-2 py-1 text-sm outline-none"
                    value={table.getState().pagination.pageSize}
                    onChange={(e) => {
                      table.setPageSize(Number(e.target.value))
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
                Page {table.getState().pagination.pageIndex + 1} sur {table.getPageCount()}
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
        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ce personnel ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action est irréversible. Le personnel{" "}
                <span className="font-semibold">{personnelToDelete?.nomComplet}</span> sera définitivement supprimé.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setPersonnelToDelete(null)}>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeletePersonnel} className="bg-destructive text-destructive-foreground">
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Card>
  )
}
