import AddServerForm from "@/components/AddServerForm";
import Link from "next/link";

const CreateServer = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="ml-0 flex justify-between items-center">
        <h1 className="text-3xl font-bold mb-4">Create new server</h1>
        <div className="text-xl font-semibold">
          <Link href="/server/" className="text-blue-600 hover:underline">
            Back
          </Link>
        </div>
      </div>
      <AddServerForm />
    </div>
  );
};

export default CreateServer;
