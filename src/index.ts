import { createLibraries } from "./libraries";
import { createModules } from "./modules";

export type LoadLibraryFunction = <T=any>(name:string) => T;

export type Library<T=any> = {
  init?: (loadLibrary: LoadLibraryFunction) => {}
} & T

export type LibraryFactoryModule = {
  create: () => Library
}

export type LibraryFactory = () => Library;


export type ModuleFactory = (libraries: Record<string, Library>) => void;

export type ModuleFactoryModule = {
  create: ModuleFactory
}

export {
  createLibraries,
  createModules
}