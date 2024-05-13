import { useState } from "react";
import {
  IoIosInformationCircleOutline,
  IoMdCloseCircleOutline,
} from "react-icons/io";
import Link from "next/link";

const DeploymentPage = ({ data }) => {
  const [taskVisibility, setTaskVisibility] = useState({});
  const [showTerminal, setShowTerminal] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEnvironment, setSelectedEnvironment] = useState(null);
  const [selectedEnvironmentId, setSelectedEnvironmentId] = useState(null);
  const [environmentInfoVisible, setEnvironmentInfoVisible] = useState(false); // New state

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

  const toggleEnvironmentInfo = () => {
    setEnvironmentInfoVisible(!environmentInfoVisible);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="ml-0 flex justify-between items-center">
        <h1 className="text-3xl font-bold mb-4">
          Deployment Configurations for <strong>{name}</strong>
        </h1>
        <div className="text-xl font-semibold">
          <Link href="/" className="text-blue-600 hover:underline">
            Back
          </Link>
        </div>
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold">Environments</h2>
        <div className="mt-2">
          {Object.entries(environments).map(([envKey, environment]) => (
            <div key={envKey} className="mb-2">
              <div className="flex items-center">
                <input
                  type="radio"
                  id={envKey}
                  name="environments"
                  value={environment.name}
                  checked={selectedEnvironment === environment.name}
                  onChange={() => {
                    handleEnvironmentChange(environment.name);
                    setSelectedEnvironmentId(environment._id);
                  }}
                />
                <label htmlFor={envKey} className="ml-2">
                  {environment.name}
                </label>
                <IoIosInformationCircleOutline
                  className="ml-2 cursor-pointer text-blue-500"
                  onClick={toggleEnvironmentInfo}
                />
              </div>
              {environmentInfoVisible && (
                <div className="mt-2">
                  <ul>
                    <li>
                      <strong>Path:</strong> {environment.path}
                    </li>
                    <li>
                      <strong>Server:</strong> {environment.server}
                    </li>
                    <li>
                      <strong>User:</strong> {environment.user}
                    </li>
                  </ul>
                </div>
              )}
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
                      handleTaskAction(selectedEnvironmentId, taskInfo._id)
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
        <div className="fixed bottom-0 inset-x-0 z-50 bg-gray-900 p-6">
          {isLoading ? (
            <p className="text-white">Executing...</p>
          ) : (
            <pre className="text-white whitespace-pre-wrap h-64 overflow-y-auto">
              {terminalOutput}
            </pre>
          )}
          <IoMdCloseCircleOutline
            className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center bg-red-500 rounded-full text-white"
            onClick={closeTerminal}
            disabled={isLoading}
          ></IoMdCloseCircleOutline>
        </div>
      )}
    </div>
  );
};

export async function getServerSideProps({ params }) {
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
