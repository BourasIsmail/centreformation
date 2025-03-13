"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { useEffect, useState } from "react"
import { useQuery } from "react-query"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getAllProvinces } from "@/app/api/province"
import { getCommuneByProvince } from "@/app/api/commune"
import { getPersonnelByProvince } from "@/app/api/Personnel"
import { getMilieuImplantation } from "@/app/api/MilieuImplantation"
import { getTypeCentre } from "@/app/api/TypeCentre"
import { getProprieteDuCentres } from "@/app/api/ProprieteDuCentre"
import { api } from "@/app/api"
import { getCurrentUser } from "@/app/api/index"
import type { UserInfo } from "@/app/type/UserInfo"
import dynamic from "next/dynamic"

const MapComponent = dynamic(() => import("@/components/map-component"), {
    ssr: false,
    loading: () => <p>Chargement de la carte...</p>,
})

const formSchema = z.object({
    nomFr: z.string().min(2, {
        message: "Le nom en français doit contenir au moins 2 caractères.",
    }),
    nomAr: z.string().min(2, {
        message: "Le nom en arabe doit contenir au moins 2 caractères.",
    }),
    typeCentre: z.object({ id: z.number() }).refine((value) => value.id > 0, {
        message: "Veuillez sélectionner un type de centre.",
    }),
    dateConstruction: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
        message: "Format de date invalide. Utilisez YYYY-MM-DD.",
    }),
    telephone: z.string().regex(/^\+?[0-9]{10,14}$/, { message: "Numéro de téléphone invalide." }),
    province: z.object({ id: z.number() }).refine((value) => value.id > 0, {
        message: "Veuillez sélectionner une province.",
    }),
    commune: z.object({ id: z.number() }).refine((value) => value.id > 0, {
        message: "Veuillez sélectionner une commune.",
    }),
    adresse: z.string().min(5, { message: "L'adresse doit contenir au moins 5 caractères." }),
    responsable: z.object({ id: z.number() }).refine((value) => value.id > 0, {
        message: "Veuillez sélectionner un responsable.",
    }),
    milieuImplantation: z.object({ id: z.number() }).refine((value) => value.id > 0, {
        message: "Veuillez sélectionner un milieu d'implantation.",
    }),
    proprieteDuCentre: z.object({ id: z.number() }).refine((value) => value.id > 0, {
        message: "Veuillez sélectionner un proprietaire.",
    }),
    superficie: z.number().positive({ message: "La superficie doit être un nombre positif." }),
    utilisation: z.string().min(2, { message: "L'utilisation doit contenir au moins 2 caractères." }),
    etat: z.string().min(2, { message: "L'état doit contenir au moins 2 caractères." }),
    electricite: z.string().min(2, { message: "Veuillez spécifier l'état de l'électricité." }),
    telephoneFixe: z.string().regex(/^\+?[0-9]{10,14}$/, {
        message: "Numéro de téléphone fixe invalide.",
    }),
    internet: z.string().min(2, { message: "Veuillez spécifier l'état de la connexion internet." }),
    possession: z.string().min(2, { message: "Veuillez spécifier la possession." }),
    montantAllocation: z.number().nonnegative({ message: "Le montant doit être un nombre positif ou zéro." }),
    nbrPC: z.number().int().nonnegative({
        message: "Le nombre de PC doit être un entier positif ou zéro.",
    }),
    nbrImprimante: z.number().int().nonnegative({
        message: "Le nombre d'imprimantes doit être un entier positif ou zéro.",
    }),
    nbrPersonneConnaissanceInfo: z.number().int().nonnegative({
        message: "Le nombre de personnes doit être un entier positif ou zéro.",
    }),
    nbrPersonneOperationelApresFormation: z.number().int().nonnegative({
        message: "Le nombre de personnes doit être un entier positif ou zéro.",
    }),
    coutEstimationAmenagement: z.number().nonnegative({ message: "Le coût doit être un nombre positif ou zéro." }),
    coutEstimationEquipement: z.number().nonnegative({ message: "Le coût doit être un nombre positif ou zéro." }),
    observation: z.string().optional(),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
})

interface AddCentreProps {
    isUpdate?: boolean
    centreId?: number | null
}

