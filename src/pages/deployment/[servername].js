import { useState } from "react";
import { useRouter } from "next/router";
import { IoIosInformationCircleOutline } from "react-icons/io";

const DeploymentPage = ({ deploymentConfig }) => {
  const router = useRouter();
  const { servername } = router.query;

  const [taskVisibility, setTaskVisibility] = useState({});
  const [terminalOutput, setTerminalOutput] = useState("");
  const [showTerminal, setShowTerminal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleCodeBlock = (taskKey) => {
    setTaskVisibility((prevVisibility) => ({
      ...prevVisibility,
      [taskKey]: !prevVisibility[taskKey],
    }));
  };

  const handleTaskAction = async (taskKey) => {
    setIsLoading(true);
    setShowTerminal(true);

    try {
      const response = await fetch("/api/deploymentAction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: taskKey }),
      });
      if (response.ok) {
        const data = await response.json();
        setTerminalOutput(data.message);
      } else {
        throw new Error("Failed to execute action");
      }
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

  if (!deploymentConfig) {
    return <div>Loading...</div>;
  }

  const { environments, tasks } = deploymentConfig;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">
        Deployment Configurations for <strong>{servername}</strong>
      </h1>

      {Object.entries(environments).map(([envKey, environment]) => (
        <div key={envKey} className="mb-8">
          <h2 className="text-xl font-semibold capitalize underline">
            {envKey}
          </h2>
          <p className="italic">User: {environment.user}</p>
          <p className="italic">Server: {environment.server}</p>
          <p className="italic">Path: {environment.path}</p>

          <div className="mt-4">
            <h3 className="text-lg font-semibold">Tasks</h3>
            <ul className="ml-4 list-none">
              {Object.entries(tasks).map(([taskKey, taskInfo]) => (
                <li key={taskKey} className="mb-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">
                      {taskKey}{" "}
                      <IoIosInformationCircleOutline
                        className="cursor-pointer text-blue-500 inline-block"
                        onClick={() => handleToggleCodeBlock(taskKey)}
                      />
                    </h4>
                    <button
                      className="px-3 py-1 bg-blue-500 text-white rounded"
                      onClick={() => handleTaskAction(taskKey)}
                      disabled={isLoading}
                    >
                      {isLoading ? "Loading..." : "Run Action"}
                    </button>
                  </div>
                  {taskVisibility[taskKey] && (
                    <div className="mt-2">
                      <pre className="p-2 bg-gray-900 text-white rounded-md">
                        {taskInfo.task.map((command, index) => (
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
        </div>
      ))}

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

export async function getServerSideProps(context) {
  const { servername } = context.params;

  try {
    const deploymentModule = require(`../../../config/${servername}/navnode-deployment`);
    const { environments, tasks } = deploymentModule;

    return {
      props: {
        deploymentConfig: { environments, tasks },
      },
    };
  } catch (error) {
    console.error("Failed to load deployment configuration:", error);
    return {
      props: {
        deploymentConfig: null,
      },
    };
  }
}

export default DeploymentPage;
