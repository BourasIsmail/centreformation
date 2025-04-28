"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "react-query"
import { getAllProvinces } from "@/app/api/province"
import { getCommuneByProvince } from "@/app/api/commune"
import { api } from "@/app/api"
import { getCurrentUser } from "@/app/api/index"
import type { UserInfo } from "@/app/type/UserInfo"
import { getActiviteByCentre, getactiviteById } from "@/app/api/Activite"
import { getCentreByProvince } from "@/app/api/centre"
import { getFilieresByTypeActivite } from "@/app/api/Filiere"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2 } from "lucide-react"

// Define the schema to match BeneficiaireRequest
const formSchema = z.object({
    nom: z.string().min(2, {
        message: "Le nom doit contenir au moins 2 caractères.",
    }),
    prenom: z.string().min(2, {
        message: "Le prénom doit contenir au moins 2 caractères.",
    }),
    adresse: z.string().min(1, {
        message: "Veuillez saisir une adresse.",
    }),
    dateNaissance: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
        message: "La date doit être au format YYYY-MM-DD.",
    }),
    sexe: z.string().min(1, {
        message: "Veuillez sélectionner un sexe.",
    }),
    cin: z.string().min(6, {
        message: "Le CIN doit contenir au moins 6 caractères.",
    }),
    telephone: z.string().min(8, {
        message: "Le numéro de téléphone doit contenir au moins 8 chiffres.",
    }),
    nationalite: z.string().min(2, {
        message: "La nationalité doit contenir au moins 2 caractères.",
    }),
    situationHandicap: z.boolean().default(false),
    numCarteHandicap: z.string().optional(),
    commune: z.object({ id: z.number() }).refine((value) => value.id > 0, {
        message: "Veuillez sélectionner une commune.",
    }),
    province: z.object({ id: z.number() }).refine((value) => value.id > 0, {
        message: "Veuillez sélectionner une province.",
    }),
    suivies: z
        .array(
            z.object({
                filiere: z.object({ id: z.number() }).refine((value) => value.id > 0, {
                    message: "Veuillez sélectionner une filiere.",
                }),
                activite: z.object({ id: z.number() }).refine((value) => value.id > 0, {
                    message: "Veuillez sélectionner une activité.",
                }),
                centre: z.object({ id: z.number() }).refine((value) => value.id > 0, {
                    message: "Veuillez sélectionner un centre.",
                }),
                etatDeFormation: z.string().min(1, {
                    message: "Veuillez sélectionner un état de formation.",
                }),
                dateEffet: z.string().min(1, {
                    message: "Veuillez saisir une date d'effet.",
                }),
                observation: z.string().optional(),
            }),
        )
        .default([]), // Default to empty array instead of optional
})

interface AddBeneficiaireProps {
    isUpdate?: boolean
    beneficiaireId?: number | null
}

