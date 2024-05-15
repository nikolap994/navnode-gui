import { useState } from "react";
import Link from "next/link";
import CronjobForm from "@/components/CronjobForm";
import CronjobTable from "@/components/CronjobTable";

const CronjobListPage = ({ server, cronjobs, SITE_URI }) => {
  const [cronjobList, setCronjobList] = useState(cronjobs);

  const handleDelete = async (cronjobId) => {
    try {
      const response = await fetch(`/api/cronjobs?_id=${cronjobId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete cronjob");
      }

      setCronjobList(
        cronjobList.filter((cronjob) => cronjob._id !== cronjobId)
      );
    } catch (error) {
      console.error("Error deleting cronjob:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="ml-0 flex justify-between items-center">
        <h1 className="text-3xl font-bold mb-4">Cronjobs for {server.name}</h1>
        <div className="text-xl font-semibold">
          <Link href="/" className="text-blue-600 hover:underline">
            Back
          </Link>
        </div>
      </div>
      <CronjobTable
        cronjobs={cronjobList}
        server={server}
        onDelete={handleDelete}
      />
      <div className="mt-8">
        <CronjobForm server={server} />
      </div>
    </div>
  );
};

export async function getServerSideProps({ params }) {
  const { serverid } = params;

  try {
    const [serverResponse, cronjobsResponse] = await Promise.all([
      fetch(`${process.env.SITE_URI}/api/servers?_id=${serverid}`),
      fetch(`${process.env.SITE_URI}/api/cronjobs?_serverId=${serverid}`),
    ]);

    if (!serverResponse.ok || !cronjobsResponse.ok) {
      throw new Error("Failed to fetch data");
    }

    const serverJson = await serverResponse.json();
    const cronjobsJson = await cronjobsResponse.json();

    return {
      props: {
        server: serverJson.data,
        cronjobs: cronjobsJson.data,
        SITE_URI: process.env.SITE_URI,
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      props: {
        server: null,
        cronjobs: [],
      },
    };
  }
}

export default CronjobListPage;
