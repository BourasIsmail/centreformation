import { AddBeneficiaireFormComponent } from "@/components/components-beneficiaires-add-beneficiaire-form";

export default function AddBeneficiairePage() {
  return (
    <div className="container mx-auto py-10">
      <AddBeneficiaireFormComponent isUpdate={false} beneficiaireId={null}/>
    </div>
  );
}
