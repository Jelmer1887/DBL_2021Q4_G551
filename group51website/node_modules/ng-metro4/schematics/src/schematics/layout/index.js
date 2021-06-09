"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schematics_1 = require("@angular-devkit/schematics");
function default_1(options) {
    return (host, context) => {
        const sourceTemplate = schematics_1.url('./files');
        if (host.exists('src/app/app.component.html')) {
            host.delete('src/app/app.component.html');
        }
        const sourceParametrizedTemplate = schematics_1.apply(sourceTemplate, [
            schematics_1.template(Object.assign({}, options))
        ]);
        return schematics_1.mergeWith(sourceParametrizedTemplate, schematics_1.MergeStrategy.Overwrite)(host, context);
    };
}
exports.default = default_1;
