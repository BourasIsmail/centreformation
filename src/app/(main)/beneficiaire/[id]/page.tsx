"use client"; // ✅ Make sure this is at the top


import { AddBeneficiaireFormComponent } from "@/components/components-beneficiaires-add-beneficiaire-form";
import { useParams } from "next/navigation";

export default function UpdateBeneficiairePage() {
  const params = useParams(); 
  const beneficiaireId = params?.id ? Number(params.id) : null;

  return (
    <div className="container mx-auto py-10">
      <AddBeneficiaireFormComponent isUpdate={!!beneficiaireId} beneficiaireId={beneficiaireId} />
    </div>
  );
}
