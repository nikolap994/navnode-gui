import { useState } from "react";

const CronjobForm = ({ server }) => {
  const [formData, setFormData] = useState({
    schedule: "",
    server_id: server._id,
    environment_id: "",
    task_id: "",
  });
  const [errors, setErrors] = useState({
    schedule: "",
  });
  const [isCustom, setIsCustom] = useState(false);

  const cronRegex =
    /^(\*|([0-5]?\d)) (\*|([01]?\d|2[0-3])) (\*|([01]?\d|2[0-9]|3[01])) (\*|(0?[1-9]|1[0-2])) (\*|([0-6]))$/;

  const validateCron = (schedule) => {
    return cronRegex.test(schedule);
  };

  const handleDropdownChange = (e) => {
    const value = e.target.value;
    if (value === "custom") {
      setIsCustom(true);
      setFormData({ ...formData, schedule: "" });
    } else {
      setIsCustom(false);
      setFormData({ ...formData, schedule: value });
      setErrors({ ...errors, schedule: "" });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "schedule" && isCustom) {
      if (!validateCron(value)) {
        setErrors({ ...errors, schedule: "Invalid cron schedule format" });
      } else {
        setErrors({ ...errors, schedule: "" });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isCustom && !validateCron(formData.schedule)) {
      setErrors({ ...errors, schedule: "Invalid cron schedule format" });
      return;
    }

    try {
      const response = await fetch("/api/cronjobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to create cronjob");
      }

      window.location.reload();
    } catch (error) {
      console.error("Error creating cronjob:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-4 rounded shadow-md"
    >
      <div>
        <label
          htmlFor="scheduleOptions"
          className="block text-sm font-medium text-gray-700"
        >
          Cronjob schedule:
        </label>
        <select
          id="scheduleOptions"
          name="scheduleOptions"
          onChange={handleDropdownChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">Select a schedule</option>
          <option value="* * * * *">Every minute</option>
          <option value="*/5 * * * *">Every 5 minutes</option>
          <option value="*/30 * * * *">Every 30 minutes</option>
          <option value="0 * * * *">Every hour</option>
          <option value="0 */6 * * *">Every 6 hours</option>
          <option value="0 */12 * * *">Every 12 hours</option>
          <option value="0 0 * * *">Every 24 hours</option>
          <option value="custom">Custom</option>
        </select>
      </div>
      {isCustom && (
        <div>
          <label
            htmlFor="schedule"
            className="block text-sm font-medium text-gray-700"
          >
            Custom Cronjob schedule:
          </label>
          <input
            type="text"
            id="schedule"
            name="schedule"
            value={formData.schedule}
            onChange={handleChange}
            required
            className={`mt-1 block w-full px-3 py-2 border ${
              errors.schedule ? "border-red-500" : "border-gray-300"
            } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
          />
          {errors.schedule && (
            <p className="mt-2 text-sm text-red-600">{errors.schedule}</p>
          )}
        </div>
      )}
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
        Create Cronjob
      </button>
    </form>
  );
};

export default CronjobForm;
