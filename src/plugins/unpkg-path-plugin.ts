import * as esbuild from 'esbuild-wasm';
 
export const unpkgPathPlugin = () => {
  return {
    // NAME property good for debugging purposes if you have lots of plugins
    name: 'unpkg-path-plugin',
    // SETUP property called automatically by esbuild, build arg lets us adjust bundling process - 
    // finding file, loading it, parsing, transpiling, joining bunch of files together
    setup(build: esbuild.PluginBuild) {
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        console.log('onResovle', args);
        return { path: args.path, namespace: 'a' };
      });
 
    //   build.onLoad({ filter: /.*/ }, async (args: any) => {
    //     console.log('onLoad', args);
    //     // if esbuild is trying to find index.js don't let it do it's normal thing,
    //     // and load something from the file system, just return these contents
    //     if (args.path === 'index.js') {
    //       return {
    //         loader: 'jsx',
    //         contents: `
    //           import message from './message';
    //           console.log(message);
    //         `,
    //       };
    //     } else {
    //       return {
    //         loader: 'jsx',
    //         contents: 'export default "hi there!"',
    //       };
    //     }
    //   });
    build.onLoad({ filter: /.*/ }, async (args: any) => {
        console.log('onLoad', args);
        // if esbuild is trying to find index.js don't let it do it's normal thing,
        // and load something from the file system, just return these contents
        if (args.path === 'index.js') {
            return {
                loader: 'jsx',
                contents: `
                    import message from 'tiny-test-pkg';
                    console.log(message);
                    `,
                };
            }
        });
    },
  };
};

// ESBUILD bundling process
// figure out where index.js is stored (onResolve)
// attempt to load index.js file (onLoad)
// parse index.js file, find any import/require/exports
// if any import/require/exports, figure out where requested file is (onResolve)
// attempt to load that file up (onLoad)

// FILTER is a regular expression to controll when the expression should run based off file name
// NAMESPACE used similar to filter - here's a set of files, we only apply these onResolves,onLoads with a certain namespace