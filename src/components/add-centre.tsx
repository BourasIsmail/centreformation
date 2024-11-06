"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const formSchema = z.object({
  nomFr: z.string().min(2, { message: "Le nom en français doit contenir au moins 2 caractères." }),
  nomAr: z.string().min(2, { message: "Le nom en arabe doit contenir au moins 2 caractères." }),
  typeCentre: z.string({ required_error: "Veuillez sélectionner un type de centre." }),
  dateConstruction: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Format de date invalide. Utilisez YYYY-MM-DD." }),
  telephone: z.string().regex(/^\+?[0-9]{10,14}$/, { message: "Numéro de téléphone invalide." }),
  province: z.string({ required_error: "Veuillez sélectionner une province." }),
  commune: z.string({ required_error: "Veuillez sélectionner une commune." }),
  adresse: z.string().min(5, { message: "L'adresse doit contenir au moins 5 caractères." }),
  responsable: z.string({ required_error: "Veuillez sélectionner un responsable." }),
  milieuImplantation: z.string({ required_error: "Veuillez sélectionner un milieu d'implantation." }),
  superficie: z.number().positive({ message: "La superficie doit être un nombre positif." }),
  utilisation: z.string().min(2, { message: "L'utilisation doit contenir au moins 2 caractères." }),
  etat: z.string().min(2, { message: "L'état doit contenir au moins 2 caractères." }),
  electricite: z.string().min(2, { message: "Veuillez spécifier l'état de l'électricité." }),
  telephoneFixe: z.string().regex(/^\+?[0-9]{10,14}$/, { message: "Numéro de téléphone fixe invalide." }),
  internet: z.string().min(2, { message: "Veuillez spécifier l'état de la connexion internet." }),
  nbrPC: z.number().int().nonnegative({ message: "Le nombre de PC doit être un entier positif ou zéro." }),
  nbrImprimante: z.number().int().nonnegative({ message: "Le nombre d'imprimantes doit être un entier positif ou zéro." }),
  nbrPersonneConnaissanceInfo: z.number().int().nonnegative({ message: "Le nombre de personnes doit être un entier positif ou zéro." }),
  nbrPersonneOperationelApresFormation: z.number().int().nonnegative({ message: "Le nombre de personnes doit être un entier positif ou zéro." }),
  coutEstimationAmenagement: z.number().nonnegative({ message: "Le coût doit être un nombre positif ou zéro." }),
  coutEstimationEquipement: z.number().nonnegative({ message: "Le coût doit être un nombre positif ou zéro." }),
  observation: z.string().optional(),
})

const typeCentres = [
  { id: 1, nom: "Formation Professionnelle" },
  { id: 2, nom: "Apprentissage" },
  { id: 3, nom: "Qualification Professionnelle" },
]

const provinces = [
  { id: 1, nom: "Casablanca" },
  { id: 2, nom: "Rabat" },
  { id: 3, nom: "Marrakech" },
]

const communes = [
  { id: 1, nom: "Anfa" },
  { id: 2, nom: "Hay Hassani" },
  { id: 3, nom: "Sidi Bernoussi" },
]

const personnels = [
  { id: 1, nom: "Mohammed Alami" },
  { id: 2, nom: "Fatima Zahra Bennis" },
  { id: 3, nom: "Ahmed Tazi" },
]

const milieuxImplantation = [
  { id: 1, nom: "Urbain" },
  { id: 2, nom: "Rural" },
  { id: 3, nom: "Périurbain" },
]


export function AddCentre() {
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nomFr: "",
      nomAr: "",
      typeCentre: "",
      dateConstruction: "",
      telephone: "",
      province: "",
      commune: "",
      adresse: "",
      responsable: "",
      milieuImplantation: "",
      superficie: 0,
      utilisation: "",
      etat: "",
      electricite: "",
      telephoneFixe: "",
      internet: "",
      nbrPC: 0,
      nbrImprimante: 0,
      nbrPersonneConnaissanceInfo: 0,
      nbrPersonneOperationelApresFormation: 0,
      coutEstimationAmenagement: 0,
      coutEstimationEquipement: 0,
      observation: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  return (
    <div className="container mx-auto px-4">
      <Card className="w-full max-w-6xl mx-auto">
        <CardHeader>
          <CardTitle>Ajouter un nouveau centre</CardTitle>
          <CardDescription>Remplissez le formulaire pour ajouter un nouveau centre de formation.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-6">
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
                    name="province"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Province</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez une province" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {provinces.map((province) => (
                              <SelectItem key={province.id} value={province.id.toString()}>
                                {province.nom}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="space-y-6">
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
                    name="commune"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Commune</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez une commune" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {communes.map((commune) => (
                              <SelectItem key={commune.id} value={commune.id.toString()}>
                                {commune.nom}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="typeCentre"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type de centre</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez un type de centre" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {typeCentres.map((type) => (
                              <SelectItem key={type.id} value={type.id.toString()}>
                                {type.nom}
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
                  <FormField
                    control={form.control}
                    name="responsable"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Responsable</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez un responsable" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {personnels.map((personnel) => (
                              <SelectItem key={personnel.id} value={personnel.id.toString()}>
                                {personnel.nom}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="milieuImplantation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Milieu d'implantation</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez un milieu" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {milieuxImplantation.map((milieu) => (
                            <SelectItem key={milieu.id} value={milieu.id.toString()}>
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
                  name="superficie"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Superficie (m²)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  name="nbrPC"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre de PC</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value, 10))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nbrImprimante"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre d'imprimantes</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value, 10))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="nbrPersonneConnaissanceInfo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Personnes avec connaissances en informatique</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value, 10))} />
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
                        <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value, 10))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="coutEstimationAmenagement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Coût estimé d'aménagement</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="coutEstimationEquipement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Coût estimé d'équipement</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))} />
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
              <Button type="submit">Ajouter le centre</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}