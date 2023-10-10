import { abstractDefinitions } from './schema';
function exportInterfaces(abstractDefinitions) {
    var interfaces = {};
    abstractDefinitions.forEach((abstractDefinition) => {
        interfaces[abstractDefinition.name] = abstractDefinition;
    });
    return interfaces;
}
/*console.log(`export interface IObject {
    id?: string
    type?: string
}`)*/
console.log(JSON.stringify(exportInterfaces(abstractDefinitions), null, 4));
