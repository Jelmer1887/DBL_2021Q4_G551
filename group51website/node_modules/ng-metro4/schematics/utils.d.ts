import { Tree } from '@angular-devkit/schematics';
export declare function getLibraryVersion(): any;
export declare function getDependencyVersion(dependency: string, collection?: 'dependencies' | 'devDependencies' | 'peerDependencies'): any;
export declare function addPackageToPackageJson(host: Tree, pkg: string, version: string): Tree;
export declare function addAssetToProject(host: Tree, asset: string, assetArray: 'assets' | 'styles' | 'scripts', projectNameInput?: string): Tree;
