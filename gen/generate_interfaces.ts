import { AbstractDefinition, abstractDefinitions } from './schema'

function generateInterfaces(abstractDefinitions: AbstractDefinition[]) {
    abstractDefinitions.forEach((abstractDefinition) => {
        let extendsClause = ""
        if (abstractDefinition.extends) {
            extendsClause = ` extends ${abstractDefinition.extends}`
        }
        console.log(`/** @category Types */
export interface ${abstractDefinition.name}${extendsClause} {`)
        Object.entries(abstractDefinition.properties).forEach(([key, value]) => {
            const optional = value.isOptional ? "?" : ""
            const valType = (value.isArray) ? 'Array<' + value.type + '>' : value.type
            console.log(`    ${key}${optional}: ${valType}`)
        })
        console.log(`}`)
    })
}

console.log(`/** @hidden */
export interface IObject {
    id?: string
    type?: string
}`)

generateInterfaces(abstractDefinitions)

