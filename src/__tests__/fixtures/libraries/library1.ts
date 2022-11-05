import { LibraryFactory } from "../../..";

export const create: LibraryFactory = () => {
  const toUpperCase = (str: string) => str.toUpperCase();
  
  return {
    toUpperCase
  }
}