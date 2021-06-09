"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tasks_1 = require("@angular-devkit/schematics/tasks");
const utils_1 = require("../utils");
function default_1(options) {
    return (host, context) => {
        const version = utils_1.getLibraryVersion();
        utils_1.addPackageToPackageJson(host, 'ng-metro4', `^${version}`);
        const metro4Version = utils_1.getDependencyVersion('metro4');
        utils_1.addPackageToPackageJson(host, 'metro4', `${metro4Version}`);
        const momentVersion = utils_1.getDependencyVersion('moment');
        utils_1.addPackageToPackageJson(host, 'moment', `${momentVersion}`);
        context.logger.log('info', `✅ Added "ng-metro4@^${version}", "metro4@${metro4Version}", ` +
            `and "moment@${momentVersion}" into dependencies`);
        if (options.skipInstall) {
            context.logger.log('warn', `⚠ The "--skip-install" flag was present, don't forget to install package manually`);
        }
        else {
            context.logger.log('info', `✅ Installing added packages...`);
            context.addTask(new tasks_1.NodePackageInstallTask());
        }
        utils_1.addAssetToProject(host, 'node_modules/metro4/build/css/metro-all.min.css', 'styles', options.project);
        context.logger.log('info', '✅ Added assets to "angular.json"');
        return host;
    };
}
exports.default = default_1;
