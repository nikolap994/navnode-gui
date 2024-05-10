import { useState } from "react";
import { IoIosInformationCircleOutline } from "react-icons/io";
import Link from "next/link";

const DeploymentPage = ({ data }) => {
  const [taskVisibility, setTaskVisibility] = useState({});
  const [showTerminal, setShowTerminal] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEnvironment, setSelectedEnvironment] = useState(null);

  const handleToggleCodeBlock = (taskKey) => {
    setTaskVisibility((prevVisibility) => ({
      ...prevVisibility,
      [taskKey]: !prevVisibility[taskKey],
    }));
  };

  const handleTaskAction = async (envName, taskName) => {
    setIsLoading(true);
    setShowTerminal(true);

    try {
      const response = await fetch("/api/deploymentAction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ environment: envName, action: taskName }),
      });
      if (!response.ok) {
        throw new Error("Failed to execute action");
      }
      const { message } = await response.json();
      setTerminalOutput(message);
    } catch (error) {
      console.error("Error executing action:", error);
      setTerminalOutput("Error executing action. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const closeTerminal = () => {
    setShowTerminal(false);
    setTerminalOutput("");
  };

  if (!data) {
    return <div>Loading...</div>;
  }

  const { name, environments, tasks } = data;

  const handleEnvironmentChange = (envName) => {
    setSelectedEnvironment(envName);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="ml-0 flex justify-between items-center">
        <h1 className="text-3xl font-bold mb-4">
          Deployment Configurations for <strong>{name}</strong>
        </h1>
        <div className="text-xl font-semibold">
          <Link href="/server/" className="text-blue-600 hover:underline">
            Back
          </Link>
        </div>
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold">Environments</h2>
        <div className="mt-2">
          {Object.entries(environments).map(([envKey, environment]) => (
            <div key={envKey} className="mb-2">
              <input
                type="radio"
                id={envKey}
                name="environments"
                value={environment.name}
                checked={selectedEnvironment === environment.name}
                onChange={() => handleEnvironmentChange(environment.name)}
              />
              <label htmlFor={envKey} className="ml-2">
                {environment.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      {selectedEnvironment && (
        <div>
          <h2 className="text-xl font-semibold">
            Tasks for {selectedEnvironment}
          </h2>
          <ul className="mt-4 ml-4 list-none">
            {Object.entries(tasks).map(([taskKey, taskInfo]) => (
              <li key={taskKey} className="mb-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">
                    {taskInfo.name}
                    <IoIosInformationCircleOutline
                      className="ml-2 cursor-pointer text-blue-500 inline-block"
                      onClick={() => handleToggleCodeBlock(taskKey)}
                    />
                  </h4>
                  <button
                    className="px-3 py-1 bg-blue-500 text-white rounded"
                    onClick={() =>
                      handleTaskAction(selectedEnvironment, taskInfo.name)
                    }
                    disabled={isLoading}
                  >
                    Run
                  </button>
                </div>
                {taskVisibility[taskKey] && (
                  <div className="mt-2">
                    <pre className="p-2 bg-gray-900 text-white rounded-md">
                      {taskInfo.commands.map((command, index) => (
                        <div key={index}>
                          <code>{command}</code>
                        </div>
                      ))}
                    </pre>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {showTerminal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-75">
          <div className="bg-gray-900 w-96 p-4 rounded-md">
            {isLoading ? (
              <p className="text-white">Executing...</p>
            ) : (
              <pre className="text-white whitespace-pre-wrap">
                {terminalOutput}
              </pre>
            )}
            <button
              className="mt-4 px-3 py-1 bg-blue-500 text-white rounded"
              onClick={closeTerminal}
              disabled={isLoading}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export async function getServerSideProps({ params }) {
  console.log(params);
  const { serverid } = params;

  try {
    const response = await fetch(
      process.env.SITE_URI + `/api/servers?_id=${serverid}`
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

export default DeploymentPage;
