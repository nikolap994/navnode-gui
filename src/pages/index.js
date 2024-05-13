import Link from "next/link";
import Router from "next/router";

const ServersPage = ({ serverNames, serverIds, SITE_URI }) => {
  const handleDelete = (serverName, serverId) => {
    if (confirm(`Do you want to delete ${serverName} ?`) == true) {
      const raw = JSON.stringify({
        id: serverId,
      });
      const myHeaders = new Headers();

      myHeaders.append("Content-Type", "application/json");

      const requestOptions = {
        method: "DELETE",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      fetch(SITE_URI + "/api/servers", requestOptions)
        .then((response) => response.json())
        .then((result) => {
          if (result.data === "deleted") {
            Router.push("/");
          }
        })
        .catch((error) => console.log("error", error));
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="ml-0 flex justify-between items-center">
        <h1 className="text-3xl font-bold mb-4">Servers</h1>
        <div className="text-xl font-semibold">
          <Link href="/server/create" className="text-blue-600 hover:underline">
            Create new
          </Link>
        </div>
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {serverNames.map((serverName, index) => (
            <tr key={serverName}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                <Link
                  className="text-blue-600 hover:underline mr-4"
                  href={`/server/${serverIds[index]}`}
                >
                  {serverName}
                </Link>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <Link
                  className="text-blue-600 hover:underline mr-4"
                  href={`/server/${serverIds[index]}`}
                >
                  View
                </Link>
                <Link
                  className="text-blue-600 hover:underline mr-4"
                  href={`/server/edit/${serverIds[index]}`}
                >
                  Edit
                </Link>
                <Link
                  className="text-blue-600 hover:underline mr-4"
                  href={`/server/webhook/${serverIds[index]}`}
                >
                  Webhook
                </Link>
                <button
                  className="text-red-600 hover:underline"
                  onClick={() => handleDelete(serverName, serverIds[index])}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export async function getStaticProps() {
  try {
    const response = await fetch(process.env.SITE_URI + "/api/servers");

    if (!response.ok) {
      throw new Error("Failed to fetch server names");
    }

    const responseJson = await response.json();
    const data = responseJson.data;

    const serverNames = data.map((server) => server.name);
    const serverIds = data.map((server) => server._id);

    return {
      props: {
        serverNames,
        serverIds,
        SITE_URI: process.env.SITE_URI,
      },
    };
  } catch (error) {
    return {
      props: {
        serverNames: [],
      },
    };
  }
}

export default ServersPage;
