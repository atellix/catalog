import jsonld from 'jsonld'
import { Readable } from 'readable-stream'

export interface SerializerStreamOptions {
    baseIRI: any
    compact?: boolean
    context?: object
    encoding?: string
    flatten?: boolean
    frame?: boolean
    prettyPrint?: boolean
    skipContext?: boolean
}

async function chunks (stream: any): Promise<any[]> {
    const chunks: any[] = []
    for await (const chunk of stream) {
        chunks.push(chunk)
    }
    return chunks
}

export class SerializerStream extends Readable {
    private baseIRI: any
    private compact: boolean
    private context: object
    private encoding: string
    private flatten: boolean
    private frame: boolean
    private prettyPrint: boolean
    private skipContext: boolean

    constructor (input: any, options: SerializerStreamOptions) {
        super({ objectMode: true, read: () => {} })
        this.compact = options.compact ?? false
        this.context = options.context ?? {}
        this.encoding = options.encoding ?? 'object'
        this.flatten = options.flatten ?? false
        this.frame = options.frame ?? false
        this.prettyPrint = options.prettyPrint ?? false
        this.skipContext = options.skipContext ?? false
        if (options.baseIRI) {
            this.context['@base'] = options.baseIRI.value || options.baseIRI.toString()
        }
        input.on('prefix', (prefix: string, namespace: any) => {
            if (!this.context[prefix]) {
                this.context[prefix] = namespace.value
            }
        })
        this.handleData(input)
    }

    async handleData (input: any) {
        try {
            const quadArray: any = (await chunks(input)).map(SerializerStream.toJsonldQuad)
            const rawJsonld: any = await jsonld.fromRDF(quadArray)
            this.transform(rawJsonld).then((transformedJsonld) => {
                (this as any).push(transformedJsonld);
                (this as any).push(null)
            })
        } catch (err) {
            (this as any).emit('error', err)
        }
    }

    async transform (data: any): Promise<any> {
        if (this.compact) {
            data = await jsonld.compact(data, this.context)
        }
        if (this.flatten) {
            data = await jsonld.flatten(data, this.context)
        }
        if (this.frame) {
            data = await jsonld.frame(data, this.context)
        }
        if (this.skipContext && data['@context']) {
            delete data['@context']
        }
        if (this.encoding === 'string') {
            if (this.prettyPrint) {
                return JSON.stringify(data, null, 2)
            } else {
                return JSON.stringify(data)
            }
        }
        return data
    }

    static toJsonldQuad (quad: any) {
        return {
            subject: SerializerStream.toJsonldTerm(quad.subject),
            predicate: SerializerStream.toJsonldTerm(quad.predicate),
            object: SerializerStream.toJsonldTerm(quad.object),
            graph: SerializerStream.toJsonldTerm(quad.graph)
        }
    }

    static toJsonldTerm (term: any) {
        if (term.termType === 'BlankNode') {
            return {
                termType: 'BlankNode',
                value: `_:${term.value}`
            }
        }
        return term
    }
}

export class SerializerJsonld {
    private Impl: any
    private options: object
    constructor (options) {
        this.Impl = SerializerStream
        this.options = options
    }
    import (input: any) {
        const output = new this.Impl(input, { ...this.options })
        input.on('end', () => {
            if (!output.readable) {
                output.emit('end')
            }
        })
        input.on('error', err => {
            output.emit('error', err)
        })
        return output
    }
}

