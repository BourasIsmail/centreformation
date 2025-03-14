"use client";

import { AddSuiviePage } from "@/components/app-suivie-add-page";
import { useParams } from "next/navigation";

export default function UpdateSuiviePage() {
  const params = useParams(); 
  const beneficiaireId = params?.id ? String(params.id) : null;
  const suivieId = params?.suivieId ? String(params.suivieId) : null;

  return (
    <div className="container mx-auto py-10">
      <AddSuiviePage isUpdate={!!suivieId} beneficiaireId={beneficiaireId} suivieId={suivieId} />
    </div>
  );
}