import { LibraryFactory, ServerInitEmitter } from "../../..";

export const create: LibraryFactory = (serverInitEmitter: ServerInitEmitter) => {
  serverInitEmitter.on('moduleInitted', (name) => {
    if (name === 'library3'){
      setTimeout(() => {
        serverInitEmitter.emit('moduleInitted', 'library4');
      }, 100);
    }
  })
  
  return {}
}