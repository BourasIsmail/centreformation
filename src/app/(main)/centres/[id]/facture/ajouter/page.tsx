"use client";
import { AddFacture } from "@/components/add-centrefacture";
import { useParams } from "next/navigation";

export default function FacturePage() {
    const params = useParams();
  
    if (!params?.id) {
      return <div>Error: Centre ID is missing</div>;
    }
  
    return (
      <div className="container mx-auto py-10">
        <AddFacture isUpdate={false} factureId={null} centreId={Number(params.id)} />
      </div>
    );
  }