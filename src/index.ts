import { createLibraries } from "./libraries";
import { createModules } from "./modules";
import TypedEmitter from 'typed-emitter';

export type ServerInitEmitter = TypedEmitter<{
  moduleInitted: (name: string) => void;
  allModulesLoaded: () => void;
  serverReady: () => void;
}>


export type LoadLibraryFunction = <T=any>(name:string) => T;

export type Library<T=any> = {
  init?: (loadLibrary: LoadLibraryFunction) => {}
} & T

export type LibraryFactoryModule = {
  create: (serverInitted?: ServerInitEmitter) => Library
}

export type LibraryFactory = (serverInitEmitter: ServerInitEmitter) => Library;

export type Libraries = Record<string, Library | ServerInitEmitter>

export type ModuleFactory = (libraries: Libraries) => void;

export type ModuleFactoryModule = {
  create: ModuleFactory
}

export const create = (serverInitEmitter?: ServerInitEmitter, serverReadyModulesRequired: string[] = []) => {
  if (serverReadyModulesRequired.length){
    const moduleInitted: Set<string> = new Set();
    const alertTimeout = setTimeout(() => {
      // istanbul ignore next
      console.log('We are still waiting for the server to be ready, the missing modules are:', serverReadyModulesRequired.filter((name) => !moduleInitted.has(name)));
    }, 10000); // 10 seconds
    serverInitEmitter?.on('moduleInitted', (name) => {
      moduleInitted.add(name);
      if (serverReadyModulesRequired.every((name) => moduleInitted.has(name))){
        clearTimeout(alertTimeout);
        serverInitEmitter.emit('serverReady');
      }
    })
  }
  return {
    createLibraries: createLibraries(serverInitEmitter as ServerInitEmitter),
    createModules: createModules(serverInitEmitter as ServerInitEmitter),
  }
}