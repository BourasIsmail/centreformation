"use client"; // ✅ Make sure this is at the top


import AddActivitePage from "@/components/app-activites-add-page";
import { useParams } from "next/navigation";

export default function UpdateActivitePage() {
  const params = useParams(); 
  const activiteId = params?.id ? Number(params.id) : null;

  return (
    <div className="container mx-auto py-10">
      <AddActivitePage isUpdate={!!activiteId} activiteId={activiteId} />
    </div>
  );
}
