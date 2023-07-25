import { Readable } from 'readable-stream';
export interface SerializerStreamOptions {
    baseIRI: any;
    compact?: boolean;
    context?: object;
    encoding?: string;
    flatten?: boolean;
    frame?: boolean;
    prettyPrint?: boolean;
    skipContext?: boolean;
}
export declare class SerializerStream extends Readable {
    private baseIRI;
    private compact;
    private context;
    private encoding;
    private flatten;
    private frame;
    private prettyPrint;
    private skipContext;
    constructor(input: any, options: SerializerStreamOptions);
    handleData(input: any): Promise<void>;
    transform(data: any): Promise<any>;
    static toJsonldQuad(quad: any): {
        subject: any;
        predicate: any;
        object: any;
        graph: any;
    };
    static toJsonldTerm(term: any): any;
}
export declare class SerializerJsonld {
    private Impl;
    private options;
    constructor(options: any);
    import(input: any): any;
}
//# sourceMappingURL=serializer.d.ts.map