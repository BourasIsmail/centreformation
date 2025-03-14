"use client"

import { AddFacture } from "@/components/add-centrefacture";
import { useParams } from "next/navigation";
export default function UpdateFacturePage() {
  const params = useParams();
  const factureId = params?.id ? Number(params.id) : null;
  const centreId = Number(params.id);

  return (
    <div className="container mx-auto py-10">
      <AddFacture isUpdate={!!factureId} factureId={factureId} centreId={centreId}/>
    </div>
  );
}