"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useQuery } from "react-query";

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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Personnel } from "@/app/type/Personnel";
import { getAllProvinces } from "@/app/api/province";
import { getCommuneByProvince } from "@/app/api/commune";
import { Commune } from "@/app/type/Commune";
import { api } from "@/app/api";

const formSchema = z.object({
  nomComplet: z.string().min(2, {
    message: "Le nom complet doit contenir au moins 2 caractères.",
  }),
  grade: z.string().min(1, {
    message: "Veuillez sélectionner un grade.",
  }),
  diplome: z.string().min(1, {
    message: "Veuillez sélectionner un diplôme.",
  }),
  province: z.object({ id: z.number() }).refine((value) => value.id > 0, {
    message: "Veuillez sélectionner une province.",
  }),
  commune: z.object({ id: z.number() }).refine((value) => value.id > 0, {
    message: "Veuillez sélectionner une commune.",
  }),
});

export function AddPersonnel() {
  const router = useRouter();
  const { toast } = useToast();
  const [communes, setCommunes] = useState<Commune[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nomComplet: "",
      grade: "",
      diplome: "",
      province: { id: 0 },
      commune: { id: 0 },
    },
  });

  const { data: provinces } = useQuery("provinces", getAllProvinces);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = api.post(`/personnel`, values).then((res) => {
        console.log(response);
      });
      console.log(values);
      toast({
        title: "Succès",
        description: `${values.nomComplet} a été ajouté avec succès.`,
        className: "bg-green-500 text-white",
        duration: 3000
        
      });
      router.push("/personnels");
    } catch (error) {
      console.error("Erreur:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout du personnel.",
        variant: "destructive",
      });
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Ajouter un Personnel</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="nomComplet"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom Complet</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nom complet du personnel"
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
                name="grade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grade</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Sélectionnez un grade" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="grade1">Grade 1</SelectItem>
                        <SelectItem value="grade2">Grade 2</SelectItem>
                        <SelectItem value="grade3">Grade 3</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="diplome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Diplôme</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Sélectionnez un diplôme" />
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
              <FormField
                control={form.control}
                name="province"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Province</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange({ id: parseInt(value, 10) });
                        getCommuneByProvince(parseInt(value, 10)).then(
                          setCommunes
                        );
                      }}
                      value={field.value.id.toString()}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Sélectionnez une province" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {provinces?.map((province) => (
                          <SelectItem
                            key={province.id}
                            value={province?.id?.toString() || ""}
                          >
                            {province.name}
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
                  <FormItem>
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
                        {communes.map((commune) => (
                          <SelectItem
                            key={commune.id}
                            value={commune?.id?.toString() || ""}
                          >
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
            <Button type="submit" className="w-full">
              Ajouter le personnel
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
