const environments = {
  staging: {
    user: "root",
    server: "test.com",
    path: "/home/test_repo/public_html/",
  },
  production: {
    user: "root",
    server: "test.staging.com",
    path: "/home/test_repo/public_html/",
  },
};

const tasks = {
  staging_log: {
    task: ["sudo -Hu prod git log -1"],
  },
  production_log: {
    task: ["sudo -Hu staging git log -1"],
  },
  staging_status: {
    task: ["sudo -Hu staging git status"],
  },
  production_status: {
    task: ["sudo -Hu prod git status"],
  },
  staging_deploy: {
    task: [
      "sudo -Hu staging git fetch --tags",
      "sudo -Hu staging git pull",
      "sudo -Hu staging rm -f *.sql *.zip",
      "sudo -Hu staging cp -f .robots.txt.staging robots.txt",
      "sudo -Hu staging rm -rf var/cache/*",
    ],
  },
  production_deploy: {
    task: [
      "sudo -Hu prod git fetch --tags",
      "sudo -Hu prod git pull",
      "sudo -Hu prod rm -f *.sql *.zip",
      "sudo -Hu prod cp -f .robots.txt.production robots.txt",
      "sudo -Hu prod rm -rf var/cache/*",
    ],
  },
};

exports.environments = environments;
exports.tasks = tasks;
