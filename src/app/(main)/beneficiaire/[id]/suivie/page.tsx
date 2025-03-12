"use client"; // ✅ Make sure this is at the top

import { SuiviePage } from "@/components/suivie-table";
import { useParams } from "next/navigation";

export default function Page() {
    const params = useParams(); // Get dynamic route parameters
  
    if (!params?.id) {
      return <div>Error: Centre ID is missing</div>;
    }
  
    return (
      <div className="container mx-auto pb-10">
        <SuiviePage beneficiaireId={Number(params.id)} />
      </div>
    );
  }