import { useState } from "react";
import Link from "next/link";
import WebhookForm from "@/components/WebhookForm";
import WebhookTable from "@/components/WebhookTable";
import { getSession } from "next-auth/react";

const WebhookListPage = ({ server, webhooks, SITE_URI }) => {
  const [webhookList, setWebhookList] = useState(webhooks);

  const handleDelete = async (webhookId) => {
    try {
      const response = await fetch(`/api/webhooks?_id=${webhookId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete webhook");
      }

      setWebhookList(
        webhookList.filter((webhook) => webhook._id !== webhookId)
      );
    } catch (error) {
      console.error("Error deleting webhook:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="ml-0 flex justify-between items-center">
        <h1 className="text-3xl font-bold mb-4">Webhooks for {server.name}</h1>
        <div className="text-xl font-semibold">
          <Link href="/" className="text-blue-600 hover:underline">
            Back
          </Link>
        </div>
      </div>
      <WebhookTable
        webhooks={webhookList}
        server={server}
        SITE_URI={SITE_URI}
        onDelete={handleDelete}
      />
      <div className="mt-8">
        <WebhookForm server={server} />
      </div>
    </div>
  );
};

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const { params } = context;
  const { serverid } = params;

  try {
    const [serverResponse, webhooksResponse] = await Promise.all([
      fetch(`${process.env.SITE_URI}/api/servers?_id=${serverid}`),
      fetch(`${process.env.SITE_URI}/api/webhooks?_serverId=${serverid}`),
    ]);

    if (!serverResponse.ok || !webhooksResponse.ok) {
      throw new Error("Failed to fetch data");
    }

    const serverJson = await serverResponse.json();
    const webhooksJson = await webhooksResponse.json();

    return {
      props: {
        server: serverJson.data,
        webhooks: webhooksJson.data,
        SITE_URI: process.env.SITE_URI,
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      props: {
        server: null,
        webhooks: [],
      },
    };
  }
}

export default WebhookListPage;
