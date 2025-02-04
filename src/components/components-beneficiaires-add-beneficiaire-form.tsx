"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Beneficiaire } from "@/app/type/Beneficiaire";
import { Commune } from "@/app/type/Commune";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "react-query";
import { getAllProvinces } from "@/app/api/province";
import { getCommuneByProvince } from "@/app/api/commune";
import { api } from "@/app/api";

const formSchema = z.object({
  nom: z.string().min(2, {
    message: "Le nom doit contenir au moins 2 caractères.",
  }),
  prenom: z.string().min(2, {
    message: "Le prénom doit contenir au moins 2 caractères.",
  }),
  dateNaissance: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: "La date doit être au format YYYY-MM-DD.",
  }),
  sexe: z.enum(["M", "F"], {
    required_error: "Veuillez sélectionner un sexe.",
  }),
  cin: z.string().min(6, {
    message: "Le CIN doit contenir au moins 6 caractères.",
  }),
  telephone: z.string().min(8, {
    message: "Le numéro de téléphone doit contenir au moins 8 chiffres.",
  }),
  commune: z.object({ id: z.number() }).refine((value) => value.id > 0, {
    message: "Veuillez sélectionner une commune.",
  }),
  province: z.object({ id: z.number() }).refine((value) => value.id > 0, {
    message: "Veuillez sélectionner une province.",
  }),
});

export function AddBeneficiaireFormComponent() {
  const router = useRouter();
  const { toast } = useToast();
  const [communes, setCommunes] = useState<Commune[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nom: "",
      prenom: "",
      dateNaissance: "",
      sexe: undefined,
      cin: "",
      telephone: "",
      commune: { id: 0 },
      province: { id: 0 },
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = api.post(`/beneficiaire/add`, values).then((res) => {
        console.log(response);
      });

      toast({
        description: "Le bénéficiaire a été ajouté avec succès.",
        className: "bg-green-500 text-white",
        duration: 3000,
        title: "Succès",
      });
      
      router.push("/beneficiaire");
    } catch (error) {
      console.error("Erreur:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout du bénéficiaire.",
        duration: 3000,
        className: "bg-red-500 text-white",
      });
    }
  }

  const { data: province } = useQuery({
    queryKey: "provinces",
    queryFn: getAllProvinces,
  });

  useEffect(() => {
    const provinceId = form.watch("province.id");
    if (provinceId) {
      const fetchCommune = async () => {
        const data = await getCommuneByProvince(provinceId);
        setCommunes(data);
      };

      fetchCommune();
    }
  });

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Ajouter un Bénéficiaire</CardTitle>
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
                      <Input
                        placeholder="Nom du bénéficiaire"
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
                name="prenom"
                render={({ field }) => (
                  <FormItem className="col-span-1">
                    <FormLabel>Prénom</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Prénom du bénéficiaire"
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
                name="dateNaissance"
                render={({ field }) => (
                  <FormItem className="col-span-1">
                    <FormLabel>Date de naissance</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} className="w-full" />
                    </FormControl>
                    <FormDescription>
                      Sélectionnez la date de naissance du bénéficiaire.
                    </FormDescription>
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
                      defaultValue={field.value}
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
                    <FormDescription>
                      Choisissez le sexe du bénéficiaire.
                    </FormDescription>
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
                      <Input
                        placeholder="Numéro de CIN"
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
                name="telephone"
                render={({ field }) => (
                  <FormItem className="col-span-1">
                    <FormLabel>Téléphone</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Numéro de téléphone"
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
                name="province"
                render={({ field }) => (
                  <FormItem className="col-span-1">
                    <FormLabel>Province</FormLabel>
                    <Select
                      onValueChange={(value) =>
                        field.onChange({ id: parseInt(value, 10) })
                      }
                      value={field.value.id.toString()}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Sélectionnez une province" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {province?.map((p) => (
                          <SelectItem key={p?.id} value={p?.id?.toString() || ""}>
                            {p.name}
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
                name="commune"
                render={({ field }) => (
                  <FormItem className="col-span-1">
                    <FormLabel>Commune</FormLabel>
                    <Select
                      onValueChange={(value) =>
                        field.onChange({ id: parseInt(value, 10) })
                      }
                      value={field.value.id.toString()}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Sélectionnez une commune" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {communes?.map((c: any) => (
                          <SelectItem
                            key={c.id}
                            value={c?.id?.toString() || ""}
                          >
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full">
              Ajouter le bénéficiaire
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
