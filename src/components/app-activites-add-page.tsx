"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useQuery } from "react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getProprieteDuCentres } from "@/app/api/ProprieteDuCentre";
import { getCentres } from "@/app/api/centre";
import { getPersonnels } from "@/app/api/Personnel";
import { getTypeActivites } from "@/app/api/TypeActivite";
import { TypeActivite } from "@/app/type/TypeActivite";
import { getFilieresByTypeActivite } from "@/app/api/Filiere";
import { Filiere } from "@/app/type/Filiere";
import { MultiSelect } from "./components-ui-multi-select";
import { api } from "@/app/api";

const formSchema = z.object({
  nom: z.string().min(2, {
    message: "Le nom d'activité doit contenir au moins 2 caractères.",
  }),
  typeActivite: z.object({
    id: z.number(),
  }),
  dateOuverture: z.string().min(1, { message: "Date d'ouverture est requise" }),
  responsableActivite: z.object({
    id: z.number(),
    nomComplet: z.string(),
  }),
  capaciteAccueil: z.number().min(0),
  superficie: z.number().min(0),
  gestion: z.object({
    id: z.number(),
    
  }),
  partenariat: z.string().optional(),
  dateSignatureConvention: z.string().optional(),
  centre: z.object({
    id: z.number(),
  }),
  filieres: z.array(
    z.object({
      id: z.number(),
    })
  ),
});

interface AddActiviteProps {
  isUpdate?: boolean;
  activiteId?: number | null;
}

export default function AddActivitePage({ isUpdate = false, activiteId = null }: AddActiviteProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [selectedTypeActivite, setSelectedTypeActivite] = useState<TypeActivite | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      typeActivite: { id: 0 },
      nom: "",
      dateOuverture: "",
      responsableActivite: { id: 0, nomComplet: "" },
      capaciteAccueil: 0,
      superficie: 0,
      gestion: { id: 0},
      partenariat: "",
      dateSignatureConvention: "",
      centre: { id: 0 },
      filieres: [],
    },
  });

  const { data: typeActivites } = useQuery<TypeActivite[]>("typeActivite", getTypeActivites);
  const { data: personnel } = useQuery("personnel", getPersonnels);
  const { data: gestions } = useQuery("proprieteDuCentres", getProprieteDuCentres);
  const { data: centre } = useQuery({
    queryKey: "centre",
    queryFn: getCentres,
});  const typeactiviteId = form.watch("typeActivite.id");

  const { data: filieres , refetch: refetchTypeActivite} = useQuery<Filiere[]>({
        queryKey: ["filiere", typeactiviteId],
        queryFn: () => getFilieresByTypeActivite(typeactiviteId),
        enabled: !!typeactiviteId,
      });
  useEffect(() => {
    if (isUpdate && activiteId) {
      // Fetch the existing activite data and populate the form
      const fetchActiviteData = async () => {
        const response = await api.get(`/activite/${activiteId}`);
        Object.keys(response.data).forEach((key) => {
          form.setValue(key as any, response.data[key]);
        });
      };
      fetchActiviteData();
    }
  }, [isUpdate, activiteId, form]);



  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (isUpdate && activiteId) {
        await api.put(`/activite/${activiteId}`, values);
        toast({
          description: "L'activite a été mis à jour avec succès.",
          className: "bg-green-500 text-white",
          duration: 3000,
          title: "Succès",
        });
      } else {
        await api.post(`/activite/add`, values);
        toast({
          description: "L'activite a été ajouté avec succès.",
          className: "bg-green-500 text-white",
          duration: 3000,
          title: "Succès",
        });
      }
      router.push("/activites");
    } catch (error) {
      console.error("Erreur:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout d'activité.",
        duration: 3000,
        className: "bg-red-500 text-white",
      });
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>{isUpdate ? "Mettre à jour l'activite" : "Ajouter une nouvelle activite"}</CardTitle>
          <CardDescription>
            Remplissez le formulaire pour {isUpdate ? "mettre à jour l'activite " : "ajouter une nouvelle activite"}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="nom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nom d'activité"
                          {...field}
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
  control={form.control}
  name="typeActivite"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Type d&apos;activité</FormLabel>
      <Select
        value={field.value?.id ? field.value.id.toString() : ""}
        onValueChange={(value) => {
          const selectedTypeActivite = typeActivites?.find((p) => p.id === parseInt(value));
          if (selectedTypeActivite) {
            field.onChange({ id: selectedTypeActivite.id});
            refetchTypeActivite();
            setSelectedTypeActivite(selectedTypeActivite);
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
                          const selectedPersonnel = personnel?.find((p) => p.id === parseInt(value));
                          if (selectedPersonnel) {
                            field.onChange({ id: selectedPersonnel.id, nomComplet: selectedPersonnel.nomComplet });
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
                            <SelectItem
                              key={person.id}
                              value={person.id?.toString() ?? ""}
                            >
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
                  name="capaciteAccueil"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capacité d&apos;accueil</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          value={field.value ?? 0}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value))
                          }
                        />
                      </FormControl>
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
                          value={field.value ?? 0}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value))
                          }
                        />
                      </FormControl>
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
                          const selectedGestion = gestions?.find((p) => p.id === parseInt(value));
                          if (selectedGestion) {
                            field.onChange({ id: selectedGestion.id, nom: selectedGestion.nom });
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
                            <SelectItem
                              key={propriete.id}
                              value={propriete.id?.toString() ?? ""}
                            >
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
                    <FormItem>
                      <FormLabel>Partenariat</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dateSignatureConvention"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date de signature de la convention</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
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
                                                    const selectedCentre = centre?.find((p) => p.id === Number(value));
                                                    if (selectedCentre) {
                                                        field.onChange(selectedCentre);
                                                    }
                                                }}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Sélectionner un centre" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {centre?.map((centr) => (
                                                        <SelectItem key={centr.id} value={centr.id?.toString() ?? ""}>
                                                            {centr.nomFr}
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
          // Vérifier que "filieres" est bien défini avant de mapper
          options={filieres?.map((filiere) => ({
            label: filiere.nom || "",
            value: filiere.id?.toString() || "",
          })) || []}

          // Vérifier que "field.value" est un tableau avant de mapper
          value={(field.value || []).map((filiere) => {
            const selectedFiliere = filieres?.find((f) => f.id === filiere.id);
            return {
              label: selectedFiliere?.nom || "",
              value: filiere.id?.toString() || "",
            };
          })}

          // Lors d'un changement, on met à jour "field.value"
          onChange={(selectedOptions) => {
            field.onChange(
              selectedOptions.map((option) => ({
                id: Number(option.value), // Convertir en Number proprement
              }))
            );
          }}

          placeholder="Sélectionner des filières"
        />
      </FormControl>
    </FormItem>
  )}
/>

              </div>
              <Button type="submit">{isUpdate ? "Mettre à jour l'activite" : "Ajouter une activite"}</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}