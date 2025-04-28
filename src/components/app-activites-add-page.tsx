"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useQuery } from "react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getProprieteDuCentres } from "@/app/api/ProprieteDuCentre"
import { getCentres } from "@/app/api/centre"
import { getPersonnels } from "@/app/api/Personnel"
import { getTypeActivites } from "@/app/api/TypeActivite"
import type { TypeActivite } from "@/app/type/TypeActivite"
import { getFilieresByTypeActivite } from "@/app/api/Filiere"
import type { Filiere } from "@/app/type/Filiere"
import { MultiSelect } from "./components-ui-multi-select"
import { api } from "@/app/api"

const formSchema = z.object({
    typeActivite: z.object({
        id: z.number(),
    }),
    dateOuverture: z.string().optional(),
    responsableActivite: z.object({
        id: z.number(),
    }),
    gestion: z.object({
        id: z.number(),
    }),
    centre: z.object({
        id: z.number(),
    }),
    filieres: z
        .array(
            z.object({
                id: z.number(),
            }),
        )
        .default([]),
    personnels: z
        .array(
            z.object({
                id: z.number(),
            }),
        )
        .default([]),
    partenariat: z.boolean().default(false),
})

interface AddActiviteProps {
    isUpdate?: boolean
    activiteId?: number | null
}

