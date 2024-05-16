import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { getSession } from "next-auth/react";

const EditServerPage = ({ data }) => {
  const [serverName, setServerName] = useState(data.name);
  const [environments, setEnvironments] = useState(data.environments);
  const [tasks, setTasks] = useState(data.tasks);
  const router = useRouter();

  const handleEnvironmentChange = (index, field, value) => {
    const updatedEnvironments = [...environments];
    updatedEnvironments[index][field] = value;
    setEnvironments(updatedEnvironments);
  };

  const handleAddEnvironment = () => {
    const newEnvironment = { name: "", user: "", server: "", path: "" };
    setEnvironments([...environments, newEnvironment]);
  };

  const handleRemoveEnvironment = (index) => {
    const updatedEnvironments = [...environments];
    updatedEnvironments.splice(index, 1);
    setEnvironments(updatedEnvironments);
  };

  const handleTaskChange = (index, field, value) => {
    const updatedTasks = [...tasks];
    updatedTasks[index][field] = value;
    setTasks(updatedTasks);
  };

  const handleAddTask = () => {
    const newTask = { name: "", commands: [] };
    setTasks([...tasks, newTask]);
  };

  const handleRemoveTask = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const updatedData = {
        ...data,
        name: serverName,
        environments: environments,
        tasks: tasks,
      };

      const requestOptions = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      };

      const response = await fetch(
        `/api/servers?_id=${data._id}`,
        requestOptions
      );

      if (!response.ok) {
        throw new Error("Failed to update server");
      }

      router.push(`/server/edit/${data._id}`);
    } catch (error) {
      console.error("Error updating server:", error);
    }
  };

  return (
    <div className="p-4">
      <div className="ml-0 flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-4">Edit Server: {data.name}</h1>
        <div className="text-xl font-semibold">
          <Link href="/" className="text-blue-600 hover:underline">
            Back
          </Link>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="mb-4">
          <label className="block text-sm font-bold">Server Name:</label>
          <input
            type="text"
            value={serverName}
            onChange={(e) => setServerName(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <h2 className="text-lg font-bold mb-2">Environments:</h2>
          {environments.map((env, index) => (
            <div key={index} className="flex space-x-2 mb-2">
              <input
                type="text"
                value={env.name}
                onChange={(e) =>
                  handleEnvironmentChange(index, "name", e.target.value)
                }
                className="border border-gray-300 rounded px-3 py-2 w-1/4 focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                value={env.user}
                onChange={(e) =>
                  handleEnvironmentChange(index, "user", e.target.value)
                }
                className="border border-gray-300 rounded px-3 py-2 w-1/4 focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                value={env.server}
                onChange={(e) =>
                  handleEnvironmentChange(index, "server", e.target.value)
                }
                className="border border-gray-300 rounded px-3 py-2 w-1/4 focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                value={env.path}
                onChange={(e) =>
                  handleEnvironmentChange(index, "path", e.target.value)
                }
                className="border border-gray-300 rounded px-3 py-2 w-1/4 focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => handleRemoveEnvironment(index)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddEnvironment}
            className="bg-blue-500 text-white px-2 py-1 rounded"
          >
            Add Environment
          </button>
        </div>
        <div>
          <h2 className="text-lg font-bold mb-2">Tasks:</h2>
          {tasks.map((task, index) => (
            <div key={index} className="flex space-x-2 mb-2">
              <input
                type="text"
                value={task.name}
                onChange={(e) =>
                  handleTaskChange(index, "name", e.target.value)
                }
                className="border border-gray-300 rounded px-3 py-2 w-3/4 focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                value={task.commands.join(",")}
                onChange={(e) =>
                  handleTaskChange(index, "commands", e.target.value.split(","))
                }
                className="border border-gray-300 rounded px-3 py-2 w-1/4 focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => handleRemoveTask(index)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddTask}
            className="bg-blue-500 text-white px-2 py-1 rounded"
          >
            Add Task
          </button>
        </div>
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Update Server
        </button>
      </form>
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
    const response = await fetch(
      `${process.env.SITE_URI}/api/servers?_id=${serverid}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch server data");
    }

    const responseJson = await response.json();
    const data = responseJson.data;

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
