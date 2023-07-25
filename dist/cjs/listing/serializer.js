"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SerializerJsonld = exports.SerializerStream = void 0;
const jsonld_1 = __importDefault(require("jsonld"));
const readable_stream_1 = require("readable-stream");
async function chunks(stream) {
    const chunks = [];
    for await (const chunk of stream) {
        chunks.push(chunk);
    }
    return chunks;
}
class SerializerStream extends readable_stream_1.Readable {
    constructor(input, options) {
        var _a, _b, _c, _d, _e, _f, _g;
        super({ objectMode: true, read: () => { } });
        this.compact = (_a = options.compact) !== null && _a !== void 0 ? _a : false;
        this.context = (_b = options.context) !== null && _b !== void 0 ? _b : {};
        this.encoding = (_c = options.encoding) !== null && _c !== void 0 ? _c : 'object';
        this.flatten = (_d = options.flatten) !== null && _d !== void 0 ? _d : false;
        this.frame = (_e = options.frame) !== null && _e !== void 0 ? _e : false;
        this.prettyPrint = (_f = options.prettyPrint) !== null && _f !== void 0 ? _f : false;
        this.skipContext = (_g = options.skipContext) !== null && _g !== void 0 ? _g : false;
        if (options.baseIRI) {
            this.context['@base'] = options.baseIRI.value || options.baseIRI.toString();
        }
        input.on('prefix', (prefix, namespace) => {
            if (!this.context[prefix]) {
                this.context[prefix] = namespace.value;
            }
        });
        this.handleData(input);
    }
    async handleData(input) {
        try {
            const quadArray = (await chunks(input)).map(SerializerStream.toJsonldQuad);
            const rawJsonld = await jsonld_1.default.fromRDF(quadArray);
            this.transform(rawJsonld).then((transformedJsonld) => {
                this.push(transformedJsonld);
                this.push(null);
            });
        }
        catch (err) {
            this.emit('error', err);
        }
    }
    async transform(data) {
        if (this.compact) {
            data = await jsonld_1.default.compact(data, this.context);
        }
        if (this.flatten) {
            data = await jsonld_1.default.flatten(data, this.context);
        }
        if (this.frame) {
            data = await jsonld_1.default.frame(data, this.context);
        }
        if (this.skipContext && data['@context']) {
            delete data['@context'];
        }
        if (this.encoding === 'string') {
            if (this.prettyPrint) {
                return JSON.stringify(data, null, 2);
            }
            else {
                return JSON.stringify(data);
            }
        }
        return data;
    }
    static toJsonldQuad(quad) {
        return {
            subject: SerializerStream.toJsonldTerm(quad.subject),
            predicate: SerializerStream.toJsonldTerm(quad.predicate),
            object: SerializerStream.toJsonldTerm(quad.object),
            graph: SerializerStream.toJsonldTerm(quad.graph)
        };
    }
    static toJsonldTerm(term) {
        if (term.termType === 'BlankNode') {
            return {
                termType: 'BlankNode',
                value: `_:${term.value}`
            };
        }
        return term;
    }
}
exports.SerializerStream = SerializerStream;
class SerializerJsonld {
    constructor(options) {
        this.Impl = SerializerStream;
        this.options = options;
    }
    import(input) {
        const output = new this.Impl(input, { ...this.options });
        input.on('end', () => {
            if (!output.readable) {
                output.emit('end');
            }
        });
        input.on('error', err => {
            output.emit('error', err);
        });
        return output;
    }
}
exports.SerializerJsonld = SerializerJsonld;
//# sourceMappingURL=serializer.js.map