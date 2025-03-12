import { useParams } from "next/navigation";
import { AddFacture } from "@/components/add-centrefacture";
export default function UpdateFacturePage({ param }: { param: { id: number } }) {
  const params = useParams(); 
  const factureId = params?.id ? Number(params.id) : null;

  return (
    <div className="container mx-auto py-10">
      <AddFacture isUpdate={!!factureId} factureId={factureId} centreId={Number(param.id)}/>
    </div>
  );
}