"use client"; // ✅ Make sure this is at the top

import { AddSuiviePage } from "@/components/app-suivie-add-page";
import { useParams } from "next/navigation";

export default function Page() {
    const params = useParams(); 
    const beneficiaireId = params?.id ? Number(params.id) :0;
  return (
    <div className="container mx-auto py-10">
      <AddSuiviePage beneficiaireId={beneficiaireId} />
    </div>
  );
}