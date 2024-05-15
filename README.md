# Navnode GUI

Navnode GUI is a project designed to facilitate running commands on remote servers via webhooks and managing cronjobs. This README.md will guide you through setting up and understanding the project.

## Project Overview

Navnode GUI provides a web interface for managing remote server commands via webhooks. It allows you to configure and trigger commands remotely, and if necessary, set up recurring tasks using cronjobs.

### Features

- **Webhooks**: Configure endpoints to trigger specific commands on remote servers.
- **Cronjobs**: Schedule recurring tasks to automate processes.
- **PM2 Integration**: Use PM2 to manage scheduled processes and view logs.

## Getting Started

To start the project locally, follow these steps:

1. **Clone the Repository**
```bash
git clone https://github.com/nikolap994/navnode-gui.git
cd navnode-gui
```

2. **Install Dependencies**
Ensure you have Node.js and npm installed on your machine. Then, install the project dependencies:
```bash
npm install
```

3. **Set Up Environment Variables**
Create a `.env` file in the root directory of the project with the following content:

```bash
MONGODB_URI="mongodb+srv://<username>:<password>@<hostname>/<database>"
SITE_URI="http://localhost:3000"
```

- Replace `MONGODB_URI` with your MongoDB connection string.
- Replace `SITE_URI` with the URL of your deployed site or development server.

4. **Start the Development Server**
Run the following command to start the development server:
```bash
npm run dev
```

This will start the project on `http://localhost:3000`.

## Cronjobs

Navnode GUI includes functionality to manage cronjobs. You can use PM2 to manage the scheduler process. Here are the available commands:

- **Start the Cronjob Scheduler**
```bash
npm run start-cron-job
```

- **Stop the Cronjob Scheduler**
```bash
npm run stop-cron-job
```
- **Restart the Cronjob Scheduler**
```bash
npm run restart-cron-job
```
- **Display Logs of the Cronjob Scheduler**
```bash
npm run logs-cron-job
```
- **List All PM2-Managed Processes**
```bash
npm run list-processes
```

# Custom Hooks for Remote Commands

Custom hooks allow you to execute specific actions before and after running remote commands in your Navnode GUI project. These hooks are defined in `src/hooks/customHook.js`.

## How to Define Custom Hooks

Custom hooks are defined using the `registerHook` function from `@/libs/hooks`. Here's an example of how you can define before and after hooks:

```javascript
import { registerHook } from "@/libs/hooks";

// Before deploy hook
registerHook("beforeDeploy", async (environment, task) => {
  console.log("Before deploy hook executed");
  console.log({ environment, task });
});

// After deploy hook
registerHook("afterDeploy", async (environment, task, deployResponse) => {
  console.log("After deploy hook executed");
  console.log({ environment, task, deployResponse });
});
```

In the example above:

- The `beforeDeploy` hook is executed before deploying a task.
- The `afterDeploy` hook is executed after deploying a task, providing the deploy response.

## How to Use Custom Hooks
When running a remote command manually from the server, you can integrate these hooks into your workflow. Here's an example of how to use custom hooks with the `executeHooks` function:

```javascript
import { executeHooks } from "@/libs/hooks";
import { deploy } from "@/libs/deploy"; // Assuming this is your deploy function

// Execute "beforeDeploy" hook
await executeHooks("beforeDeploy", foundEnvironment, foundTask);

// Deploy task
const deployResponse = await deploy(foundEnvironment, foundTask.commands);

// Execute "afterDeploy" hook
await executeHooks("afterDeploy", foundEnvironment, foundTask, deployResponse);
```

In this workflow:
- `executeHooks("beforeDeploy", foundEnvironment, foundTask)` triggers the beforeDeploy hook before deploying the task.
- The deployment logic (`deploy`) is executed.
- `executeHooks("afterDeploy", foundEnvironment, foundTask, deployResponse)` riggers the afterDeploy hook after the deployment is completed, passing the deployment response (deployResponse).

Custom hooks provide flexibility to perform additional actions or execute specific tasks before and after remote commands, enhancing the functionality and extensibility of your Navnode GUI project.

### Tech Stack

- **Frontend**: Next.js
- **Backend**: Node.js
- **Database**: MongoDB

### Contributing

Contributions are welcome! Please follow the standard GitHub flow:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/my-feature`).
3. Make your changes.
4. Commit your changes (`git commit -am 'Add new feature'`).
5. Push to the branch (`git push origin feature/my-feature`).
6. Create a new Pull Request.

### License

This project is licensed under the [MIT License](LICENSE).
