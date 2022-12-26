import TypedEmitter from 'typed-emitter';

export type ServerInitEmitter = TypedEmitter<{
  moduleInitted: (name: string) => void;
  allModulesLoaded: () => void;
  serverReady: () => void;
}>

export type LoadLibraryFunction<LIBS extends Libraries> = <NAME extends keyof LIBS>(name: NAME) => LIBS[NAME];

export type Library<T extends Libraries=any, LIBRARY=Record<string, any>> = {
  init?: (loadLibrary: LoadLibraryFunction<T>) => void
} & LIBRARY

export type LibraryFactoryModule = {
  create: (serverInitted?: ServerInitEmitter) => Library
}

export type LibraryFactory<T extends Libraries = any, LIBRARY=Record<string, any>> = (serverInitEmitter: ServerInitEmitter, ...args:unknown[]) => Library<T, LIBRARY>;

export type Libraries = Record<string, Library | ServerInitEmitter>

export type ModuleFactory<T extends Libraries = Libraries, MOD=any> = (libraries: T, ...args:unknown[]) => MOD;

export type ModuleFactoryModule = {
  create: ModuleFactory
}
