import { AddFacture } from "@/components/add-centrefacture";

export default function FacturePage({ param }: { param: { id: number } }) {
    return (
        <div className="container mx-auto py-10">
            <AddFacture isUpdate={false} factureId={null} centre={Number(param.id)}/>
        </div>
    )
}