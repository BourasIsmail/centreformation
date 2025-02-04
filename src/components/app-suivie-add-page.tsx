"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { api } from "@/app/api";
import { getFilieres } from "@/app/api/Filiere";
import { getCentres } from "@/app/api/centre";
import { getbeneficiaireById } from "@/app/api/Beneficiaire";
import { getActivites } from "@/app/api/Activite";

const formSchema = z.object({
  beneficiaire: z.object({ id: z.number() }),
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

export function AddSuiviePage({ benef }: { benef: number }) {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      beneficiaire:{ id: 0},
      filiere: { id: 0},
      activite: { id: 0},
      centre: { id: 0},
      etatDeFormation: "",
      dateEffet: "",
      observation: "",
    },
  }); 

  const { data: filieres } = useQuery("filieres", getFilieres);
  const { data: activites } = useQuery("activites", getActivites);
  const { data: centres } = useQuery("centres", getCentres);
  const { data: beneficiaire } = useQuery(["beneficiaire", benef],
    () => getbeneficiaireById(benef));
   

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await api.post(`/Suivie`, { ...values, beneficiaire: { id: benef } });
      toast({
        title: "Succès",
        description: "Le suivi a été ajouté avec succès.",
        className: "bg-green-500 text-white",
        duration: 3000,
      });
      router.push("/Suivie");
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
        <CardTitle>Ajouter un Suivi</CardTitle>
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
                <Select onValueChange={(value) => field.onChange({ id: parseInt(value, 10) })}>
                <FormControl>
                <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionnez un centre" />
                </SelectTrigger>
                </FormControl>
                <SelectContent>
                    {centres?.map((centre) => (
                <SelectItem key={centre.id} value={centre?.id?.toString() || ""}>
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
                    <Select onValueChange={(value) => field.onChange({ id: parseInt(value, 10) })}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Sélectionnez une activité" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {activites?.map((activite) => (
                          <SelectItem key={activite.id} value={activite?.id?.toString() || ""}>
                            {activite.nom}
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
                            {filiere.nom}
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
            <Button type="submit" className="w-full">
              Ajouter
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
function getBeneficiaireById(benef: number): any {
    throw new Error("Function not implemented.");
}

