"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
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
import { useQuery, useMutation } from "react-query";
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
    nom: z.string(),
  }),
  partenariat: z.string().optional(),
  dateSignatureConvention: z.string().optional(),
  centre: z.object({
    id: z.number(),
  }),
  filiere: z.object({
    id: z.number(),
    nom: z.string(),
  }),
  
});

export default function AddActivitePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [selectedTypeActivite, setSelectedTypeActivite] =
    useState<TypeActivite | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      typeActivite: { id: 0},
      nom: "",
      dateOuverture: "",
      responsableActivite: { id: 0, nomComplet: "" },
      capaciteAccueil: 0,
      superficie: 0,
      gestion: { id: 0, nom: "" },
      partenariat: "",
      dateSignatureConvention: "",
      centre: { id: 0},
      filiere: { id: 0, nom: "" },
    },
  });

  const { data: typeActivites } = useQuery<TypeActivite[]>(
    "typeActivites",
    getTypeActivites
  );
  const { data: personnel } = useQuery("personnel", getPersonnels);
  const { data: proprieteDuCentres } = useQuery(
    "proprieteDuCentres",
    getProprieteDuCentres
  );
  const { data: centres } = useQuery("centres", getCentres);
  const { data: filieres, refetch: refetchFilieres } = useQuery(
    ["filieres", selectedTypeActivite?.id],
    () => getFilieresByTypeActivite(selectedTypeActivite?.id || 0),
    { enabled: !!selectedTypeActivite }
  );

  useEffect(() => {
    refetchFilieres();
  }, [selectedTypeActivite]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = api.post(`/activite`, values).then((res) => {
        console.log(response);
      });

      toast({
        description: "une activité a été ajouté avec succès.",
        className: "bg-green-500 text-white",
        duration: 3000,
        title: "Succès",
      });
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
          <CardTitle>Ajouter une activité</CardTitle>
          <CardDescription>
            Remplissez le formulaire pour ajouter une nouvelle activité.
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
                        onValueChange={(value) => {
                          const selectedType = typeActivites?.find(
                            (t) => t.id === parseInt(value)
                          );
                          if (selectedType) {
                            field.onChange(selectedType);
                            setSelectedTypeActivite(selectedType);
                          }
                        }}
                        value={field.value.id.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un type d'activité" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {typeActivites?.map((type) => (
                            <SelectItem
                              key={type.id}
                              value={type.id?.toString() ?? ""}
                            >
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
                        onValueChange={(value) => {
                          const selectedPersonnel = personnel?.find(
                            (p) => p.id === parseInt(value)
                          );
                          if (selectedPersonnel) {
                            field.onChange(selectedPersonnel);
                          }
                        }}
                        value={field.value.id.toString()}
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
                        onValueChange={(value) => {
                          const selectedGestion = proprieteDuCentres?.find(
                            (p) => p.id === parseInt(value)
                          );
                          if (selectedGestion) {
                            field.onChange(selectedGestion);
                          }
                        }}
                        value={field.value.id.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un type de gestion" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {proprieteDuCentres?.map((propriete) => (
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
                        onValueChange={(value) => {
                          const selectedCentre = centres?.find(
                            (c) => c.id === parseInt(value)
                          );
                          if (selectedCentre) {
                            field.onChange(selectedCentre);
                          }
                        }}
                        value={field.value.id.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un centre" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {centres?.map((centre) => (
                            <SelectItem
                              key={centre.id}
                              value={centre.id?.toString() ?? ""}
                            >
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
                  name="filiere"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Filiere</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          const selectedFiliere = filieres?.find(
                            (c) => c.id === parseInt(value)
                          );
                          if (selectedFiliere) {
                            field.onChange(selectedFiliere);
                          }
                        }}
                        value={field.value.id.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner une filiere" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {filieres?.map((filiere) => (
                            <SelectItem
                              key={filiere.id}
                              value={filiere.id?.toString() ?? ""}
                            >
                              {filiere.nom}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
              </div>
              <Button type="submit">Ajouter l&apos;activité</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
