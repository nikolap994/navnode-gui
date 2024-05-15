const hooks = {
  beforeDeploy: [],
  afterDeploy: [],
};

const registerHook = (hookName, fn) => {
  if (!hooks[hookName]) {
    throw new Error(`Unknown hook: ${hookName}`);
  }
  hooks[hookName].push(fn);
};

const executeHooks = async (hookName, ...args) => {
  if (!hooks[hookName]) {
    throw new Error(`Unknown hook: ${hookName}`);
  }
  for (const fn of hooks[hookName]) {
    await fn(...args);
  }
};

module.exports = {
  registerHook,
  executeHooks,
};
