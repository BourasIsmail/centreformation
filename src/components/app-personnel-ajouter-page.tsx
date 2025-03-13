"use client";

import { useEffect, useState } from "react";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Personnel } from "@/app/type/Personnel";
import { getAllProvinces } from "@/app/api/province";
import { getCommuneByProvince } from "@/app/api/commune";
import { Commune } from "@/app/type/Commune";
import { api } from "@/app/api";
import { UserInfo } from "@/app/type/UserInfo";
import { getCurrentUser } from "@/app/api/index";

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
interface AddPersonnelProps {
  isUpdate?: boolean;
  personnelId?: number | null;
}
export function AddPersonnel({ isUpdate = false, personnelId = null }: AddPersonnelProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [communeList, setCommuneList] = useState<Commune[]>([]);
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
      nomComplet: "",
      grade: "",
      diplome: "",
      province: { id: 0 },
      commune: { id: 0 },

    },
  });
  useEffect(() => {
      if (user?.province && user?.roles === "ADMIN_ROLES") {
        if (user?.province?.id) {
          form.setValue("province", { id: user.province.id }); // Set province value in the form
        }
      }
    }, [user, form])

    const { data: provinces } = useQuery({
      queryKey: "provinces",
      queryFn: getAllProvinces,
    });

    const provinceId = form.watch("province.id");

    useEffect(() => {
        
        if (isUpdate && personnelId) {
          // Fetch the existing centre data and populate the form
          const fetchPersonnelData = async () => {
            const response = await api.get(`/personnel/${personnelId}`);
            Object.keys(response.data).forEach((key) => {
              form.setValue(key as any, response.data[key]);
            });
          };
          fetchPersonnelData();
        }
      }, [isUpdate, personnelId, form]);
      
    const { data: communes , refetch: refetchCommunes} = useQuery({
        queryKey: ["commune", provinceId],
        queryFn: () => getCommuneByProvince(provinceId),
        enabled: !!provinceId,
      });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (isUpdate && personnelId) {
              await api.put(`/personnel/${personnelId}`, values);
              toast({
                description: "Le personnel a été mis à jour avec succès.",
                className: "bg-green-500 text-white",
                duration: 3000,
                title: "Succès",
              });
            } else {
              await api.post(`/personnel/add`, values);
              toast({
                description: "Le personnel a été ajouté avec succès.",
                className: "bg-green-500 text-white",
                duration: 3000,
                title: "Succès",
              });
            }
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
          <CardTitle>{isUpdate ? "Mettre à jour le personnel" : "Ajouter un nouveau personnel"}</CardTitle>
          <CardDescription>
            Remplissez le formulaire pour {isUpdate ? "mettre à jour le personnel" : "ajouter un nouveau personnel"}.
          </CardDescription>
        </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-2 gap-6">
          {/* Nom Complet */}
          <FormField
            control={form.control}
            name="nomComplet"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom Complet</FormLabel>
                <FormControl>
                  <Input placeholder="Nom complet du personnel" {...field} className="w-full" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Grade */}
          <FormField
            control={form.control}
            name="grade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Grade</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
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

          {/* Diplôme */}
          <FormField
            control={form.control}
            name="diplome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Diplôme</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
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
                                                              const selectedCommune = communes?.find((p) => p.id === Number(value));
                                                              if (selectedCommune) {
                                                                  field.onChange(selectedCommune);
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
  );
}
