export interface AbstractProperty {
    uri: string;
    type: string;
    isArray?: boolean;
    isOptional?: boolean;
    isMultiType?: boolean;
}
export interface AbstractDefinition {
    uri: string;
    name: string;
    extends?: string;
    properties: {
        [key: string]: AbstractProperty;
    };
    propertyUris: {
        [key: string]: string;
    };
}
export type AbstractDefinitionMap = {
    [key: string]: AbstractDefinition;
};
export declare const abstractDefinitions: AbstractDefinition[];
export declare const abstractDefinitionMap: AbstractDefinitionMap;
//# sourceMappingURL=schema.d.ts.map