import {createLibraries, createModules} from '..'
import * as library1 from './fixtures/libraries/library1'
import * as library2 from './fixtures/libraries/library2'
import path from 'path'

describe('Libraries Loading', () => {
  it('loads a library', () => {
    const libraries = createLibraries( {library1, library2} );
    expect(libraries.library1.toUpperCase).toBeDefined();
    expect(libraries.library1.toUpperCase('tomas')).toBe('TOMAS');
  });
  it('loads libraries with interdependencies', () => {
    const libraries = createLibraries( { library2, library1} );
    expect(libraries.library2.helloUpperCase).toBeDefined();
    expect(libraries.library2.helloUpperCase('tomas')).toBe('Hello TOMAS');
  });
});

describe('Loads Modules', () => {
  it('wont failt when creating modules', async () => {
    const libraries = createLibraries( {library1, library2} );
    await createModules(libraries, path.join(__dirname,'fixtures/modules'));
  });
});