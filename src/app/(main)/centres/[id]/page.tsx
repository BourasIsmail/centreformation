"use client"; // ✅ Make sure this is at the top

import { AddCentre } from "@/components/add-centre";
import { useParams } from "next/navigation";

export default function UpdateCentrePage() {
  const params = useParams(); 
  const centreId = params?.id ? Number(params.id) : null;

  return (
    <div className="container mx-auto py-10">
      <AddCentre isUpdate={!!centreId} centreId={centreId} />
    </div>
  );
}
