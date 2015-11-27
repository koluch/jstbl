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
    if(data.constructor === Array) {
        return f(data.slice());
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
    return mapGroup(data, (group) => group.map(f));
}

/*
 Special functions to handle data - sorting, grouping and so on
 */
function group(ar, fs) {
    var f = fs[0];
    if(f) {
        var result = {};
        for (var i = 0; i < ar.length; i++) {
            var el = ar[i];
            var cat = f(el);
            if (!result[cat]) {
                result[cat] = [];
            }
            result[cat].push(el);
        }
        var restFs = fs.slice(1);
        for(var i in result) {
            result[i] = group(result[i], restFs);
        }
        return result;
    }
    else {
        return ar;
    }
}

function sort(data, fs) {
    return mapGroup(data, (group) => (
        group.sort((x,y) => {
            var result = 0;
            for (var i = 0; i < fs.length; i++) {
                var f = fs[i];
                result = f(x,y);
                if(result!=0) break;
            }
            return result;
        })
    ));
}

function hideFields(data, fields) {
    return map(data, (row) => {
        var result = {};
        for(var i in row) {
            if(fields.indexOf(i)==-1) {
                result[i] = row[i];
            }
        }
        return result;
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

module.exports.mapGroup = mapGroup;
module.exports.map = map;

module.exports.group = group;
module.exports.sort = sort;
module.exports.hideFields = hideFields;
module.exports.showFields = showFields;