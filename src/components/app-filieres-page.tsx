"use client"

import * as React from "react"
import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
  Pencil1Icon,
  PlusIcon,
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useQuery } from "react-query"
import type { Filiere } from "@/app/type/Filiere"
import { getFilieres } from "@/app/api/Filiere"
import { getTypeActivites } from "@/app/api/TypeActivite"
import { api } from "@/app/api"
import { useState } from "react"

export function FilierePage() {
  const { toast } = useToast()
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [filiereToDelete, setFiliereToDelete] = useState<Filiere | null>(null)
  const [filiereToEdit, setFiliereToEdit] = useState<Filiere | null>(null)
  const [newFiliere, setNewFiliere] = useState<Partial<Filiere>>({
    filiere: "",
    secteur: "",
    specialite: "",
    typeActivite: { id: 0 },
  })

  const {
    data: filieres,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: "filieres",
    queryFn: getFilieres,
  })

  const { data: typeActivites } = useQuery({
    queryKey: "typeActivites",
    queryFn: getTypeActivites,
  })

  const handleDeleteFiliere = async () => {
    if (!filiereToDelete || !filiereToDelete.id) return

    try {
      await api.delete(`/filiere/${filiereToDelete.id}`)
      toast({
        title: "Succès",
        description: "La filière a été supprimée avec succès.",
        className: "bg-green-500 text-white",
      })
      refetch()
    } catch (error) {
      console.error("Erreur lors de la suppression de la filière:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression de la filière.",
        variant: "destructive",
      })
    } finally {
      setFiliereToDelete(null)
      setIsDeleteDialogOpen(false)
    }
  }

  const handleEditFiliere = (filiere: Filiere) => {
    setFiliereToEdit(filiere)
    setIsEditDialogOpen(true)
  }

  const handleUpdateFiliere = async () => {
    if (!filiereToEdit || !filiereToEdit.id) return

    try {
      // Format the data to ensure typeActivite is just the ID reference
      const filiereToUpdate = {
        ...filiereToEdit,
        typeActivite: { id: filiereToEdit.typeActivite?.id },
      }

      await api.put(`/filiere/${filiereToEdit.id}`, filiereToUpdate)
      toast({
        title: "Succès",
        description: "La filière a été mise à jour avec succès.",
        className: "bg-green-500 text-white",
      })
      setIsEditDialogOpen(false)
      setFiliereToEdit(null)
      refetch()
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la filière:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour de la filière.",
        variant: "destructive",
      })
    }
  }

  const columns: ColumnDef<Filiere>[] = [
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
      accessorKey: "filiere",
      header: ({ column }) => {
        return (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
              Filière
              <CaretSortIcon className="ml-2 h-4 w-4" />
            </Button>
        )
      },
      cell: ({ row }) => <div>{row.getValue("filiere")}</div>,
    },
    {
      accessorKey: "secteur",
      header: ({ column }) => {
        return (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
              Secteur
              <CaretSortIcon className="ml-2 h-4 w-4" />
            </Button>
        )
      },
      cell: ({ row }) => <div>{row.getValue("secteur")}</div>,
    },
    {
      accessorKey: "specialite",
      header: ({ column }) => {
        return (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
              Spécialité
              <CaretSortIcon className="ml-2 h-4 w-4" />
            </Button>
        )
      },
      cell: ({ row }) => <div>{row.getValue("specialite")}</div>,
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
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const filiere = row.original

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
                <DropdownMenuItem onClick={() => handleEditFiliere(filiere)}>
                  <Pencil1Icon className="mr-2 h-4 w-4" />
                  Modifier
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="text-destructive focus:bg-destructive focus:text-destructive-foreground"
                    onClick={() => {
                      setFiliereToDelete(filiere)
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

  const table = useReactTable({
    data: filieres || [],
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

  // Update the handleAddFiliere function to properly format the data before sending to the API
  const handleAddFiliere = async () => {
    try {
      // Format the data to ensure typeActivite is just the ID reference
      const filiereToAdd = {
        ...newFiliere,
        typeActivite: { id: newFiliere.typeActivite?.id },
      }

      await api.post("/filiere", filiereToAdd)
      toast({
        title: "Succès",
        description: "La filière a été ajoutée avec succès.",
        className: "bg-green-500 text-white",
      })
      setIsAddDialogOpen(false)
      setNewFiliere({
        filiere: "",
        secteur: "",
        specialite: "",
        typeActivite: { id: 0 },
      })
      refetch()
    } catch (error) {
      console.error("Erreur lors de l'ajout de la filière:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout de la filière.",
        variant: "destructive",
      })
    }
  }

  // Function to handle bulk delete of selected rows
  const handleBulkDelete = async () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows
    if (selectedRows.length === 0) {
      toast({
        title: "Information",
        description: "Aucune filière sélectionnée pour la suppression.",
        className: "bg-blue-500 text-white",
      })
      return
    }

    try {
      // Create an array of promises for each delete operation
      const deletePromises = selectedRows.map((row) => {
        const filiere = row.original
        if (filiere.id) {
          return api.delete(`/filiere/${filiere.id}`)
        }
        return Promise.resolve() // Skip if no ID
      })

      // Wait for all delete operations to complete
      await Promise.all(deletePromises)

      toast({
        title: "Succès",
        description: `${selectedRows.length} filière(s) supprimée(s) avec succès.`,
        className: "bg-green-500 text-white",
      })

      // Reset selection and refetch data
      setRowSelection({})
      refetch()
    } catch (error) {
      console.error("Erreur lors de la suppression des filières:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression des filières.",
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
      <>
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Filières</CardTitle>
            <div className="flex space-x-2">
              {table.getFilteredSelectedRowModel().rows.length > 0 && (
                  <Button variant="destructive" onClick={handleBulkDelete}>
                    <TrashIcon className="mr-2 h-4 w-4" />
                    Supprimer ({table.getFilteredSelectedRowModel().rows.length})
                  </Button>
              )}
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Ajouter une filière
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Ajouter une nouvelle filière</DialogTitle>
                    <DialogDescription>Remplissez les informations pour créer une nouvelle filière.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="filiere" className="text-right">
                        Filière
                      </Label>
                      <Input
                          id="filiere"
                          value={newFiliere.filiere || ""}
                          onChange={(e) => setNewFiliere({ ...newFiliere, filiere: e.target.value })}
                          className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="secteur" className="text-right">
                        Secteur
                      </Label>
                      <Input
                          id="secteur"
                          value={newFiliere.secteur || ""}
                          onChange={(e) => setNewFiliere({ ...newFiliere, secteur: e.target.value })}
                          className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="specialite" className="text-right">
                        Spécialité
                      </Label>
                      <Input
                          id="specialite"
                          value={newFiliere.specialite || ""}
                          onChange={(e) => setNewFiliere({ ...newFiliere, specialite: e.target.value })}
                          className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="typeActivite" className="text-right">
                        Type d'activité
                      </Label>
                      <Select
                          value={newFiliere.typeActivite?.id ? newFiliere.typeActivite.id.toString() : ""}
                          onValueChange={(value) => {
                            const selectedType = typeActivites?.find((type) => type.id === Number(value))
                            if (selectedType) {
                              setNewFiliere({
                                ...newFiliere,
                                typeActivite: { id: selectedType.id, name: selectedType.name },
                              })
                            }
                          }}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Sélectionner un type d'activité" />
                        </SelectTrigger>
                        <SelectContent>
                          {typeActivites?.map((type) => (
                              <SelectItem key={type.id} value={type.id?.toString() || ""}>
                                {type.name}
                              </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" onClick={handleAddFiliere}>
                      Ajouter
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex items-center gap-4">
              <Input
                  placeholder="Filtrer par filière..."
                  value={(table.getColumn("filiere")?.getFilterValue() as string) ?? ""}
                  onChange={(event) => table.getColumn("filiere")?.setFilterValue(event.target.value)}
                  className="max-w-sm"
              />
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
                                {header.isPlaceholder
                                    ? null
                                    : flexRender(header.column.columnDef.header, header.getContext())}
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
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Modifier la filière</DialogTitle>
              <DialogDescription>Modifiez les informations de la filière.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-filiere" className="text-right">
                  Filière
                </Label>
                <Input
                    id="edit-filiere"
                    value={filiereToEdit?.filiere || ""}
                    onChange={(e) => setFiliereToEdit(filiereToEdit ? { ...filiereToEdit, filiere: e.target.value } : null)}
                    className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-secteur" className="text-right">
                  Secteur
                </Label>
                <Input
                    id="edit-secteur"
                    value={filiereToEdit?.secteur || ""}
                    onChange={(e) => setFiliereToEdit(filiereToEdit ? { ...filiereToEdit, secteur: e.target.value } : null)}
                    className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-specialite" className="text-right">
                  Spécialité
                </Label>
                <Input
                    id="edit-specialite"
                    value={filiereToEdit?.specialite || ""}
                    onChange={(e) =>
                        setFiliereToEdit(filiereToEdit ? { ...filiereToEdit, specialite: e.target.value } : null)
                    }
                    className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-typeActivite" className="text-right">
                  Type d'activité
                </Label>
                <Select
                    value={filiereToEdit?.typeActivite?.id ? filiereToEdit.typeActivite.id.toString() : ""}
                    onValueChange={(value) => {
                      const selectedType = typeActivites?.find((type) => type.id === Number(value))
                      if (selectedType && filiereToEdit) {
                        setFiliereToEdit({
                          ...filiereToEdit,
                          typeActivite: { id: selectedType.id, name: selectedType.name },
                        })
                      }
                    }}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Sélectionner un type d'activité" />
                  </SelectTrigger>
                  <SelectContent>
                    {typeActivites?.map((type) => (
                        <SelectItem key={type.id} value={type.id?.toString() || ""}>
                          {type.name}
                        </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" onClick={handleUpdateFiliere}>
                Enregistrer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cette filière ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action est irréversible. La filière{" "}
                <span className="font-semibold">{filiereToDelete?.filiere}</span> sera définitivement supprimée.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setFiliereToDelete(null)}>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteFiliere} className="bg-destructive text-destructive-foreground">
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
  )
}
