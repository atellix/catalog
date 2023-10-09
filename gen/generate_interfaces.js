"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var schema_1 = require("./schema");
function generateInterfaces(abstractDefinitions) {
    abstractDefinitions.forEach(function (abstractDefinition) {
        var extendsClause = "";
        if (abstractDefinition.extends) {
            extendsClause = " extends ".concat(abstractDefinition.extends);
        }
        console.log("/** @category Types */\nexport interface ".concat(abstractDefinition.name).concat(extendsClause, " {"));
        Object.entries(abstractDefinition.properties).forEach(function (_a) {
            var key = _a[0], value = _a[1];
            var optional = value.isOptional ? "?" : "";
            var valType = (value.isArray) ? 'Array<' + value.type + '>' : value.type;
            console.log("    ".concat(key).concat(optional, ": ").concat(valType));
        });
        console.log("}");
    });
}
console.log("/** @hidden */\nexport interface IObject {\n    id?: string\n    type?: string\n}");
generateInterfaces(schema_1.abstractDefinitions);
