"use client";
import { FacturePage } from "@/components/app-centrefacture";
import { useParams } from "next/navigation";

export default function Page() {
    const params = useParams(); // Get dynamic route parameters
  
    if (!params?.id) {
      return <div>Error: Centre ID is missing</div>;
    }
  
    return (
      <div className="container mx-auto pb-10">
        <FacturePage centre={Number(params.id)} />
      </div>
    );
  }