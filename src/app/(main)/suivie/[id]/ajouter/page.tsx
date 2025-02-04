import { AddSuiviePage } from "@/components/app-suivie-add-page";

export default function Page({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto py-10">
      <AddSuiviePage benef={Number(params.id)} />
    </div>
  );
}