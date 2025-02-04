import { SuiviePage } from "@/components/suivie-table";

export default function Page({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto pb-10">
      <SuiviePage benef={Number(params.id)} />
    </div>
  );
}