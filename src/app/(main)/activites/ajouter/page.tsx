import AddActivitePage from "@/components/app-activites-add-page";

export default function Page() {
  return (
    <div className="container mx-auto pb-10">
      <AddActivitePage isUpdate={false} activiteId={null}/>
    </div>
  );
}
