"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function getLibraryVersion() {
    return JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, '../package.json'), 'utf8')).version;
}
exports.getLibraryVersion = getLibraryVersion;
function getDependencyVersion(dependency, collection = 'peerDependencies') {
    return JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, '../package.json'), 'utf8'))[collection][dependency];
}
exports.getDependencyVersion = getDependencyVersion;
function addPackageToPackageJson(host, pkg, version) {
    if (host.exists('package.json')) {
        const sourceText = host.read('package.json').toString('utf-8');
        const json = JSON.parse(sourceText);
        if (!json.dependencies) {
            json.dependencies = {};
        }
        if (!json.dependencies[pkg]) {
            json.dependencies[pkg] = version;
            json.dependencies = sortObjectByKeys(json.dependencies);
        }
        host.overwrite('package.json', JSON.stringify(json, null, 2));
    }
    return host;
}
exports.addPackageToPackageJson = addPackageToPackageJson;
function addAssetToProject(host, asset, assetArray, projectNameInput) {
    if (host.exists('angular.json')) {
        const sourceText = host.read('angular.json').toString('utf-8');
        const json = JSON.parse(sourceText);
        const projectName = projectNameInput || json.defaultProject;
        const projectConfig = json.projects[projectName];
        if (!projectConfig) {
            return host;
        }
        let configs = projectConfig.architect.build.options[assetArray];
        if (!configs) {
            configs = [asset];
        }
        else {
            configs = [asset].concat(configs);
        }
        projectConfig.architect.build.options[assetArray] = configs;
        host.overwrite('angular.json', JSON.stringify(json, null, 2));
    }
    return host;
}
exports.addAssetToProject = addAssetToProject;
function sortObjectByKeys(obj) {
    return Object.keys(obj)
        .sort()
        .reduce((result, key) => {
        result[key] = obj[key];
        return result;
    }, {});
}
