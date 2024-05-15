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

In the **Navnode GUI** application, the `beforeDeployHook` and `afterDeployHook` are custom hooks designed to execute specific actions before and after deployment tasks, respectively. These hooks provide a flexible way to intervene in the deployment process, allowing users to customize server-side actions based on their specific needs.

The `beforeDeployHook` is triggered before a deployment action occurs. This hook can be modified to perform any pre-deployment tasks, such as environment validation, setup checks, or custom preparations needed for the deployment process. Users have the flexibility to define and incorporate their own logic within this hook to ensure that deployments proceed smoothly and efficiently.

Conversely, the `afterDeployHook` is called after a deployment action completes. This hook enables users to execute post-deployment tasks, such as logging deployment results, sending notifications, or performing additional actions based on the outcome of the deployment. Users can tailor this hook to implement specific follow-up procedures that enhance the management and monitoring of deployment activities within the **Navnode GUI** environment.

By leveraging these hooks, developers can extend the functionality of the **Navnode GUI** application, introducing custom behaviors that align with project requirements and operational workflows. This modular approach empowers users to exert fine-grained control over deployment processes and seamlessly integrate server-side actions tailored to their unique use cases and preferences.


## Custom Hooks in Navnode GUI

Custom hooks in the Navnode GUI application are used to execute specific logic before or after certain events, such as deployment actions, cronjob executions, or webhook processing. By centralizing hook definitions and making them dynamic, you can apply custom behavior to various scenarios in your Navnode GUI application.

### Directory Structure

The Navnode GUI project should have a dedicated src/hooks directory where you define and organize different types of hooks. Each hook file can contain specific logic tailored to its purpose.

```css
navnode-gui/
├── src/
│   ├── hooks/
│   │   ├── cronjobHook.js
│   │   ├── deploymentHook.js
│   │   └── webhookHook.js
│   └── ...
└── ...
```
### Extending with Additional Hooks
You can extend this pattern by creating more hook files (cronjobHook.js, webhookHook.js, etc.) within the src/hooks directory and defining custom hooks tailored to specific use cases. The hooks.js module provides a centralized mechanism to manage and execute hooks dynamically based on different events in your Navnode GUI application.

This modular approach allows you to maintain clear separation of concerns, improve code organization, and apply custom logic to various events through dynamic hook registration and execution.

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