export default function AddActivitePage({ isUpdate = false, activiteId = null }: AddActiviteProps) {
    const router = useRouter()
    const { toast } = useToast()
    const [selectedTypeActivite, setSelectedTypeActivite] = useState<TypeActivite | null>(null)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            typeActivite: { id: 0 },
            dateOuverture: "",
            responsableActivite: { id: 0 },
            gestion: { id: 0 },
            partenariat: false,
            centre: { id: 0 },
            filieres: [], // Initialize as empty array to avoid null
            personnels: [], // Initialize as empty array to avoid null
        },
    })

    const { data: typeActivites } = useQuery<TypeActivite[]>("typeActivite", getTypeActivites)
    const { data: personnel } = useQuery("personnel", getPersonnels)
    const { data: gestions } = useQuery("proprieteDuCentres", getProprieteDuCentres)
    const { data: centres } = useQuery({
        queryKey: "centre",
        queryFn: getCentres,
    })

    const typeactiviteId = form.watch("typeActivite.id")

    const { data: filieres, refetch: refetchTypeActivite } = useQuery<Filiere[]>({
        queryKey: ["filiere", typeactiviteId],
        queryFn: () => getFilieresByTypeActivite(typeactiviteId),
        enabled: !!typeactiviteId,
    })

    useEffect(() => {
        if (isUpdate && activiteId) {
            // Fetch the existing activite data and populate the form
            const fetchActiviteData = async () => {
                try {
                    const response = await api.get(`/activite/${activiteId}`)
                    const data = response.data

                    // Set form values from the response data
                    form.setValue("typeActivite", data.typeActivite || { id: 0 })
                    form.setValue("dateOuverture", data.dateOuverture || "")
                    form.setValue("responsableActivite", data.responsableActivite || { id: 0 })
                    form.setValue("gestion", data.gestion || { id: 0 })
                    form.setValue("partenariat", data.partenariat || false)
                    form.setValue("centre", data.centre || { id: 0 })
                    form.setValue("filieres", data.filieres || [])
                    form.setValue("personnels", data.personnels || [])

                    // If there's a type activite, set it to trigger the filiere fetch
                    if (data.typeActivite) {
                        setSelectedTypeActivite(data.typeActivite)
                    }
                } catch (error) {
                    console.error("Erreur lors de la récupération des données:", error)
                    toast({
                        title: "Erreur",
                        description: "Impossible de récupérer les données de l'activité.",
                        variant: "destructive",
                    })
                }
            }
            fetchActiviteData()
        }
    }, [isUpdate, activiteId, form, toast])

    async function onSubmit(values: z.infer<typeof formSchema>) {
        // Ensure filieres is never null
        const dataToSubmit = {
            ...values,
            filieres: values.filieres || [],
            personnels: values.personnels || [],
        }

        try {
            if (isUpdate && activiteId) {
                await api.put(`/activite/${activiteId}`, dataToSubmit)
                toast({
                    description: "L'activité a été mise à jour avec succès.",
                    className: "bg-green-500 text-white",
                    duration: 3000,
                    title: "Succès",
                })
            } else {
                await api.post(`/activite/add`, dataToSubmit)
                toast({
                    description: "L'activité a été ajoutée avec succès.",
                    className: "bg-green-500 text-white",
                    duration: 3000,
                    title: "Succès",
                })
            }
            router.push("/activites")
        } catch (error) {
            console.error("Erreur:", error)
            toast({
                title: "Erreur",
                description: "Une erreur est survenue lors de l'ajout/mise à jour de l'activité.",
                duration: 3000,
                className: "bg-red-500 text-white",
            })
        }
    }

    return (
        <div className="container mx-auto py-10">
            <Card className="w-full max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle>{isUpdate ? "Mettre à jour l'activité" : "Ajouter une nouvelle activité"}</CardTitle>
                    <CardDescription>
                        Remplissez le formulaire pour {isUpdate ? "mettre à jour l'activité" : "ajouter une nouvelle activité"}.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="typeActivite"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Type d&apos;activité</FormLabel>
                                            <Select
                                                value={field.value?.id ? field.value.id.toString() : ""}
                                                onValueChange={(value) => {
                                                    const selectedTypeActivite = typeActivites?.find((p) => p.id === Number.parseInt(value))
                                                    if (selectedTypeActivite) {
                                                        field.onChange({ id: selectedTypeActivite.id })
                                                        refetchTypeActivite()
                                                        setSelectedTypeActivite(selectedTypeActivite)
                                                    }
                                                }}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Sélectionner un type d'activité" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {typeActivites?.map((type) => (
                                                        <SelectItem key={type.id} value={type.id?.toString() || ""}>
                                                            {type.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="dateOuverture"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Date d&apos;ouverture</FormLabel>
                                            <FormControl>
                                                <Input type="date" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="responsableActivite"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Responsable</FormLabel>
                                            <Select
                                                value={field.value?.id ? field.value.id.toString() : ""}
                                                onValueChange={(value) => {
                                                    const selectedPersonnel = personnel?.find((p) => p.id === Number.parseInt(value))
                                                    if (selectedPersonnel) {
                                                        field.onChange({ id: selectedPersonnel.id })
                                                    }
                                                }}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Sélectionner un responsable" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {personnel?.map((person) => (
                                                        <SelectItem key={person.id} value={person.id?.toString() ?? ""}>
                                                            {person.nomComplet}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="gestion"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Gestion</FormLabel>
                                            <Select
                                                value={field.value?.id ? field.value.id.toString() : ""}
                                                onValueChange={(value) => {
                                                    const selectedGestion = gestions?.find((p) => p.id === Number.parseInt(value))
                                                    if (selectedGestion) {
                                                        field.onChange({ id: selectedGestion.id })
                                                    }
                                                }}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Sélectionner un type de gestion" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {gestions?.map((propriete) => (
                                                        <SelectItem key={propriete.id} value={propriete.id?.toString() ?? ""}>
                                                            {propriete.nom}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="partenariat"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                            <FormControl>
                                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel>Partenariat</FormLabel>
                                                <p className="text-sm text-muted-foreground">
                                                    Cochez si cette activité implique un partenariat
                                                </p>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="centre"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Centre</FormLabel>
                                            <Select
                                                value={field.value?.id ? field.value.id.toString() : ""}
                                                onValueChange={(value) => {
                                                    const selectedCentre = centres?.find((p) => p.id === Number(value))
                                                    if (selectedCentre) {
                                                        field.onChange({ id: selectedCentre.id })
                                                    }
                                                }}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Sélectionner un centre" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {centres?.map((centre) => (
                                                        <SelectItem key={centre.id} value={centre.id?.toString() ?? ""}>
                                                            {centre.nomFr}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="filieres"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Filières</FormLabel>
                                            <FormControl>
                                                <MultiSelect
                                                    options={
                                                        filieres?.map((filiere) => ({
                                                            label: filiere.filiere || "",
                                                            value: filiere.id?.toString() || "",
                                                        })) || []
                                                    }
                                                    value={(Array.isArray(field.value) ? field.value : []).map((filiere) => ({
                                                        label: filieres?.find((f) => f.id === filiere.id)?.filiere || "",
                                                        value: filiere.id?.toString() || "",
                                                    }))}
                                                    onChange={(selectedOptions) => {
                                                        const selectedFilieres = selectedOptions
                                                            .map((option) => {
                                                                const filiere = filieres?.find((f) => f.id === Number.parseInt(option.value))
                                                                return filiere ? { id: filiere.id } : null
                                                            })
                                                            .filter((f) => f != null) as { id: number }[]

                                                        field.onChange(selectedFilieres)
                                                    }}
                                                    placeholder="Sélectionner des filières"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="personnels"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Personnel</FormLabel>
                                            <FormControl>
                                                <MultiSelect
                                                    options={
                                                        personnel?.map((person) => ({
                                                            label: person.nomComplet || "",
                                                            value: person.id?.toString() || "",
                                                        })) || []
                                                    }
                                                    value={(Array.isArray(field.value) ? field.value : []).map((person) => ({
                                                        label: personnel?.find((p) => p.id === person.id)?.nomComplet || "",
                                                        value: person.id?.toString() || "",
                                                    }))}
                                                    onChange={(selectedOptions) => {
                                                        const selectedPersonnel = selectedOptions
                                                            .map((option) => {
                                                                const person = personnel?.find((p) => p.id === Number.parseInt(option.value))
                                                                return person ? { id: person.id } : null
                                                            })
                                                            .filter((p) => p != null) as { id: number }[]

                                                        field.onChange(selectedPersonnel)
                                                    }}
                                                    placeholder="Sélectionner le personnel"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <Button type="submit">{isUpdate ? "Mettre à jour l'activité" : "Ajouter une activité"}</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
