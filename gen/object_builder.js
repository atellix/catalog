"use strict";
exports.__esModule = true;
var uuid_1 = require("uuid");
var n3_1 = require("n3");
var schema_1 = require("./schema");
var _a = n3_1["default"].DataFactory, namedNode = _a.namedNode, literal = _a.literal, quad = _a.quad;
function getBeginningOfDay(date) {
    var dt = new Date(date);
    dt.setHours(0, 0, 0, 0);
    return dt;
}
function isBeginningOfDay(date) {
    var dt = new Date(date);
    dt.setHours(0, 0, 0, 0);
    return dt.getTime() === date.getTime();
}
var ObjectBuilder = /** @class */ (function () {
    function ObjectBuilder(defs) {
        var _this = this;
        this.defs = defs;
        this.typeDefs = {};
        Object.entries(defs).forEach(function (_a) {
            var key = _a[0], value = _a[1];
            _this.typeDefs[value.uri] = key;
        });
    }
    ObjectBuilder.prototype.getAllProperties = function (type, cache) {
        if (type in cache) {
            return cache[type].properties;
        }
        var def = this.defs[type];
        var allProps;
        if (def["extends"] && def["extends"] !== 'IObject') {
            allProps = this.getAllProperties(def["extends"], cache);
        }
        else {
            allProps = {};
        }
        Object.entries(def.properties).forEach(function (_a) {
            var key = _a[0], value = _a[1];
            allProps[key] = value;
        });
        return allProps;
    };
    ObjectBuilder.prototype.getAllPropertyUris = function (type, cache) {
        if (type in cache) {
            return cache[type].uris;
        }
        var def = this.defs[type];
        var allProps;
        if (def["extends"] && def["extends"] !== 'IObject') {
            allProps = this.getAllPropertyUris(def["extends"], cache);
        }
        else {
            allProps = {};
        }
        Object.entries(def.propertyUris).forEach(function (_a) {
            var key = _a[0], value = _a[1];
            allProps[key] = value;
        });
        return allProps;
    };
    ObjectBuilder.prototype.buildResource = function (store, type, node, obj, cache) {
        var _this = this;
        var def = this.defs[type];
        store.addQuad(quad(namedNode(node), namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), namedNode(def.uri)));
        var allProps;
        if (type in cache) {
            allProps = cache[type].properties;
        }
        else {
            allProps = this.getAllProperties(type, cache);
            cache[type] = { properties: allProps, uris: {} };
        }
        Object.entries(allProps).forEach(function (_a) {
            var key = _a[0], value = _a[1];
            var dkey = key;
            if (value.isOptional) {
                if (!(dkey in obj)) {
                    return;
                }
            }
            if (value.isArray) {
                var arr = void 0;
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
                var itemList = namedNode(node + '#' + (0, uuid_1.v4)());
                store.addQuad(quad(itemList, namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), namedNode('http://schema.org/ItemList')));
                store.addQuad(quad(namedNode(node), namedNode(value.uri), itemList));
                for (var i = 0; i < arr.length; i++) {
                    var itemUri = node + '#' + (0, uuid_1.v4)();
                    var item = namedNode(itemUri);
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
                        var subItemUri = node + '#' + (0, uuid_1.v4)();
                        store.addQuad(quad(item, namedNode('http://schema.org/item'), namedNode(subItemUri)));
                        _this.buildResource(store, value.type, subItemUri, obj[dkey][i], cache);
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
                    var subItemUri = node + '#' + (0, uuid_1.v4)();
                    store.addQuad(quad(namedNode(node), namedNode(value.uri), namedNode(subItemUri)));
                    _this.buildResource(store, value.type, subItemUri, obj[dkey], cache);
                }
            }
        });
    };
    ObjectBuilder.prototype.decodeArray = function (store, type, nodeUri, cache) {
        var _this = this;
        var node = namedNode(nodeUri);
        var vals = store.getQuads(node, namedNode('http://schema.org/itemListElement'), null, null);
        var output = [];
        vals.forEach(function (q) {
            var listItem = q.object;
            var pos = store.getQuads(listItem, namedNode('http://schema.org/position'), null, null);
            var item = store.getQuads(listItem, namedNode('http://schema.org/item'), null, null);
            if (pos.length === 1 && item.length === 1) {
                output.push([parseInt(pos[0].object.value), item[0].object.value]);
            }
        });
        output.sort(function (a, b) {
            if (a[0] < b[0]) {
                return -1;
            }
            if (a[0] > b[0]) {
                return 1;
            }
            return 0;
        });
        output = output.map(function (r) { return _this.decodeResource(store, type, r[1], cache); });
        return output;
    };
    ObjectBuilder.prototype.decodeResource = function (store, type, nodeUri, cache) {
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
        var node = namedNode(nodeUri);
        var vals = store.getQuads(node, null, null, null);
        for (var i = 0; i < vals.length; i++) {
            var propUri = vals[i].predicate.value;
            if (propUri === 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type') {
                if (vals[i].object.value in this.typeDefs) {
                    item.type = this.typeDefs[vals[i].object.value];
                }
            }
            else if (propUri in allUris) {
                var propKey = allUris[propUri];
                var prop = allProps[propKey];
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
    };
    return ObjectBuilder;
}());
function construct(defs) {
    var builder = new ObjectBuilder(defs);
    var type = 'IEvent';
    var obj = {
        id: 'http://example.com/event/1',
        name: 'Birthday Party',
        description: 'Mikes Birthday Party',
        startDate: getBeginningOfDay(new Date()),
        image: [
            {
                url: 'https://www.gravatar.com/avatar/c9cb338a29d608d33e16ff3f2e7f9635?s=64&d=identicon&r=PG'
            }
        ]
    };
    console.log(obj);
    var store = new n3_1["default"].Store();
    // Build
    builder.buildResource(store, type, obj.id, obj, {});
    // Write 
    var writer = new n3_1["default"].Writer({
        prefixes: {
            'rdf': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
            'schema': 'http://schema.org/',
            'catalog': 'http://rdf.atellix.com/schema/catalog/'
        }
    });
    store.forEach(function (q) {
        writer.addQuad(q);
    });
    writer.end(function (error, result) { return console.log(result); });
    // Decode 
    var rsrc = builder.decodeResource(store, type, obj.id, {});
    console.log(rsrc);
}
construct(schema_1.abstractDefinitionMap);
