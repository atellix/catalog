import { AbstractDefinition, abstractDefinitions } from './schema'

function exportInterfaces(abstractDefinitions: AbstractDefinition[]): { [key: string]: AbstractDefinition } {
    var interfaces: { [key: string]: AbstractDefinition } = {}
    abstractDefinitions.forEach((abstractDefinition) => {
        interfaces[abstractDefinition.name] = abstractDefinition
    })
    return interfaces
}

/*console.log(`export interface IObject {
    id?: string
    type?: string
}`)*/

console.log(JSON.stringify(exportInterfaces(abstractDefinitions), null, 4))

