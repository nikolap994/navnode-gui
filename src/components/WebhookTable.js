import Link from "next/link";

const WebhookTable = ({ webhooks, server, SITE_URI, onDelete }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full bg-white border border-gray-300">
      <thead className="bg-gray-200">
        <tr>
          <th className="py-2 px-4 border-b text-center">Name</th>
          <th className="py-2 px-4 border-b text-center">Environment</th>
          <th className="py-2 px-4 border-b text-center">Task</th>
          <th className="py-2 px-4 border-b text-center">URI</th>
          <th className="py-2 px-4 border-b text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        {webhooks.map((webhook) => {
          const environment = server.environments.find(
            (env) => env._id === webhook.environment_id
          );
          const task = server.tasks.find(
            (task) => task._id === webhook.task_id
          );
          return (
            <tr key={webhook._id} className="even:bg-gray-100">
              <td className="py-2 px-4 border-b text-center">{webhook.name}</td>
              <td className="py-2 px-4 border-b text-center">
                {environment?.name || "N/A"}
              </td>
              <td className="py-2 px-4 border-b text-center">
                {task?.name || "N/A"}
              </td>
              <td className="py-2 px-4 border-b text-center hover:underline">
                <Link
                  href={`${SITE_URI}webhookAction?_id=${webhook._id}`}
                >{`${SITE_URI}webhookAction?_id=${webhook._id}`}</Link>
              </td>
              <td className="py-2 px-4 border-b text-center">
                <button
                  onClick={() => onDelete(webhook._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

module.exports = WebhookTable;
