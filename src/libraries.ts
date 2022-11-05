import { Library, LibraryFactoryModule } from ".";

export const createLibraries = (librariesFactories: Record<string, LibraryFactoryModule>): Record<string, Library> => {
  const libraries: Record<string, Library> = {}
  for (const name of Object.keys(librariesFactories)) {
    libraries[name] = librariesFactories[name].create();
  }
  
  const initedLibraries: Set<string> = new Set();

  const loadLibrary = (name: string) => {
    if (!initedLibraries.has(name))
      initLibrary(name);
    return libraries[name];
  }
  
  const initLibrary = (name:string) => {
    libraries[name].init && libraries[name].init(loadLibrary);
    initedLibraries.add(name);
  }

  for (const name of Object.keys(libraries)) {
    initLibrary(name);
  }
  return libraries;
};