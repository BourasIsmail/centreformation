"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useQuery } from "react-query";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { api } from "@/app/api";

import { getCentres } from "@/app/api/centre";
import { getbeneficiaireById } from "@/app/api/Beneficiaire";
import { getActiviteByCentre, getactiviteById, getActivites } from "@/app/api/Activite";
import { getFilieresByTypeActivite } from "@/app/api/Filiere";

const formSchema = z.object({
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
});
interface AddSuiviePageProps {
  isUpdate?: boolean;
  beneficiaireId: string | null;
  suivieId: string | null;
}
export function AddSuiviePage({ isUpdate = false, beneficiaireId, suivieId }: AddSuiviePageProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { data: beneficiaire } = useQuery(
    ["beneficiaire", beneficiaireId],
    () => (beneficiaireId ? getbeneficiaireById(Number(beneficiaireId)) : Promise.resolve(null)),
    { enabled: !!beneficiaireId }
  );
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      filiere: { id: 0},
      activite: { id: 0},
      centre: { id: 0},
      etatDeFormation: "",
      dateEffet: "",
      observation: "",
    },
  });



  const { data: filieres , refetch : refetchFilieres} = useQuery({
    queryKey: ["filiere", form.watch("activite.id")],
    queryFn: async () => {
      const activite = await getactiviteById(form.watch("activite.id")); // Récupérer l'activité sélectionnée
      return getFilieresByTypeActivite(activite?.typeActivite?.id!); // Utiliser son typeActivite
    },
    enabled: !!form.watch("activite.id"),
  });
  const { data: activites ,refetch: refetchActivites} = useQuery({
    queryKey: ["activite", form.watch("centre.id")],
    queryFn: () => getActiviteByCentre(form.watch("centre.id")),
    enabled: !!form.watch("centre.id"),
  });
  const { data: centres } = useQuery("centres", getCentres);



  async function onSubmit(values: z.infer<typeof formSchema>) {

    try {

          if (isUpdate && suivieId) {
            await api.put(`/suivies/${suivieId}`, values);
            toast({
              description: "Le centre a été mis à jour avec succès.",
              className: "bg-green-500 text-white",
              duration: 3000,
              title: "Succès",
            });
          } else {
            await api.post(`/suivies/${beneficiaireId}`, { ...values, beneficiaireId } );
            toast({
              description: "La facture a été ajouté avec succès.",
              className: "bg-green-500 text-white",
              duration: 3000,
              title: "Succès",
            });
          }
      router.push(`/beneficiaire/${beneficiaireId}/suivie`);
    } catch (error) {
      console.error("Erreur:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout du suivi.",
        variant: "destructive",
      });
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
          <CardTitle>{isUpdate ? "Mettre à jour le suivie" : "Ajouter un suivie"}</CardTitle>
          <CardDescription>
            Remplissez le formulaire pour {isUpdate ? "mettre à jour le suivie" : "ajouter un facture"}.
          </CardDescription>
          </CardHeader>
      <CardContent>
        <Form {...form}>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-2 gap-6">
                <div>
                <p className="text-sm font-semibold">Bénéficiaire:</p>
                <p className="text-lg font-semibold">{beneficiaire?.prenom} {beneficiaire?.nom}</p>
                </div>
                <FormField
                                    control={form.control}
                                    name="centre"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Centre</FormLabel>
                                            <Select
                                                value={field.value?.id ? field.value.id.toString() : ""}
                                                onValueChange={(value) => {
                                                    const selectedCentre = centres?.find((p) => p.id === Number(value));
                                                    if (selectedCentre) {
                                                        field.onChange(selectedCentre);
                                                        refetchActivites();
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
                name="activite"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Activité</FormLabel>
                    <Select
                    value={field.value?.id ? field.value.id.toString() : ""}
                    onValueChange={(value) => {
                      const selectedActivite = activites?.find((p) => p.id === parseInt(value));
                      if (selectedActivite) {
                        field.onChange({ id: selectedActivite.id });
                        refetchFilieres();
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
              <FormField
                control={form.control}
                name="filiere"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Filière</FormLabel>
                    <Select onValueChange={(value) => field.onChange({ id: parseInt(value, 10) })}>
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

              <FormField
              control={form.control}
              name="etatDeFormation"
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
            <FormField
              control={form.control}
              name="dateEffet"
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
            <FormField control={form.control} name="observation" render={({ field }) => (
                <FormItem>
                <FormLabel>Observation</FormLabel>
                <FormControl>
                <textarea
                 placeholder="Observation"
                rows={4}
                className="w-full border rounded-md p-2"
                {...field}
                />
                </FormControl>
                <FormMessage />
                </FormItem>
                )}
            />
            </div>
            <Button type="submit">{isUpdate ? "Mettre à jour le suivie" : "Ajouter un suivie"}</Button>

          </form>
        </Form>
      </CardContent>
    </Card>
  );
}