export function AddBeneficiaireFormComponent({ isUpdate = false, beneficiaireId = null }: AddBeneficiaireProps) {
    const router = useRouter()
    const { toast } = useToast()
    const [user, setUser] = useState<UserInfo | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        const fetchUser = async () => {
            const currentUser = await getCurrentUser()
            setUser(currentUser)
        }
        fetchUser()
    }, [])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nom: "",
            prenom: "",
            adresse: "",
            dateNaissance: "",
            sexe: "",
            cin: "",
            telephone: "",
            nationalite: "",
            situationHandicap: false,
            numCarteHandicap: "",
            commune: { id: 0 },
            province: { id: 0 },
            suivies: isUpdate
                ? []
                : [
                    {
                        filiere: { id: 0 },
                        activite: { id: 0 },
                        centre: { id: 0 },
                        etatDeFormation: "",
                        dateEffet: "",
                        observation: "",
                    },
                ],
        },
    })

    // Watch situationHandicap to conditionally show numCarteHandicap field
    const situationHandicap = form.watch("situationHandicap")

    useEffect(() => {
        if (isUpdate && beneficiaireId) {
            // Fetch the existing centre data and populate the form
            const fetchBeneficiaireData = async () => {
                try {
                    const response = await api.get(`/beneficiaires/${beneficiaireId}`)
                    Object.keys(response.data).forEach((key) => {
                        form.setValue(key as any, response.data[key])
                    })
                } catch (error) {
                    console.error("Error fetching beneficiaire data:", error)
                    toast({
                        title: "Erreur",
                        description: "Impossible de récupérer les données du bénéficiaire.",
                        duration: 3000,
                        className: "bg-red-500 text-white",
                    })
                }
            }
            fetchBeneficiaireData()
        }
    }, [isUpdate, beneficiaireId, form, toast])

    const resetForm = () => {
        form.reset()
        toast({
            description: "Le formulaire a été réinitialisé.",
            duration: 3000,
        })
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true)
        try {
            // Create a request object that exactly matches the BeneficiaireRequest structure
            const beneficiaireRequest = {
                nom: values.nom,
                prenom: values.prenom,
                adresse: values.adresse,
                telephone: values.telephone,
                dateNaissance: values.dateNaissance,
                sexe: values.sexe,
                cin: values.cin,
                nationalite: values.nationalite,
                situationHandicap: values.situationHandicap,
                numCarteHandicap: values.situationHandicap ? values.numCarteHandicap : null,
                commune: { id: values.commune.id },
                province: { id: values.province.id },
                suivies: values.suivies.map((suivie) => ({
                    filiere: { id: suivie.filiere.id },
                    activite: { id: suivie.activite.id },
                    centre: { id: suivie.centre.id },
                    etatDeFormation: suivie.etatDeFormation,
                    dateEffet: suivie.dateEffet,
                    observation: suivie.observation || "",
                    // Don't include beneficiaireId as it will be set by the backend
                })),
            }

            // Log the exact request payload
            console.log("Exact request payload:", JSON.stringify(beneficiaireRequest, null, 2))

            if (isUpdate && beneficiaireId) {
                await api.put(`/beneficiaires/${beneficiaireId}`, beneficiaireRequest)
                toast({
                    description: "Le beneficiaire a été mis à jour avec succès.",
                    className: "bg-green-500 text-white",
                    duration: 3000,
                    title: "Succès",
                })
            } else {
                const response = await api.post(`/beneficiaires`, beneficiaireRequest)
                console.log("Response from server:", response.data)
                toast({
                    description: "Le beneficiaire a été ajouté avec succès.",
                    className: "bg-green-500 text-white",
                    duration: 3000,
                    title: "Succès",
                })
            }
            router.push("/beneficiaire")
        } catch (error: any) {
            console.error("Error object:", error)

            // Log detailed error information
            if (error.response) {
                console.error("Error response status:", error.response.status)
                console.error("Error response data:", error.response.data)
                console.error("Error response headers:", error.response.headers)
            } else if (error.request) {
                console.error("Error request:", error.request)
            } else {
                console.error("Error message:", error.message)
            }

            let errorMessage = "Une erreur est survenue lors de l'ajout du bénéficiaire."

            // Try to extract more detailed error message if available
            if (error.response && error.response.data) {
                if (typeof error.response.data === "string") {
                    errorMessage = error.response.data
                } else if (error.response.data.message) {
                    errorMessage = error.response.data.message
                }
            }

            toast({
                title: "Erreur",
                description: errorMessage,
                duration: 5000,
                className: "bg-red-500 text-white",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const provinceId = form.watch("province.id")

    useEffect(() => {
        if (user?.province && user?.roles === "ADMIN_ROLES") {
            if (user?.province?.id) {
                form.setValue("province", { id: user.province.id }) // Set province value in the form
            }
        }
    }, [user, form])

    const { data: provinces } = useQuery({
        queryKey: "provinces",
        queryFn: getAllProvinces,
    })

    const { data: communes, refetch: refetchCommunes } = useQuery({
        queryKey: ["commune", provinceId],
        queryFn: () => getCommuneByProvince(provinceId),
        enabled: !!provinceId,
    })

    const { data: filieres, refetch: refetchFilieres } = useQuery({
        queryKey: ["filiere", form.watch("suivies.0.activite.id")],
        queryFn: async () => {
            const activite = await getactiviteById(form.watch("suivies.0.activite.id")) // Récupérer l'activité sélectionnée
            return getFilieresByTypeActivite(activite?.typeActivite?.id!) // Utiliser son typeActivite
        },
        enabled: !!form.watch("suivies.0.activite.id"),
    })

    const { data: activites, refetch: refetchActivites } = useQuery({
        queryKey: ["activite", form.watch("suivies.0.centre.id")],
        queryFn: () => getActiviteByCentre(form.watch("suivies.0.centre.id")),
        enabled: !!form.watch("suivies.0.centre.id"),
    })

    const { data: centres, refetch: refetchCentres } = useQuery({
        queryKey: ["centres", provinceId],
        queryFn: () => getCentreByProvince(provinceId),
        enabled: !!provinceId,
    })

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle>{isUpdate ? "Mettre à jour le beneficiaire" : "Ajouter un nouveau beneficiaire"}</CardTitle>
                <CardDescription>
                    Remplissez le formulaire pour {isUpdate ? "mettre à jour le beneficiaire" : "ajouter un nouveau beneficiaire"}
                    .
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="grid grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="nom"
                                render={({ field }) => (
                                    <FormItem className="col-span-1">
                                        <FormLabel>Nom</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nom du bénéficiaire" {...field} className="w-full" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="prenom"
                                render={({ field }) => (
                                    <FormItem className="col-span-1">
                                        <FormLabel>Prénom</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Prénom du bénéficiaire" {...field} className="w-full" />
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
                                            <textarea placeholder="Adresse" rows={4} className="w-full border rounded-md p-2" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="dateNaissance"
                                render={({ field }) => (
                                    <FormItem className="col-span-1">
                                        <FormLabel>Date de naissance</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} className="w-full" />
                                        </FormControl>
                                        <FormDescription>Sélectionnez la date de naissance du bénéficiaire.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="sexe"
                                render={({ field }) => (
                                    <FormItem className="col-span-1">
                                        <FormLabel>Sexe</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value ?? ""} // Ensure value is never undefined
                                        >
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Sélectionnez le sexe" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="M">Masculin</SelectItem>
                                                <SelectItem value="F">Féminin</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormDescription>Choisissez le sexe du bénéficiaire.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="cin"
                                render={({ field }) => (
                                    <FormItem className="col-span-1">
                                        <FormLabel>CIN</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Numéro de CIN" {...field} className="w-full" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="telephone"
                                render={({ field }) => (
                                    <FormItem className="col-span-1">
                                        <FormLabel>Téléphone</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Numéro de téléphone" {...field} className="w-full" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="nationalite"
                                render={({ field }) => (
                                    <FormItem className="col-span-1">
                                        <FormLabel>Nationalité</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nationalité" {...field} className="w-full" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="situationHandicap"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                        <FormControl>
                                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>Situation de handicap</FormLabel>
                                            <FormDescription>Cochez si le bénéficiaire est en situation de handicap</FormDescription>
                                        </div>
                                    </FormItem>
                                )}
                            />
                            {situationHandicap && (
                                <FormField
                                    control={form.control}
                                    name="numCarteHandicap"
                                    render={({ field }) => (
                                        <FormItem className="col-span-1">
                                            <FormLabel>Numéro de carte handicap</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Numéro de carte handicap" {...field} className="w-full" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
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
                                                    const selectedProvince = provinces?.find((p) => p.id === Number.parseInt(value))
                                                    if (selectedProvince) {
                                                        field.onChange({ id: selectedProvince.id })
                                                        refetchCommunes()
                                                        refetchCentres()
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
                                                const selectedCommune = communes?.find((p) => p.id === Number(value))
                                                if (selectedCommune) {
                                                    field.onChange(selectedCommune)
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
                            {!isUpdate && (
                                <FormField
                                    control={form.control}
                                    name="suivies.0.centre"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Centre</FormLabel>
                                            <Select
                                                value={field.value?.id ? field.value.id.toString() : ""}
                                                onValueChange={(value) => {
                                                    const selectedCentre = centres?.find((p) => p.id === Number(value))
                                                    if (selectedCentre) {
                                                        field.onChange(selectedCentre)
                                                        refetchActivites()
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
                            )}
                            {!isUpdate && (
                                <FormField
                                    control={form.control}
                                    name="suivies.0.activite"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Activité</FormLabel>
                                            <Select
                                                value={field.value?.id ? field.value.id.toString() : ""}
                                                onValueChange={(value) => {
                                                    const selectedActivite = activites?.find((p) => p.id === Number.parseInt(value))
                                                    if (selectedActivite) {
                                                        field.onChange({ id: selectedActivite.id })
                                                        refetchFilieres()
                                                    }
                                                }}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Sélectionnez une activité" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {activites?.map((activite) => (
                                                        <SelectItem key={activite.id} value={activite?.id?.toString() || ""}>
                                                            {activite.typeActivite?.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                            {!isUpdate && (
                                <FormField
                                    control={form.control}
                                    name="suivies.0.filiere"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Filière</FormLabel>
                                            <Select
                                                value={field.value?.id ? field.value.id.toString() : ""}
                                                onValueChange={(value) => {
                                                    const selectedFiliere = filieres?.find((p) => p.id === Number.parseInt(value))
                                                    if (selectedFiliere) {
                                                        field.onChange({ id: selectedFiliere.id })
                                                    }
                                                }}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Sélectionnez une filière" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {filieres?.map((filiere) => (
                                                        <SelectItem key={filiere.id} value={filiere?.id?.toString() || ""}>
                                                            {filiere.specialite}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                            {!isUpdate && (
                                <FormField
                                    control={form.control}
                                    name="suivies.0.etatDeFormation"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>État de Formation</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Sélectionnez un état" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="en cours">En cours</SelectItem>
                                                    <SelectItem value="terminé">Terminé</SelectItem>
                                                    <SelectItem value="abandonné">Abandonné</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                            {!isUpdate && (
                                <FormField
                                    control={form.control}
                                    name="suivies.0.dateEffet"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Date Effet</FormLabel>
                                            <FormControl>
                                                <Input type="date" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                            {!isUpdate && (
                                <FormField
                                    control={form.control}
                                    name="suivies.0.observation"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Observation</FormLabel>
                                            <FormControl>
                        <textarea
                            placeholder="Observation"
                            rows={4}
                            className="w-full border rounded-md p-2"
                            value={field.value || ""} // Ensure value is controlled and never undefined
                            onChange={field.onChange} // Ensure state updates
                        />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                        </div>
                        <div className="flex space-x-4">
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        {isUpdate ? "Mise à jour..." : "Ajout en cours..."}
                                    </>
                                ) : isUpdate ? (
                                    "Mettre à jour le beneficiaire"
                                ) : (
                                    "Ajouter le beneficiaire"
                                )}
                            </Button>
                            <Button type="button" variant="outline" onClick={resetForm}>
                                Réinitialiser
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
