import { LibraryFactory, LoadLibraryFunction } from "../../../..";

export const create: LibraryFactory = () => {
  let library1: any;

  const init = (loadLibrary: LoadLibraryFunction<any>) => {
    library1 = loadLibrary('library1');
  }

  const helloUpperCase = (str: string) => `Hello ${library1.toUpperCase(str)}`;

  return {
    init,
    helloUpperCase
  }
}
