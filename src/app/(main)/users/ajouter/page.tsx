import { AddUserFormComponent } from "@/components/add-user";

export default function AddUserPage() {
  return (
    <div className="container mx-auto py-10">
      <AddUserFormComponent isUpdate={false} userId={null}/>
    </div>
  );
}