export function AddCentre({ isUpdate = false, centreId = null }: AddCentreProps) {
    const { toast } = useToast()
    const router = useRouter()
    const [user, setUser] = useState<UserInfo | null>(null)

    useEffect(() => {
        const fetchUser = async () => {
            const currentUser = await getCurrentUser()
            setUser(currentUser)
        }
        fetchUser()
    }, [])

    const [mapKey, setMapKey] = useState(0)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nomFr: "",
            nomAr: "",
            typeCentre: { id: 0 },
            dateConstruction: "",
            telephone: "",
            commune: { id: 0 },
            province: { id: 0 },
            adresse: "",
            responsable: { id: 0 },
            milieuImplantation: { id: 0 },
            proprieteDuCentre: { id: 0 },
            superficie: 0,
            utilisation: "",
            etat: "",
            electricite: "",
            telephoneFixe: "",
            internet: "",
            possession: "",
            montantAllocation: 0,
            nbrPC: 0,
            nbrImprimante: 0,
            nbrPersonneConnaissanceInfo: 0,
            nbrPersonneOperationelApresFormation: 0,
            coutEstimationAmenagement: 0,
            coutEstimationEquipement: 0,
            observation: "",
            latitude: 0,
            longitude: 0,
        },
    })
    const possessionValue = form.watch("possession"); // Watch the "possession" field
    const provinceId = form.watch("province.id");

    useEffect(() => {
        
        if (user?.province && user?.roles === "ADMIN_ROLES") {
            if (user?.province?.id) {
                form.setValue("province", { id: user.province.id }) // Set province value in the form
            }
        }
    }, [user, form])

    useEffect(() => {
        if (isUpdate && centreId) {
            // Fetch the existing centre data and populate the form
            const fetchCentreData = async () => {
                const response = await api.get(`/centres/${centreId}`)
                Object.keys(response.data).forEach((key) => {
                    form.setValue(key as any, response.data[key])
                })
            }
            fetchCentreData()
        }
    }, [isUpdate, centreId, form])
    
    
    const { data: provinces } = useQuery({
        queryKey: "provinces",
        queryFn: getAllProvinces,
    })

    const { data: proprietaire } = useQuery({
        queryKey: "proprietaire",
        queryFn: getProprieteDuCentres,
    })

    const { data: communes , refetch: refetchCommunes } = useQuery({
        queryKey: ["commune", provinceId],
        queryFn: () => getCommuneByProvince(provinceId),
        enabled: !!provinceId,
    })

    const { data: personnels , refetch: refetchPersonnels } = useQuery({
        queryKey: ["responsable", provinceId],
        queryFn: () => getPersonnelByProvince(provinceId),
        enabled: !!provinceId,
    })

    const { data: milieuImplantation } = useQuery({
        queryKey: "milieuxImplantation",
        queryFn: getMilieuImplantation,
    })

    const { data: typeCentre } = useQuery({
        queryKey: "typeCentre",
        queryFn: getTypeCentre,
    })
    
    const handleMapClick = React.useCallback(
        (lat: number, lng: number) => {
            form.setValue("latitude", lat)
            form.setValue("longitude", lng)
            setMapKey((prevKey) => prevKey + 1) // Force re-render of map component
        },
        [form],
    )

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            if (isUpdate && centreId) {
                await api.put(`/centres/${centreId}`, values)
                toast({
                    description: "Le centre a été mis à jour avec succès.",
                    className: "bg-green-500 text-white",
                    duration: 3000,
                    title: "Succès",
                })
            } else {
                await api.post(`/centres`, values)
                toast({
                    description: "Le centre a été ajouté avec succès.",
                    className: "bg-green-500 text-white",
                    duration: 3000,
                    title: "Succès",
                })
            }
            router.push("/centres")
        } catch (error) {
            console.error("Erreur:", error)
            toast({
                title: "Erreur",
                description: "Une erreur est survenue lors de l'ajout/mise à jour du centre.",
                duration: 3000,
                className: "bg-red-500 text-white",
            })
        }
    }

    return (
        <div className="container mx-auto px-4">
            <Card className="w-full max-w-6xl mx-auto">
                <CardHeader>
                    <CardTitle>{isUpdate ? "Mettre à jour le centre" : "Ajouter un nouveau centre"}</CardTitle>
                    <CardDescription>
                        Remplissez le formulaire pour{" "}
                        {isUpdate ? "mettre à jour le centre de formation" : "ajouter un nouveau centre de formation"}.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <FormField
                                    control={form.control}
                                    name="nomFr"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nom (Français)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Nom du centre en français" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="nomAr"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nom (Arabe)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Nom du centre en arabe" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="typeCentre"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Type de centre</FormLabel>
                                            <Select
                                                value={field.value?.id ? field.value.id.toString() : ""}
                                                onValueChange={(value) => {
                                                    const selectedtypeCentre = typeCentre?.find((p) => p.id === Number.parseInt(value))
                                                    if (selectedtypeCentre) {
                                                        field.onChange({ id: selectedtypeCentre.id })
                                                    }
                                                }}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Sélectionner un type de centre" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {typeCentre?.map((tc) => (
                                                        <SelectItem key={tc.id} value={tc.id?.toString() ?? ""}>
                                                            {tc.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <FormField
                                    control={form.control}
                                    name="dateConstruction"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Date de construction</FormLabel>
                                            <FormControl>
                                                <Input type="date" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="telephone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Téléphone</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Numéro de téléphone" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="adresse"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Adresse</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Adresse complète" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {user?.roles === "SUPER_ADMIN_ROLES" && (
                                    <FormField
  control={form.control}
  name="province"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Province</FormLabel>
      <Select
        value={field.value?.id ? field.value.id.toString() : ""}
        onValueChange={(value) => {
          const selectedProvince = provinces?.find((p) => p.id === Number(value));
          if (selectedProvince) {
            field.onChange({ id: selectedProvince.id });
            refetchCommunes();
            refetchPersonnels();
            }
        }}
      >
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez une province" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {provinces?.map((province) => (
            <SelectItem key={province.id} value={province.id?.toString() ?? ""}>
              {province.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  )}
/>

                                    
                                )}
                                {user?.roles === "ADMIN_ROLES" && (
                                    <div>
                                        <p className="text-sm font-semibold">Province:</p>
                                        <p className="text-lg font-semibold">{user?.province?.name}</p>
                                    </div>
                                )}
                                <FormField
                                    control={form.control}
                                    name="commune"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Commune</FormLabel>
                                            <Select
                                                value={field.value?.id ? field.value.id.toString() : ""}
                                                onValueChange={(value) => {
                                                    const selectedCommune = communes?.find((p) => p.id === Number(value));
                                                    if (selectedCommune) {
                                                        field.onChange(selectedCommune);
                                                    }
                                                }}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Sélectionner une commune" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {communes?.map((commune) => (
                                                        <SelectItem key={commune.id} value={commune.id?.toString() ?? ""}>
                                                            {commune.name}
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
                                    name="responsable"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Responsable</FormLabel>
                                            <Select
                                                value={field.value?.id ? field.value.id.toString() : ""}
                                                onValueChange={(value) => {
                                                    const selectedPersonnel = personnels?.find((p) => p.id === Number.parseInt(value))
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
                                                    {personnels?.map((person) => (
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
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <FormField
                                    control={form.control}
                                    name="milieuImplantation"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Milieu d'implantation</FormLabel>
                                            <Select
                                                value={field.value?.id ? field.value.id.toString() : ""}
                                                onValueChange={(value) => {
                                                    const selectedMilieuImplantation = milieuImplantation?.find(
                                                        (p) => p.id === Number.parseInt(value),
                                                    )
                                                    if (selectedMilieuImplantation) {
                                                        field.onChange({ id: selectedMilieuImplantation.id })
                                                    }
                                                }}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Sélectionnez un milieu" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {milieuImplantation?.map((milieu) => (
                                                        <SelectItem key={milieu.id} value={milieu?.id?.toString() || ""}>
                                                            {milieu.nom}
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
                                    name="proprieteDuCentre"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Propriété du centre</FormLabel>
                                            <Select
                                                value={field.value?.id ? field.value.id.toString() : ""}
                                                onValueChange={(value) => {
                                                    const selectedProprietaire = proprietaire?.find((p) => p.id === Number.parseInt(value))
                                                    if (selectedProprietaire) {
                                                        field.onChange({ id: selectedProprietaire.id })
                                                    }
                                                }}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Sélectionnez un proprietaire" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {proprietaire?.map((p) => (
                                                        <SelectItem key={p.id} value={p?.id?.toString() || ""}>
                                                            {p.nom}
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
                                    name="superficie"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Superficie (m²)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    {...field}
                                                    onChange={(e) => field.onChange(Number.parseFloat(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <FormField
                                    control={form.control}
                                    name="utilisation"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Utilisation</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Utilisation du centre" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="etat"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>État</FormLabel>
                                            <FormControl>
                                                <Input placeholder="État du centre" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="electricite"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Électricité</FormLabel>
                                            <FormControl>
                                                <Input placeholder="État de l'électricité" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <FormField
                                    control={form.control}
                                    name="telephoneFixe"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Téléphone fixe</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Numéro de téléphone fixe" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="internet"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Internet</FormLabel>
                                            <FormControl>
                                                <Input placeholder="État de la connexion internet" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

<FormField
  control={form.control}
  name="possession" 
  render={({ field }) => (
    <FormItem className="col-span-1">
      <FormLabel>Possession</FormLabel> 
      <Select
        onValueChange={field.onChange}
        value={field.value ?? ""} // Ensure value is never undefined
      >
        <FormControl>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sélectionnez la possession" /> 
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          <SelectItem value="Entraide">Entraide</SelectItem> 
          <SelectItem value="loye">Loyé</SelectItem> 
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  )}
/>

{/* Show "Montant d'allocation" only if possession === "Entraide" */}
{possessionValue === "loye" && (
  <FormField
    control={form.control}
    name="montantAllocation"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Montant d'allocation</FormLabel>
        <FormControl>
          <Input
            type="number"
            {...field}
            onChange={(e) => field.onChange(Number.parseFloat(e.target.value))}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
)}
                                <FormField
                                    control={form.control}
                                    name="nbrPC"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nombre de PC</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    {...field}
                                                    onChange={(e) => field.onChange(Number.parseInt(e.target.value, 10))}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <FormField
                                    control={form.control}
                                    name="nbrImprimante"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nombre d'imprimantes</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    {...field}
                                                    onChange={(e) => field.onChange(Number.parseInt(e.target.value, 10))}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="nbrPersonneConnaissanceInfo"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Personnes avec connaissances en informatique</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    {...field}
                                                    onChange={(e) => field.onChange(Number.parseInt(e.target.value, 10))}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="nbrPersonneOperationelApresFormation"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Personnes opérationnelles après formation</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    {...field}
                                                    onChange={(e) => field.onChange(Number.parseInt(e.target.value, 10))}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <FormField
                                    control={form.control}
                                    name="coutEstimationAmenagement"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Coût estimé d'aménagement</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    {...field}
                                                    onChange={(e) => field.onChange(Number.parseFloat(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="coutEstimationEquipement"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Coût estimé d'équipement</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    {...field}
                                                    onChange={(e) => field.onChange(Number.parseFloat(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="observation"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Observations</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Observations supplémentaires" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Localisation sur la carte</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="latitude"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Latitude</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        step="any"
                                                        {...field}
                                                        onChange={(e) => {
                                                            field.onChange(Number.parseFloat(e.target.value))
                                                            setMapKey((prevKey) => prevKey + 1)
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="longitude"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Longitude</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        step="any"
                                                        {...field}
                                                        onChange={(e) => {
                                                            field.onChange(Number.parseFloat(e.target.value))
                                                            setMapKey((prevKey) => prevKey + 1)
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="h-[400px] w-full">
                                    <MapComponent
                                        key={mapKey}
                                        latitude={form.watch("latitude")}
                                        longitude={form.watch("longitude")}
                                        zoom={13}
                                        onMapClick={handleMapClick}
                                    />
                                </div>
                            </div>

                            <Button type="submit">{isUpdate ? "Mettre à jour le centre" : "Ajouter le centre"}</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}

