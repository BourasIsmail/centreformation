"use client"

import * as React from "react"
import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
  MagnifyingGlassIcon,
  TrashIcon,
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { useQuery } from "react-query"
import type { Activite } from "@/app/type/Activite"
import { getActivites } from "@/app/api/Activite"
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

export function ActiviteTableComponent() {
  const router = useRouter()
  const { toast } = useToast()
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [typeFilter, setTypeFilter] = React.useState<string[]>([])
  const [searchValue, setSearchValue] = React.useState("")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
  const [activiteToDelete, setActiviteToDelete] = React.useState<Activite | null>(null)

  const {
    data: activites,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: "activites",
    queryFn: getActivites,
  })

  const columns: ColumnDef<Activite>[] = [
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
      accessorKey: "typeActivite",
      header: ({ column }) => {
        return (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
              Type d'Activité
              <CaretSortIcon className="ml-2 h-4 w-4" />
            </Button>
        )
      },
      cell: ({ row }) => <div>{row.original.typeActivite?.name}</div>,
    },
    {
      accessorKey: "dateOuverture",
      header: ({ column }) => {
        return (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
              Date d'Ouverture
              <CaretSortIcon className="ml-2 h-4 w-4" />
            </Button>
        )
      },
      cell: ({ row }) => <div>{row.getValue("dateOuverture")}</div>,
    },
    {
      accessorKey: "responsableActivite",
      header: "Responsable",
      cell: ({ row }) => <div>{row.original.responsableActivite?.nomComplet}</div>,
    },
    {
      accessorKey: "partenariat",
      header: "Partenariat",
      cell: ({ row }) => {
        const partenariat = row.original.partenariat
        return (
            <Badge className={partenariat ? "bg-green-200 text-green-800" : "bg-gray-200 text-gray-800"}>
              {partenariat ? "Oui" : "Non"}
            </Badge>
        )
      },
    },
    {
      accessorKey: "gestion",
      header: "Gestion",
      cell: ({ row }) => <div>{row.original.gestion?.nom}</div>,
    },
    {
      accessorKey: "centre",
      header: "Centre",
      cell: ({ row }) => <div>{row.original.centre?.nomFr}</div>,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const activite = row.original

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
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push(`/activites/${activite.id}`)}>Modifier</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="text-destructive focus:bg-destructive focus:text-destructive-foreground"
                    onClick={() => {
                      setActiviteToDelete(activite)
                      setIsDeleteDialogOpen(true)
                    }}
                >
                  <TrashIcon className="mr-2 h-4 w-4" />
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        )
      },
    },
  ]

  const typeActivites = [
    { id: 1, name: "CEF", count: 0 },
    { id: 2, name: "CFA", count: 0 },
  ]

  const table = useReactTable({
    data: activites || [],
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
    if (typeFilter.length > 0) {
      table.getColumn("typeActivite")?.setFilterValue((value: any) => {
        const type = value?.name || value
        return typeFilter.includes(type)
      })
    } else {
      table.getColumn("typeActivite")?.setFilterValue(undefined)
    }
  }, [typeFilter, table])

  const handleDeleteActivite = async () => {
    if (!activiteToDelete || !activiteToDelete.id) return

    try {
      await api.delete(`/activite/${activiteToDelete.id}`)
      toast({
        title: "Succès",
        description: "L'activité a été supprimée avec succès.",
        className: "bg-green-500 text-white",
      })
      refetch()
    } catch (error) {
      console.error("Erreur lors de la suppression de l'activité:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression de l'activité.",
        variant: "destructive",
      })
    } finally {
      setActiviteToDelete(null)
      setIsDeleteDialogOpen(false)
    }
  }

  const handleBulkDelete = async () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows
    if (selectedRows.length === 0) {
      toast({
        title: "Information",
        description: "Aucune activité sélectionnée pour la suppression.",
        className: "bg-blue-500 text-white",
      })
      return
    }

    try {
      // Create an array of promises for each delete operation
      const deletePromises = selectedRows.map((row) => {
        const activite = row.original
        if (activite.id) {
          return api.delete(`/activite/${activite.id}`)
        }
        return Promise.resolve() // Skip if no ID
      })

      // Wait for all delete operations to complete
      await Promise.all(deletePromises)

      toast({
        title: "Succès",
        description: `${selectedRows.length} activité(s) supprimée(s) avec succès.`,
        className: "bg-green-500 text-white",
      })

      // Reset selection and refetch data
      setRowSelection({})
      refetch()
    } catch (error) {
      console.error("Erreur lors de la suppression des activités:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression des activités.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return <div>Chargement des données...</div>
  }

  if (error) {
    return <div>Une erreur s'est produite lors du chargement des données.</div>
  }

  return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Activités</CardTitle>
          {table.getFilteredSelectedRowModel().rows.length > 0 && (
              <Button variant="destructive" onClick={handleBulkDelete}>
                <TrashIcon className="mr-2 h-4 w-4" />
                Supprimer ({table.getFilteredSelectedRowModel().rows.length})
              </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-wrap items-center gap-4">
            <Input
                placeholder="Rechercher..."
                className="max-w-sm"
                value={(table.getColumn("typeActivite")?.getFilterValue() as string) ?? ""}
                onChange={(event) => table.getColumn("typeActivite")?.setFilterValue(event.target.value)}
            />
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="border-dashed">
                  Type d'Activité
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
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                    />
                  </div>
                  <Separator />
                </div>
                <div className="max-h-[300px] overflow-auto p-2">
                  {typeActivites
                      .filter((type) => type.name.toLowerCase().includes(searchValue.toLowerCase()))
                      .map((type) => (
                          <div key={type.id} className="flex items-center space-x-2 py-1.5">
                            <Checkbox
                                checked={typeFilter.includes(type.name)}
                                onCheckedChange={(checked) => {
                                  setTypeFilter(
                                      checked ? [...typeFilter, type.name] : typeFilter.filter((t) => t !== type.name),
                                  )
                                }}
                            />
                            <div className="flex flex-1 items-center space-x-2">
                              <span className="text-sm">{type.name}</span>
                            </div>
                            <span className="text-xs text-muted-foreground tabular-nums">
                        {activites?.filter((item: Activite) => item.typeActivite?.name === type.name).length || 0}
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
                        setTypeFilter([])
                        setSearchValue("")
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
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} sur {table.getFilteredRowModel().rows.length} ligne(s)
              sélectionnée(s).
            </div>
            <div className="space-x-2">
              <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
              >
                Précédent
              </Button>
              <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                Suivant
              </Button>
            </div>
          </div>
        </CardContent>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cette activité ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action est irréversible. L'activité sera définitivement supprimée.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setActiviteToDelete(null)}>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteActivite} className="bg-destructive text-destructive-foreground">
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Card>
  )
}
