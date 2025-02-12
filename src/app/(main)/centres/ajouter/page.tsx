import { AddCentre } from "@/components/add-centre";

export default function CentrePage() {
    return (
        <div className="container mx-auto py-10">
            <AddCentre isUpdate={false} centreId={null} />
        </div>
    )
}