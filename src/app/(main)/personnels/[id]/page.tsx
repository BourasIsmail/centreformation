"use client";
import { useParams } from "next/navigation";
import { AddPersonnel } from "@/components/app-personnel-ajouter-page";

export default function UpdatePersonnelPage() {
  const params = useParams(); 
  const personnelId = params?.id ? Number(params.id) : null;

  return (
    <div className="container mx-auto py-10">
      <AddPersonnel isUpdate={!!personnelId} personnelId={personnelId} />
    </div>
  );
}