"use client"; // ✅ Make sure this is at the top


import { AddUserFormComponent} from "@/components/add-user";
import { useParams } from "next/navigation";

export default function UpdateUserPage() {
  const params = useParams(); 
  const userId = params?.id ? Number(params.id) : null;

  return (
    <div className="container mx-auto py-10">
      <AddUserFormComponent isUpdate={!!userId} userId={userId} />
    </div>
  );
}
