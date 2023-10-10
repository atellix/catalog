import { v4 as uuidv4 } from 'uuid';
import N3 from 'n3';
import { abstractDefinitionMap } from './schema';
const { namedNode, literal, quad } = N3.DataFactory;
function getBeginningOfDay(date) {
    const dt = new Date(date);
    dt.setHours(0, 0, 0, 0);
    return dt;
}
function isBeginningOfDay(date) {
    const dt = new Date(date);
    dt.setHours(0, 0, 0, 0);
    return dt.getTime() === date.getTime();
}
class ObjectBuilder {
    constructor(defs) {
        this.defs = defs;
        this.typeDefs = {};
        Object.entries(defs).forEach(([key, value]) => {
            this.typeDefs[value.uri] = key;
        });
    }
    getAllProperties(type, cache) {
        if (type in cache) {
            return cache[type].properties;
        }
        const def = this.defs[type];
        var allProps;
        if (def.extends && def.extends !== 'IObject') {
            allProps = this.getAllProperties(def.extends, cache);
        }
        else {
            allProps = {};
        }
        Object.entries(def.properties).forEach(([key, value]) => {
            allProps[key] = value;
        });
        return allProps;
    }
    getAllPropertyUris(type, cache) {
        if (type in cache) {
            return cache[type].uris;
        }
        const def = this.defs[type];
        var allProps;
        if (def.extends && def.extends !== 'IObject') {
            allProps = this.getAllPropertyUris(def.extends, cache);
        }
        else {
            allProps = {};
        }
        Object.entries(def.propertyUris).forEach(([key, value]) => {
            allProps[key] = value;
        });
        return allProps;
    }
    buildResource(store, type, node, obj, cache) {
        const def = this.defs[type];
        store.addQuad(quad(namedNode(node), namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), namedNode(def.uri)));
        var allProps;
        if (type in cache) {
            allProps = cache[type].properties;
        }
        else {
            allProps = this.getAllProperties(type, cache);
            cache[type] = { properties: allProps, uris: {} };
        }
        Object.entries(allProps).forEach(([key, value]) => {
            let dkey = key;
            if (value.isOptional) {
                if (!(dkey in obj)) {
                    return;
                }
            }
            if (value.isArray) {
                let arr;
                if (value.type === 'string') {
                    arr = obj[dkey];
                }
                else if (value.type === 'number') {
                    arr = obj[dkey];
                }
                else if (value.type === 'boolean') {
                    arr = obj[dkey];
                }
                else if (value.type === 'Date') {
                    arr = obj[dkey];
                }
                else {
                    arr = obj[dkey];
                }
                const itemList = namedNode(node + '#' + uuidv4());
                store.addQuad(quad(itemList, namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), namedNode('http://schema.org/ItemList')));
                store.addQuad(quad(namedNode(node), namedNode(value.uri), itemList));
                for (var i = 0; i < arr.length; i++) {
                    const itemUri = node + '#' + uuidv4();
                    const item = namedNode(itemUri);
                    store.addQuad(quad(itemList, namedNode('http://schema.org/itemListElement'), item));
                    store.addQuad(quad(item, namedNode('http://schema.org/position'), literal(i)));
                    if (value.type === 'string' || value.type === 'number' || value.type === 'boolean') {
                        store.addQuad(quad(item, namedNode('http://schema.org/item'), literal(obj[dkey][i])));
                    }
                    else if (value.type === 'Date') {
                        if (isBeginningOfDay(obj[dkey][i])) {
                            store.addQuad(quad(item, namedNode('http://schema.org/item'), literal(obj[dkey][i].toLocaleDateString())));
                        }
                        else {
                            store.addQuad(quad(item, namedNode('http://schema.org/item'), literal(obj[dkey][i])));
                        }
                    }
                    else {
                        const subItemUri = node + '#' + uuidv4();
                        store.addQuad(quad(item, namedNode('http://schema.org/item'), namedNode(subItemUri)));
                        this.buildResource(store, value.type, subItemUri, obj[dkey][i], cache);
                    }
                }
            }
            else {
                if (value.type === 'string' || value.type === 'number' || value.type === 'boolean') {
                    store.addQuad(quad(namedNode(node), namedNode(value.uri), literal(obj[dkey])));
                }
                else if (value.type === 'Date') {
                    if (isBeginningOfDay(obj[dkey])) {
                        store.addQuad(quad(namedNode(node), namedNode(value.uri), literal(obj[dkey].toLocaleDateString())));
                    }
                    else {
                        store.addQuad(quad(namedNode(node), namedNode(value.uri), literal(obj[dkey])));
                    }
                }
                else {
                    const subItemUri = node + '#' + uuidv4();
                    store.addQuad(quad(namedNode(node), namedNode(value.uri), namedNode(subItemUri)));
                    this.buildResource(store, value.type, subItemUri, obj[dkey], cache);
                }
            }
        });
    }
    decodeArray(store, type, nodeUri, cache) {
        const node = namedNode(nodeUri);
        const vals = store.getQuads(node, namedNode('http://schema.org/itemListElement'), null, null);
        var output = [];
        vals.forEach((q) => {
            const listItem = q.object;
            const pos = store.getQuads(listItem, namedNode('http://schema.org/position'), null, null);
            const item = store.getQuads(listItem, namedNode('http://schema.org/item'), null, null);
            if (pos.length === 1 && item.length === 1) {
                output.push([parseInt(pos[0].object.value), item[0].object.value]);
            }
        });
        output.sort((a, b) => {
            if (a[0] < b[0]) {
                return -1;
            }
            if (a[0] > b[0]) {
                return 1;
            }
            return 0;
        });
        output = output.map((r) => this.decodeResource(store, type, r[1], cache));
        return output;
    }
    decodeResource(store, type, nodeUri, cache) {
        var item = { id: nodeUri, type: [] };
        var allProps;
        var allUris;
        if (type in cache) {
            allProps = cache[type].properties;
            allUris = cache[type].uris;
        }
        else {
            allProps = this.getAllProperties(type, cache);
            allUris = this.getAllPropertyUris(type, cache);
            cache[type] = { properties: allProps, uris: allUris };
        }
        const node = namedNode(nodeUri);
        const vals = store.getQuads(node, null, null, null);
        for (var i = 0; i < vals.length; i++) {
            const propUri = vals[i].predicate.value;
            if (propUri === 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type') {
                if (vals[i].object.value in this.typeDefs) {
                    item.type = this.typeDefs[vals[i].object.value];
                }
            }
            else if (propUri in allUris) {
                const propKey = allUris[propUri];
                const prop = allProps[propKey];
                if (prop.isArray) {
                    item[propKey] = this.decodeArray(store, prop.type, vals[i].object.value, cache);
                }
                else {
                    if (prop.type === 'string') {
                        item[propKey] = vals[i].object.value;
                    }
                    else if (prop.type === 'Date') {
                        item[propKey] = new Date(vals[i].object.value);
                    }
                    else if (prop.type === 'number') {
                        item[propKey] = Number(vals[i].object.value);
                    }
                    else if (prop.type === 'boolean') {
                        console.log('TODO: ' + vals[i].object.value);
                    }
                    else {
                        item[propKey] = this.decodeResource(store, prop.type, vals[i].object.value, cache);
                    }
                }
            }
        }
        return item;
    }
}
function construct(defs) {
    const builder = new ObjectBuilder(defs);
    const type = 'IEvent';
    const obj = {
        id: 'http://example.com/event/1',
        name: 'Birthday Party',
        description: 'Mikes Birthday Party',
        startDate: getBeginningOfDay(new Date()),
        image: [
            {
                url: 'https://www.gravatar.com/avatar/c9cb338a29d608d33e16ff3f2e7f9635?s=64&d=identicon&r=PG',
            }
        ],
    };
    console.log(obj);
    const store = new N3.Store();
    // Build
    builder.buildResource(store, type, obj.id, obj, {});
    // Write 
    const writer = new N3.Writer({
        prefixes: {
            'rdf': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
            'schema': 'http://schema.org/',
            'catalog': 'http://rdf.atellix.net/schema/catalog/',
        }
    });
    store.forEach((q) => {
        writer.addQuad(q);
    });
    writer.end((error, result) => console.log(result));
    // Decode 
    const rsrc = builder.decodeResource(store, type, obj.id, {});
    console.log(rsrc);
}
construct(abstractDefinitionMap);
