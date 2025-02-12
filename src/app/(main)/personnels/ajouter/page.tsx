import { AddPersonnel } from "@/components/app-personnel-ajouter-page";

export default function Page() {
  return (
    <div className="container mx-auto pb-10">
      <AddPersonnel isUpdate={false} personnelId={null}/>
    </div>
  );
}
