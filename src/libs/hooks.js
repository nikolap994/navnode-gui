const hooks = {
  beforeDeploy: [],
  afterDeploy: [],
};

export const registerHook = (hookName, fn) => {
  if (!hooks[hookName]) {
    throw new Error(`Unknown hook: ${hookName}`);
  }
  hooks[hookName].push(fn);
};

export const executeHooks = async (hookName, ...args) => {
  if (!hooks[hookName]) {
    throw new Error(`Unknown hook: ${hookName}`);
  }
  for (const fn of hooks[hookName]) {
    await fn(...args);
  }
};
