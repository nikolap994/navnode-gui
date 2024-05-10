import Link from "next/link";

const EditServerPage = ({ data }) => {
  return (
    <div className="ml-0 flex justify-between items-center">
      <h1 className="text-3xl font-bold mb-4">
        Editing <strong>{data.name}</strong>
      </h1>
      <div className="text-xl font-semibold">
        <Link href="/server/" className="text-blue-600 hover:underline">
          Back
        </Link>
      </div>
    </div>
  );
};

export async function getServerSideProps({ params }) {
  const { serverId } = params;

  try {
    const response = await fetch(
      process.env.SITE_URI + `/api/servers?_id=${encodeURIComponent(serverId)}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch server data");
    }
    const responseJson = await response.json();
    const data = responseJson.data[0];
    return {
      props: {
        data,
      },
    };
  } catch (error) {
    console.error("Error fetching server data:", error);
    return {
      props: {
        data: null,
      },
    };
  }
}

export default EditServerPage;
