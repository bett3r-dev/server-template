import { createLibraries } from "./libraries";
import { createModules } from "./modules";
import { ServerInitEmitter } from "./types";

export * from './types';

export const create = (serverInitEmitter?: ServerInitEmitter, serverReadyModulesRequired: string[] = []) => {
  let serverReady = false;
  if (serverReadyModulesRequired.length){
    const moduleInitted: Set<string> = new Set();
    const alertTimeout = setTimeout(() => {
      // istanbul ignore next
      console.log('We are still waiting for the server to be ready, the missing modules are:', serverReadyModulesRequired.filter((name) => !moduleInitted.has(name)));
    }, 10000); // 10 seconds
    serverInitEmitter?.on('moduleInitted', (name) => {
      moduleInitted.add(name);
      if (!serverReady && serverReadyModulesRequired.every((name) => moduleInitted.has(name))){
        clearTimeout(alertTimeout);
        serverReady = true;
        serverInitEmitter.emit('serverReady');
      }
    })
  }
  return {
    createLibraries: createLibraries(serverInitEmitter as ServerInitEmitter),
    createModules: createModules(serverInitEmitter as ServerInitEmitter),
  }
}
