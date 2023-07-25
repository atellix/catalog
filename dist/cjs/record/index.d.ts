import { AbstractProperty, AbstractDefinitionMap } from './schema.js';
type AbstractPropertyMap = {
    [key: string]: AbstractProperty;
};
type PropertyCache = {
    [key: string]: {
        uris: {
            [key: string]: string;
        };
        properties: {
            [key: string]: AbstractProperty;
        };
    };
};
export declare function getBeginningOfDay(date: Date): Date;
export declare function isBeginningOfDay(date: Date): boolean;
export declare class ObjectBuilder {
    private defs;
    private typeDefs;
    constructor(defs: AbstractDefinitionMap);
    getAllProperties(type: string, cache: PropertyCache): AbstractPropertyMap;
    getAllPropertyUris(type: string, cache: PropertyCache): {
        [key: string]: string;
    };
    isLiteral(type: string): boolean;
    buildLiteral(store: any, node: string, property: string, type: string, dkey: string, dval: any): void;
    buildObject(store: any, propertyDef: AbstractProperty, dval: any, cache: PropertyCache, baseUri: string): string;
    buildResource(store: any, type: string, node: string, obj: any, cache: PropertyCache, baseUri?: string): void;
    decodeArray(store: any, nodeUri: string, literalVal: boolean, type: string, propKey: string, cache: PropertyCache): any[];
    isItemList(store: any, term: any): boolean;
    decodeLiteral(type: string, propKey: string, value: any): string | Date | number | boolean | undefined;
    decodeResource(store: any, nodeUri: any, cache: PropertyCache, specifyType?: string): {
        [key: string]: any;
    };
    getUriForUUID(store: any, uuid: string): string | null;
    getType(store: any, nodeUri: string): string | null;
}
export {};
//# sourceMappingURL=index.d.ts.map