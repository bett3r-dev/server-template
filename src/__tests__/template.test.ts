import { EventEmitter } from 'events'
import path from 'path'
import { create, ServerInitEmitter } from '..'
import {createServer, get} from 'http';
import * as library1 from './fixtures/libraries/library1'
import * as library2 from './fixtures/libraries/library2'
import * as library3 from './fixtures/libraries/library3'
import * as library4 from './fixtures/libraries/library4'
import { LoadModuleOptions } from 'src/modules';

describe('Libraries Loading', () => {
  it('loads a library', () => {
    const manager = create();
    const libraries = manager.createLibraries( {library1, library2} );
    expect(libraries.library1.toUpperCase).toBeDefined();
    expect(libraries.library1.toUpperCase('tomas')).toBe('TOMAS');
  });
  it('loads libraries with interdependencies', () => {
    const manager = create();
    const libraries = manager.createLibraries( { library2, library1} );
    expect(libraries.library2.helloUpperCase).toBeDefined();
    expect(libraries.library2.helloUpperCase('tomas')).toBe('Hello TOMAS');
  });
  it('supports EventEmitters as respose of libraries', (done) => {
    const serverInitEmitter = new EventEmitter() as ServerInitEmitter;
    const manager = create(serverInitEmitter);
    manager.createLibraries( {library3} );
    serverInitEmitter.on('moduleInitted', (name) => {
      expect(name).toBe('library3');
      done()
    })
  });
  it('allows libraries to wait for another library to be inited', (done) => {
    const serverInitEmitter = new EventEmitter() as ServerInitEmitter;
    const manager = create(serverInitEmitter);
    manager.createLibraries( {library3, library4} );
    serverInitEmitter.on('moduleInitted', (name) => {
      if (name === 'library4'){
        done()
      }
    })
  });
  it('emits the serverReadyEvent when all required Libraries are loaded', (done) => {
    const serverInitEmitter = new EventEmitter() as ServerInitEmitter;
    const manager = create(serverInitEmitter, ['library3', 'library4']);
    manager.createLibraries( {library3, library4} );
    serverInitEmitter.on('serverReady', () => {
      done()
    })
  });
});

describe('Loads Modules', () => {
  it.each([
    [{blackList:['module2']}],
    [{blackList:[/module2/]}],
    [{whiteList:['module1']}],
    [{whiteList:[/module1/]}],
  ])('wont fail when creating modules', async (options) => {
    return new Promise((done) => {
      const serverInitEmitter = new EventEmitter() as ServerInitEmitter;
      const manager = create(serverInitEmitter, ['library4', 'library5']);
      let port:number;
      const library5 = {
        create: (serverInitEmitter: ServerInitEmitter) => {
          const server = createServer((req, res) => {res.write('works'); res.end();})
          const s = server.listen(undefined, () => {
            serverInitEmitter.emit('moduleInitted', 'library5')
          });
          port = (s.address() as {port: number}).port;
          return {};
        }
      }
      const libraries = manager.createLibraries( {library2, library3, library4, library5, library1} );
      manager.createModules(libraries, path.join(__dirname,'fixtures/modules'), options as LoadModuleOptions);
      const fn = jest.fn()
      serverInitEmitter.on('allModulesLoaded', fn);
      serverInitEmitter.on('serverReady', () => {
        get(`http://localhost:${port}`, (res) => {
          res.on('data', chunk => {
            expect(chunk.toString()).toBe('works');
          })
          expect(fn).toBeCalled();
          done(undefined);
        })
      })
    })
  });
});