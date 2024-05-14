import { useState } from "react";

const WebhookForm = ({ server }) => {
  const [formData, setFormData] = useState({
    name: "",
    server_id: server._id,
    environment_id: "",
    task_id: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/webhooks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to create webhook");
      }

      window.location.reload();
    } catch (error) {
      console.error("Error creating webhook:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-4 rounded shadow-md"
    >
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Webhook Name:
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label
          htmlFor="environment_id"
          className="block text-sm font-medium text-gray-700"
        >
          Environment:
        </label>
        <select
          id="environment_id"
          name="environment_id"
          value={formData.environment_id}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">Select an environment</option>
          {server.environments.map((env) => (
            <option key={env._id} value={env._id}>
              {env.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label
          htmlFor="task_id"
          className="block text-sm font-medium text-gray-700"
        >
          Task:
        </label>
        <select
          id="task_id"
          name="task_id"
          value={formData.task_id}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">Select a task</option>
          {server.tasks.map((task) => (
            <option key={task._id} value={task._id}>
              {task.name}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="w-full px-4 py-2 bg-indigo-600 text-white font-medium rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Create Webhook
      </button>
    </form>
  );
};

module.exports = WebhookForm;
