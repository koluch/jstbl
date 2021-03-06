"use strict";
/**
 * --------------------------------------------------------------------
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Nikolai Mavrenkov
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * --------------------------------------------------------------------
 * Author:  Nikolai Mavrenkov <koluch@koluch.ru>
 * Created: 28.11.2015 00:28
 */

/*
 Basic table-data manipulation functions
 */
function mapGroup(data, f) {
    if(data === undefined || data === null) return data;
    if(f === undefined) return data;
    if(data.constructor === Array) {
        return f(data.slice());
    }
    else if(data.constructor === Number || data.constructor === String || data.constructor === Boolean) {
        return data;
    }
    else {
        var result = {};
        for(var i in data) {
            result[i] = mapGroup(data[i], f);
        }
        return result;
    }
}

function map(data, f) {
    if(f === undefined) return data;
    return mapGroup(data, (group) => group.map(f));
}

/*
 Special functions to handle data - sorting, grouping and so on
 */
function filter(data, fs) {
    if(data===null || data === undefined) {
        return data;
    }
    fs = fs || [];
    fs = fs.constructor === Array ? fs : [fs];
    return mapGroup(data, (group) => (
        fs.reduce((result, f) => result.filter(f), group)
    ))
}

function group(data, fs) {
    fs = fs || [];
    fs = fs.constructor === Array ? fs : [fs];
    return fs.reduce((result, f) => (
         mapGroup(result, (group) => {
            var grouped = {};
            for (var i = 0; i < group.length; i++) {
                var el = group[i];
                var cat = f(el);
                if (!grouped[cat]) {
                    grouped[cat] = [];
                }
                grouped[cat].push(el);
            }
            return grouped;
        })
    ), data)
}

function sort(data, fs) {
    fs = fs || [];
    fs = fs.constructor === Array ? fs : [fs];
    return mapGroup(data, (group) => (
        group.sort((x, y) => (
            fs.reduce((result, f) => ((result === 0) ? f(x, y) : result), 0)
        ))
    ));
}

function hideFields(data, fields) {
    fields = fields || [];
    return map(data, (row) => {
        if(row.constructor === Number || row.constructor === String || row.constructor === Boolean) {
            return row;
        }
        else {
            var result = {};
            for(var i in row) {
                if(fields.indexOf(i)==-1) {
                    result[i] = row[i];
                }
            }
            return result;
        }
    });
}

function showFields(data, fields) {
    return map(data, (row) => {
        var result = {};
        for (var i = 0; i < fields.length; i++) {
            var field = fields[i];
            if(row[field]!==undefined) {
                result[field] = row[field];
            }
        }
        return result;
    });
}

function clear(data) {
    if(data === null || data === undefined) return data;
    function aux(data) {
        if(data.constructor === Array) {
            return {
                value: data,
                isEmpty: data.length == 0
            };
        }
        else if(data.constructor === Number || data.constructor === String || data.constructor === Boolean) {
            return {
                value: data,
                isEmpty: false
            }
        }
        else {
            var result = {};
            var isEmpty = true;
            for(var i in data) {
                var clearResult = aux(data[i]);
                if(!clearResult.isEmpty) {
                    isEmpty = false;
                    result[i] = clearResult.value;
                }
            }
            return {
                value:result,
                isEmpty: isEmpty
            };
        }
    }
    return aux(data).value;
}


module.exports.mapGroup = mapGroup;
module.exports.map = map;

module.exports.filter = filter;
module.exports.clear = clear;
module.exports.group = group;
module.exports.sort = sort;
module.exports.hideFields = hideFields;
module.exports.showFields = showFields;