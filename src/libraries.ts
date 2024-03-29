import { Library, LibraryFactoryModule, ServerInitEmitter } from ".";

export const createLibraries = (serverInitEmitter: ServerInitEmitter) => (librariesFactories: Record<string, LibraryFactoryModule>, syncDependencies: Record<string, any> = {}): Record<string, Library> => {
  const libraries: Record<string, Library> = syncDependencies
  for (const name of Object.keys(librariesFactories)) {
    libraries[name] = librariesFactories[name].create(serverInitEmitter);
  }

  const initedLibraries: Set<string> = new Set();

  const loadLibrary = (name: string) => {
    if (!initedLibraries.has(name))
      initLibrary(name);
    return libraries[name];
  }

  const initLibrary = (name:string) => {
    libraries[name].init && (libraries[name].init as Function)(loadLibrary);
    initedLibraries.add(name);
  }
  for (const name of Object.keys(libraries)) {
    loadLibrary(name);
  }
  return libraries;
};
