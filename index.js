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
 *
 * Author:  Nikolay Mavrenkov <koluch@koluch.ru>
 * Created: 26.11.2015 01:03
 */
"use strict";
/**
 * --------------------------------------------------------------------
 * Copyright 2015 Nikolay Mavrenkov
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * --------------------------------------------------------------------
 *
 * Author:  Nikolay Mavrenkov <koluch@koluch.ru>
 * Created: 16.11.2015 02:14
 */

/**
 * example: node show_data.js data.json --group=data_size,threshold --show=data_size,threshold,bench,score,error,units --sort=bench-
 */

var fs = require("fs");

/*
 Basic table-data manipulation functions
 */
function forGroup(data, f) {
    if(data.constructor === Array) {
        return f(data.slice());
    }
    else {
        var result = {};
        for(var i in data) {
            result[i] = forGroup(data[i], f);
        }
        return result;
    }
}

function tmap(data, f) {
    return forGroup(data, (group) => group.map(f));
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
    return forGroup(data, (group) => (
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
    return tmap(data, (row) => {
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
    return tmap(data, (row) => {
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


/*
 aux
 */
function collectHeader(data) {
    var result = [];
    tmap(data, row => {
        Object.keys(row).forEach((key) => {
            if(result.indexOf(key)==-1) {
                result.push(key)
            }
        });
    });
    return result;
}

function collectWidthMap(data, header) {
    header = header || [];
    var result = {};

    tmap(data, row => {
        for(var i in row) {
            result[i] = Math.max(result[i] || 0, ('' + (row[i] || '')).length);
        }
    });
    header.forEach((col) => {result[col] = Math.max(result[col] || 0, col.length)});
    return result;
}

function comp(v1, v2) {
    if(v1 == v2) return 0;
    if(v1 == undefined) return -1;
    if(v2 == undefined) return 1;
    var asNumber1 = new Number(v1);
    var asNumber2 = new Number(v2);
    if(!isNaN(asNumber1) && !isNaN(asNumber2)) {
        return asNumber1 - asNumber2;
    }
    else {
        return v1.localeCompare(v2);
    }
}




function commaVals(arg) {
    return arg === undefined ? [] : arg.split(",")
}

/*
  API
*/

var margin = 3 + 4;
exports.print = function(data, args){

    // Process data according to arguments
    args.forEach((arg) => {
        switch(arg.name) {
            case "group": {
                var groupFs = commaVals(arg.value).map(group => (row => row[group]));
                data = group(data, groupFs);
                break;
            }
            case "sort": {
                var sortF = commaVals(arg.value).map(field => {
                    var desc = false;
                    if(/[\+\-]$/.test(field)) {
                        desc = field.charAt(field.length - 1) === "-";
                        field = field.substr(0, field.length - 1);
                    }
                    return ((row1, row2) => {
                        return comp(row1[field], row2[field]) * (desc ? -1 : 1)
                    })
                });
                data = sort(data, sortF);
                break;
            }
            case "hide": {
                data = hideFields(data, commaVals(arg.value));
                break;
            }
            case "show": {
                data = showFields(data, commaVals(arg.value));
                break;
            }
            default: throw new Error("Unknown argument: " + arg.name)
        }
    });

    // Print result data
    var header = collectHeader(data);
    var widthMap = collectWidthMap(data, header);

    function printColumn(str, length) {
        str = '' + str;
        for(var i = str.length; i<length; ++i) {
            str+=" ";
        }
        return str;
    }

    function aux(data, indent) {
        if(data.constructor === Array) {
            var firstRow = data[0];
            if(firstRow) {
                var str = "";
                for(var k = 0; k<indent; k++) {str += "    ";}
                header.forEach((col) => {
                    str += printColumn("~" + col + "~", widthMap[col] + margin);
                });
                console.log(str);
            }
            for (var i = 0; i < data.length; i++) {
                var str = "";
                for(var k = 0; k<indent; k++) {str += "    ";}
                var row = data[i];
                header.forEach((col) => {
                    str += printColumn(row[col] || "...", widthMap[col] + margin);
                });
                console.log(str);
            }
        }
        else {
            for(var i in data) {
                var str = "";
                for(var k = 0; k<indent; k++) {str += "    ";}
                console.log(str + i + ":");
                aux(data[i], indent + 1)
            }
        }
    }

    aux(data, 0);
};

