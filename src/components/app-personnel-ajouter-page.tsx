"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useQuery } from "react-query"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getAllProvinces } from "@/app/api/province"
import { getCommuneByProvince } from "@/app/api/commune"
import type { Commune } from "@/app/type/Commune"
import { api } from "@/app/api"
import type { UserInfo } from "@/app/type/UserInfo"
import { getCurrentUser } from "@/app/api/index"

const formSchema = z.object({
    nomComplet: z.string().min(2, {
        message: "Le nom complet doit contenir au moins 2 caractères.",
    }),
    telephone: z.string().min(8, {
        message: "Le numéro de téléphone doit contenir au moins 8 caractères.",
    }),
    email: z.string().email({
        message: "Veuillez entrer une adresse email valide.",
    }),
    cin: z.string().min(2, {
        message: "Le CIN doit contenir au moins 2 caractères.",
    }),
    fonction: z.string().min(2, {
        message: "La fonction doit contenir au moins 2 caractères.",
    }),
    vacataire: z.boolean().default(false),
    niveauEtude: z.string().optional(),
    province: z.object({ id: z.number() }).refine((value) => value.id > 0, {
        message: "Veuillez sélectionner une province.",
    }),
    commune: z.object({ id: z.number() }).refine((value) => value.id > 0, {
        message: "Veuillez sélectionner une commune.",
    }),
})
interface AddPersonnelProps {
    isUpdate?: boolean
    personnelId?: number | null
}
export function AddPersonnel({ isUpdate = false, personnelId = null }: AddPersonnelProps) {
    const router = useRouter()
    const { toast } = useToast()
    const [communeList, setCommuneList] = useState<Commune[]>([])
    const [user, setUser] = useState<UserInfo | null>(null)
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
            nomComplet: "",
            telephone: "",
            email: "",
            cin: "",
            fonction: "",
            vacataire: false,
            niveauEtude: "",
            province: { id: 0 },
            commune: { id: 0 },
        },
    })
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

    const provinceId = form.watch("province.id")

    useEffect(() => {
        if (isUpdate && personnelId) {
            // Fetch the existing centre data and populate the form
            const fetchPersonnelData = async () => {
                const response = await api.get(`/personnel/${personnelId}`)
                Object.keys(response.data).forEach((key) => {
                    form.setValue(key as any, response.data[key])
                })
            }
            fetchPersonnelData()
        }
    }, [isUpdate, personnelId, form])

    const { data: communes, refetch: refetchCommunes } = useQuery({
        queryKey: ["commune", provinceId],
        queryFn: () => getCommuneByProvince(provinceId),
        enabled: !!provinceId,
    })
    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            if (isUpdate && personnelId) {
                await api.put(`/personnel/${personnelId}`, values)
                toast({
                    description: "Le personnel a été mis à jour avec succès.",
                    className: "bg-green-500 text-white",
                    duration: 3000,
                    title: "Succès",
                })
            } else {
                await api.post(`/personnel/add`, values)
                toast({
                    description: "Le personnel a été ajouté avec succès.",
                    className: "bg-green-500 text-white",
                    duration: 3000,
                    title: "Succès",
                })
            }
            router.push("/personnels")
        } catch (error) {
            console.error("Erreur:", error)
            toast({
                title: "Erreur",
                description: "Une erreur est survenue lors de l'ajout du personnel.",
                variant: "destructive",
            })
        }
    }

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle>{isUpdate ? "Mettre à jour le personnel" : "Ajouter un nouveau personnel"}</CardTitle>
                <CardDescription>
                    Remplissez le formulaire pour {isUpdate ? "mettre à jour le personnel" : "ajouter un nouveau personnel"}.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Nom Complet */}
                            <FormField
                                control={form.control}
                                name="nomComplet"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nom Complet</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nom complet du personnel" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Téléphone */}
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

                            {/* Email */}
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Adresse email" type="email" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* CIN */}
                            <FormField
                                control={form.control}
                                name="cin"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>CIN</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Numéro de CIN" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Fonction */}
                            <FormField
                                control={form.control}
                                name="fonction"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Fonction</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Fonction du personnel" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Vacataire */}
                            <FormField
                                control={form.control}
                                name="vacataire"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Vacataire</FormLabel>
                                        <Select
                                            onValueChange={(value) => field.onChange(value === "true")}
                                            value={field.value ? "true" : "false"}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Sélectionnez une option" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="true">Oui</SelectItem>
                                                <SelectItem value="false">Non</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Niveau d'Étude (conditionally rendered) */}
                            {form.watch("vacataire") && (
                                <FormField
                                    control={form.control}
                                    name="niveauEtude"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Niveau d'Étude</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value || ""}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Sélectionnez un niveau" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="bac">Baccalauréat</SelectItem>
                                                    <SelectItem value="licence">Licence</SelectItem>
                                                    <SelectItem value="master">Master</SelectItem>
                                                    <SelectItem value="doctorat">Doctorat</SelectItem>
                                                </SelectContent>
                                            </Select>
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

                            {/* Commune */}
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
                        </div>
                        <Button type="submit">{isUpdate ? "Mettre à jour le personnel" : "Ajouter le personnel"}</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
