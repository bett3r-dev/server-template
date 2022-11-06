import { LibraryFactory } from "../../..";

export const create: LibraryFactory = (serverInitEmitter) => {
  setTimeout(() => {
    serverInitEmitter.emit('moduleInitted', 'library3');
  }, 100);
  
  return {}
}