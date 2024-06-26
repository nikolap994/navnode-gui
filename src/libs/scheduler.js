const cron = require("node-cron");
const database = require("../helper/database");
const Cronjob = require("../models/Cronjob");
const Server = require("../models/Server");
const deploy = require("./navnodeServer");
const { registerHook, executeHooks } = require("../libs/hooksServer");

const activeCronJobs = {};

require("../hooks/cronjobHook");

async function getJobDetails(taskId, environmentId, serverId) {
  try {
    const server = await Server.findById(serverId);
    if (!server) {
      throw new Error(`Server with ID ${serverId} not found.`);
    }

    const environment = server.environments.find(
      (env) => env._id.toString() === environmentId
    );

    if (!environment) {
      throw new Error(`Environment with ID ${environmentId} not found.`);
    }

    const task = server.tasks.find((task) => task._id.toString() === taskId);

    if (!task) {
      throw new Error(
        `Task with ID ${taskId} not found in the specified environment.`
      );
    }

    return {
      serverName: server.name,
      environmentName: environment.name,
      taskName: task.name,
      commands: task.commands,
      environment,
      task,
    };
  } catch (error) {
    console.error("Error fetching job details:", error);
    throw error;
  }
}

async function scheduleJobs() {
  try {
    await database();

    const jobs = await Cronjob.find({});

    jobs.forEach(async (job) => {
      const jobId = job._id.toString();
      const newSchedule = job.schedule;

      if (!activeCronJobs[jobId]) {
        console.log(`Scheduling job ${jobId} with schedule: ${newSchedule}`);

        const jobDetails = await getJobDetails(
          job.task_id.toString(),
          job.environment_id.toString(),
          job.server_id.toString()
        );

        const newTask = cron.schedule(newSchedule, async () => {
          console.log(
            `Executing task ${jobDetails.taskName} for environment ${jobDetails.environmentName} on server ${jobDetails.serverName}`
          );

          try {
            await executeHooks(
              "beforeDeploy",
              jobDetails.environment,
              jobDetails.task
            );

            const deployResponse = await deploy(
              jobDetails.environment,
              jobDetails.commands
            );

            await executeHooks(
              "afterDeploy",
              jobDetails.environment,
              jobDetails.task,
              deployResponse
            );

            console.log(deployResponse);
          } catch (error) {
            console.error("Error deploying:", error);
          }
        });

        activeCronJobs[jobId] = { task: newTask, schedule: newSchedule };
      } else {
        const currentSchedule = activeCronJobs[jobId].schedule;
        if (currentSchedule !== newSchedule) {
          console.log(
            `Rescheduling job ${jobId} with updated schedule: ${newSchedule}`
          );
          activeCronJobs[jobId].task.stop();
          const newTask = cron.schedule(newSchedule, async () => {
            console.log(
              `Executing task ${jobDetails.taskName} for environment ${jobDetails.environmentName} on server ${jobDetails.serverName}`
            );

            try {
              await executeHooks(
                "beforeDeploy",
                jobDetails.environment,
                jobDetails.task
              );

              const deployResponse = await deploy(
                jobDetails.environment,
                jobDetails.commands
              );

              await executeHooks(
                "afterDeploy",
                jobDetails.environment,
                jobDetails.task,
                deployResponse
              );

              console.log(deployResponse);
            } catch (error) {
              console.error("Error deploying:", error);
            }
          });
          activeCronJobs[jobId] = { task: newTask, schedule: newSchedule };
        }
      }
    });

    Object.keys(activeCronJobs).forEach((jobId) => {
      if (!jobs.some((job) => job._id.toString() === jobId)) {
        console.log(`Removing job ${jobId}`);
        activeCronJobs[jobId].task.stop();
        delete activeCronJobs[jobId];
      }
    });
  } catch (error) {
    console.error("Error scheduling jobs:", error);
  }
}

setInterval(scheduleJobs, 30000);

scheduleJobs();
