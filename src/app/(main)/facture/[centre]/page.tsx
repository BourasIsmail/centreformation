import { FacturePage } from "@/components/app-centrefacture";

export default function Page({ centre }: { centre: { id: number } }) {
  return (
    <div className="container mx-auto pb-10">
      <FacturePage centre={Number(centre.id)} />
    </div>
  );
}