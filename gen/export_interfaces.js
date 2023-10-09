"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var schema_1 = require("./schema");
function exportInterfaces(abstractDefinitions) {
    var interfaces = {};
    abstractDefinitions.forEach(function (abstractDefinition) {
        interfaces[abstractDefinition.name] = abstractDefinition;
    });
    return interfaces;
}
/*console.log(`export interface IObject {
    id?: string
    type?: string
}`)*/
console.log(JSON.stringify(exportInterfaces(schema_1.abstractDefinitions), null, 4));
