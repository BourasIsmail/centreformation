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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "react-query";
import { getAllProvinces } from "@/app/api/province";
import { getCommuneByProvince } from "@/app/api/commune";
import { api } from "@/app/api";
import { getCurrentUser } from "@/app/api/index";
import { UserInfo } from "@/app/type/UserInfo";
import { getActiviteByCentre, getactiviteById } from "@/app/api/Activite";
import { getCentreByProvince, getCentres } from "@/app/api/centre";
import { getFilieresByTypeActivite } from "@/app/api/Filiere";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Le nom doit contenir au moins 2 caractères.",
  }),
  roles: z.string().refine((value) => ["SUPER_ADMIN_ROLES", "ADMIN_ROLES"].includes(value), {
    message: "Veuillez sélectionner un role.",
    }),
    email: z.string().email({
        message: "Veuillez entrer une adresse email valide.",
        }),
    password: z.string().min(6, {
        message: "Le mot de passe doit contenir au moins 6 caractères.",
        }),
  province: z.object({ id: z.number() }).refine((value) => value.id > 0, {
    message: "Veuillez sélectionner une province.",
  }),
  
});
interface AddUserProps {
  isUpdate?: boolean;
  userId?: number | null;
}
export function AddUserFormComponent({ isUpdate = false, userId = null }: AddUserProps) {
  const router = useRouter();
  const { toast } = useToast();
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
    name: "",
    roles: "",
    email: "",
    password: "",
      
    province: { id: 0 },
      
    },
  });
  useEffect(() => {
        
    if (isUpdate && userId) {
      // Fetch the existing centre data and populate the form
      const fetchUserData = async () => {
        const response = await api.get(`auth/getUser/${userId}`);
        Object.keys(response.data).forEach((key) => {
          form.setValue(key as any, response.data[key]);
        });
      };
      fetchUserData();
    }
  }, [isUpdate, userId, form]);
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (isUpdate && userId) {
              await api.put(`auth/updateUser/${userId}`, values);
              toast({
                description: "L'utilisateur a été mis à jour avec succès.",
                className: "bg-green-500 text-white",
                duration: 3000,
                title: "Succès",
              });
            } else {
              await api.post(`/auth/addUser`, values);
              toast({
                description: "L'utilisateur' a été ajouté avec succès.",
                className: "bg-green-500 text-white",
                duration: 3000,
                title: "Succès",
              });
            }
      router.push("/users");
    } catch (error) {
      console.error("Erreur:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout de utilisateur.",
        duration: 3000,
        className: "bg-red-500 text-white",
      });
    }
  }

  useEffect(() => {
      if (user?.province && user?.roles === "ADMIN_ROLES") {
        if (user?.province?.id) {
          form.setValue("province", { id: user.province.id }); // Set province value in the form
        }
      }else{
        form.setValue("province", { id: 0 });
      }
    }, [user, form]);
    const { data: provinces } = useQuery({
      queryKey: "provinces",
      queryFn: getAllProvinces,
    });

  
    
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
      <CardTitle>{isUpdate ? "Mettre à jour l'utilisateur" : "Ajouter un nouveau utilisateur"}</CardTitle>
          <CardDescription>
            Remplissez le formulaire pour {isUpdate ? "mettre à jour l'utilisateur" : "ajouter un nouveau utilisateur"}.
          </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="col-span-1">
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nom de l'utilisateur"
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
                    name="email"
                    render={({ field }) => (
                    <FormItem className="col-span-1">
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                        <Input
                            placeholder="Email de l'utilisateur"
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
                    name="password"
                    render={({ field }) => (
                    <FormItem className="col-span-1">
                        <FormLabel>Mot de passe</FormLabel>
                        <FormControl>
                        <Input
                            type="password"
                            placeholder="Mot de passe"
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
  name="roles"
  render={({ field }) => (
    <FormItem className="col-span-1">
      <FormLabel>Role</FormLabel>
      <Select
        onValueChange={field.onChange}
        value={field.value ?? ""} // Ensure value is never undefined
      >
        <FormControl>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sélectionnez le role" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          <SelectItem value="SUPER_ADMIN_ROLES">Super Admin</SelectItem>
          <SelectItem value="ADMIN_ROLES">Admin</SelectItem>
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
                                  
                                   
              
            </div>
            <Button type="submit">{isUpdate ? "Mettre à jour l'utilisateur" : "Ajouter l'utilisateur"}</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
