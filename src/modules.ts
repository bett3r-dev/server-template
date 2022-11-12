import { Library, ModuleFactoryModule, ServerInitEmitter } from "./types";
import fs from 'fs/promises';
import path from 'path';

export type LoadModuleOptions = {
  whiteList?: (string|RegExp)[]
  blackList?: (string|RegExp)[]
}

export function rejectFilename(filename:string, module:string, {whiteList, blackList}: LoadModuleOptions) {
  if (
    filename === '.git' ||
    filename === '.DS_Store' ||
    ( whiteList?.length && !whiteList?.some( ( match: any ) => !match.test ? match === module : match.test(module) )) ||
    ( blackList?.length && blackList?.some( ( match: any ) => !match.test ? match === module : match.test(module) ))
  )
    return true;
}

export async function loadModulesFromDirectory(modulesPath: string, options: LoadModuleOptions = {}): Promise<Record<string, ModuleFactoryModule>> {
  const components = await fs.readdir( modulesPath );
  const modulesMap: Record<string, any> = {};
  for (let filename of components) {
    const module = path.parse(filename).name;
    const filePath = `${modulesPath}/${filename}`;
    if (rejectFilename(filename, module, options))
      continue;
    else modulesMap[module] = await import( filePath );
  }
  return modulesMap;
}

export const createModules = (serverInitEmitter: ServerInitEmitter) => async (libraries: Record<string, Library>, modulesPath: string, options?: LoadModuleOptions) => {
  const modules = await loadModulesFromDirectory(modulesPath, options);
  for (const module of Object.keys(modules)) {
    modules[module].create({...libraries, serverInitEmitter});
  }
  serverInitEmitter.emit('allModulesLoaded');
}
