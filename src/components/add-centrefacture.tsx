"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/app/api";
import { getCurrentUser } from "@/app/api/index";
import { UserInfo } from "@/app/type/UserInfo";
import { getCentres } from "@/app/api/centre";


const formSchema = z.object({
    
    eau: z.number().positive({ message: "Eau." }),
    consEau: z.number().positive({ message: "La consommation d'eau." }),
    electricite: z.number().positive({ message: "Electricité." }),
    consElect: z.number().positive({ message: "La consommation d'électricité." }),
    total: z.number().positive({ message: "Le total." }),
    datefacture: z.string().optional(),
  
  
});

interface AddFactureProps {
  isUpdate?: boolean;
  factureId?: number | null;
  centreId?: number | null;
}

export function AddFacture({ isUpdate = false, factureId = null, centreId = null }: AddFactureProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);
  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    };
    fetchUser();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        eau: 0,
        consEau:0,
        electricite: 0,
        consElect: 0,
        total: 0,
        datefacture: "",
    },
  });

  
  useEffect(() => {
    
    if (isUpdate && factureId ) {
      // Fetch the existing centre data and populate the form
      const fetchFactureData = async () => {
        const response = await api.get(`/factures/${factureId}`);
        Object.keys(response.data).forEach((key) => {
          form.setValue(key as any, response.data[key]);
        });
      };
      fetchFactureData();
    }
  }, [isUpdate, factureId, form]);
  useEffect(() => {
    const { eau,  electricite } = form.getValues();
    const calculatedTotal = eau + electricite ; // Adjust the calculation if needed
    form.setValue("total", calculatedTotal);
  }, [form, form.watch("eau"), form.watch("electricite")]);

  const { data: centres } = useQuery("centres", getCentres);

  

  
  
  
  async function onSubmit(values: z.infer<typeof formSchema>) {

    try {
      if (isUpdate && factureId) {
        await api.put(`/factures/${factureId}`, values);
        toast({
          description: "Le centre a été mis à jour avec succès.",
          className: "bg-green-500 text-white",
          duration: 3000,
          title: "Succès",
        });
      } else {
        await api.post(`/factures/${centreId}`,{ ...values, centreId });
        toast({
          description: "La facture a été ajouté avec succès.",
          className: "bg-green-500 text-white",
          duration: 3000,
          title: "Succès",
        });
      }
      router.push(`/centres/${centreId}/facture`);
    } catch (error) {
      console.error("Erreur:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout/mise à jour de la facture.",
        duration: 3000,
        className: "bg-red-500 text-white",
      });
    }
  }

  return (
    <div className="container mx-auto px-4">
      <Card className="w-full max-w-6xl mx-auto">
        <CardHeader>
          <CardTitle>{isUpdate ? "Mettre à jour la facture" : "Ajouter une nouvelle facture"}</CardTitle>
          <CardDescription>
            Remplissez le formulaire pour {isUpdate ? "mettre à jour la facture" : "ajouter une nouvelle facture"}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
                <FormField
              control={form.control}
              name="datefacture"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date de facture</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
                <FormField
  control={form.control}
  name="eau"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Cout de l'eau</FormLabel>
      <FormControl>
        <Input
          type="number"
          {...field}
          onChange={(e) => field.onChange(parseFloat(e.target.value))}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
<FormField
control={form.control}
  name="consEau"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Consommation de l'eau</FormLabel>
      <FormControl>
        <Input
          type="number"
          {...field}
          onChange={(e) => field.onChange(parseFloat(e.target.value))}
        />
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
      <FormLabel>Cout de l'électricité</FormLabel>
      <FormControl>
        <Input
          type="number"
          {...field}
          onChange={(e) => field.onChange(parseFloat(e.target.value))}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
<FormField
control={form.control}
  name="consElect"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Consommation de l'électricité</FormLabel>
      <FormControl>
        <Input
          type="number"
          {...field}
          onChange={(e) => field.onChange(parseFloat(e.target.value))}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
<FormField
control={form.control}
  name="total"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Le total</FormLabel>
      <FormControl>
        <Input
          type="number"
          {...field}
          onChange={(e) => field.onChange(parseFloat(e.target.value))}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>              
</div>


<Button type="submit">{isUpdate ? "Mettre à jour la facture" : "Ajouter la facture"}</Button>
</form>
</Form>
</CardContent>
</Card>
</div>
);
}