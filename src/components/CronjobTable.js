import Link from "next/link";

const CronjobTable = ({ cronjobs, server, onDelete }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full bg-white border border-gray-300">
      <thead className="bg-gray-200">
        <tr>
          <th className="py-2 px-4 border-b text-center">Schedule</th>
          <th className="py-2 px-4 border-b text-center">Environment</th>
          <th className="py-2 px-4 border-b text-center">Task</th>
          <th className="py-2 px-4 border-b text-center">URI</th>
        </tr>
      </thead>
      <tbody>
        {cronjobs.map((cronjob) => {
          const environment = server.environments.find(
            (env) => env._id === cronjob.environment_id
          );
          const task = server.tasks.find(
            (task) => task._id === cronjob.task_id
          );
          return (
            <tr key={cronjob._id} className="even:bg-gray-100">
              <td className="py-2 px-4 border-b text-center">
                {cronjob.schedule}
              </td>
              <td className="py-2 px-4 border-b text-center">
                {environment?.name || "N/A"}
              </td>
              <td className="py-2 px-4 border-b text-center">
                {task?.name || "N/A"}
              </td>
              <td className="py-2 px-4 border-b text-center">
                <button
                  onClick={() => onDelete(cronjob._id)}
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

module.exports = CronjobTable;
