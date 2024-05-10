import { useState } from "react";

const AddServerForm = () => {
  const [serverName, setServerName] = useState("");
  const [environments, setEnvironments] = useState([]);
  const [newEnvironment, setNewEnvironment] = useState({
    name: "",
    user: "",
    server: "",
    path: "",
  });
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    name: "",
    commands: [],
  });

  const handleEnvironmentChange = (e) => {
    const { name, value } = e.target;
    setNewEnvironment((prevEnvironment) => ({
      ...prevEnvironment,
      [name]: value,
    }));
  };

  const handleAddEnvironment = () => {
    if (
      newEnvironment.name &&
      newEnvironment.user &&
      newEnvironment.server &&
      newEnvironment.path
    ) {
      setEnvironments([...environments, newEnvironment]);
      setNewEnvironment({ name: "", user: "", server: "", path: "" });
    }
  };

  const handleTaskChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  const handleAddCommand = () => {
    if (newTask.name && newTask.commands.length > 0) {
      setTasks([...tasks, newTask]);
      setNewTask({ name: "", commands: [] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = {
        name: serverName,
        environments: environments,
        tasks: tasks,
      };

      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      };

      fetch("/api/servers", requestOptions)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          // Handle successful response
          console.log(data);
        })
        .catch((error) => {
          // Handle error
          console.error("Error:", error);
        });

      // Clear form inputs after successful submission
      setServerName("");
      setEnvironments([]);
      setNewEnvironment({ name: "", user: "", server: "", path: "" });
      setTasks([]);
      setNewTask({ name: "", commands: [] });
    } catch (error) {
      console.error("Error creating server:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="mb-4">
        <label
          htmlFor="serverName"
          className="block text-sm font-semibold mb-2"
        >
          Server Name
        </label>
        <input
          type="text"
          id="serverName"
          name="serverName"
          value={serverName}
          onChange={(e) => setServerName(e.target.value)}
          className="border border-gray-300 rounded px-3 py-1 w-full"
          required
        />
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Environments</h2>
        {environments.map((environment, index) => (
          <div key={index} className="mb-4">
            <p>Name: {environment.name}</p>
            <p>User: {environment.user}</p>
            <p>Server: {environment.server}</p>
            <p>Path: {environment.path}</p>
          </div>
        ))}
        <div className="grid grid-cols-4 gap-4">
          <input
            type="text"
            name="name"
            value={newEnvironment.name}
            onChange={handleEnvironmentChange}
            placeholder="Environment Name"
            className="border border-gray-300 rounded px-3 py-1"
          />
          <input
            type="text"
            name="user"
            value={newEnvironment.user}
            onChange={handleEnvironmentChange}
            placeholder="User"
            className="border border-gray-300 rounded px-3 py-1"
          />
          <input
            type="text"
            name="server"
            value={newEnvironment.server}
            onChange={handleEnvironmentChange}
            placeholder="Server"
            className="border border-gray-300 rounded px-3 py-1"
          />
          <input
            type="text"
            name="path"
            value={newEnvironment.path}
            onChange={handleEnvironmentChange}
            placeholder="Path"
            className="border border-gray-300 rounded px-3 py-1"
          />
        </div>
        <button
          type="button"
          onClick={handleAddEnvironment}
          className="px-3 py-1 bg-blue-500 text-white rounded mt-4"
        >
          Add Environment
        </button>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Tasks</h2>
        {tasks.map((task, index) => (
          <div key={index} className="mb-4">
            <p>Name: {task.name}</p>
            <p>Commands: {task.commands.join(", ")}</p>
          </div>
        ))}
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            value={newTask.name}
            onChange={handleTaskChange}
            placeholder="Task Name"
            className="border border-gray-300 rounded px-3 py-1"
          />
          <textarea
            name="commands"
            value={newTask.commands.join("\n")}
            onChange={(e) =>
              setNewTask({ ...newTask, commands: e.target.value.split("\n") })
            }
            placeholder="Enter commands (one per line)"
            className="border border-gray-300 rounded px-3 py-1 h-20"
          />
        </div>
        <button
          type="button"
          onClick={handleAddCommand}
          className="px-3 py-1 bg-blue-500 text-white rounded mt-4"
        >
          Add Task
        </button>
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-green-500 text-white rounded"
      >
        Submit
      </button>
    </form>
  );
};

export default AddServerForm;
