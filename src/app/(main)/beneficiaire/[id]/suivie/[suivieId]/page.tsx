import { AddSuiviePage } from "@/components/app-suivie-add-page";
import { useParams } from "next/navigation";
export default function UpdateSuiviePage({ param }: { param: { id: number } }) {
  const params = useParams(); 
  const suivieId = params?.id ? Number(params.id) : null;

  return (
    <div className="container mx-auto py-10">
      <AddSuiviePage isUpdate={!!suivieId} suivieId={suivieId} beneficiaireId={Number(param.id)}/>
    </div>
  );
}