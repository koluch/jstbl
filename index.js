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

var chalk = require("chalk");

var transforms = require("./transforms");

/*
 aux
 */
function collectHeader(data) {
    var result = [];
    transforms.map(data, row => {
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

    transforms.map(data, row => {
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
exports.print = function(data, commands){

    // Process data according to arguments
    commands.forEach((arg) => {
        switch(arg.name) {
            case "filter": {
                var fieldExpList = commaVals(arg.value);
                // Generate functions for each expression from value list
                var fList = fieldExpList.map((exp) => {
                    var regExp = /^([^=<>]+)([=><]+)([^=<>]+)$/g;
                    var match = regExp.exec(exp);
                    if(match == null)  throw new Error("Bad expression format: " + exp);
                    var field = match[1];
                    var op = match[2];
                    var value = match[3];
                    var opF;
                    switch(op) {
                        case "=": opF = (v1,v2) => v1 === v2; break;
                        case ">": opF = (v1,v2) => v1 > v2; break;
                        case "<": opF = (v1,v2) => v1 < v2; break;
                        case ">=": opF = (v1,v2) => v1 >= v2; break;
                        case "<=": opF = (v1,v2) => v1 <= v2; break;
                        default: throw new Error("Unknown operator: " + op);
                    }
                    return (row) => opF(row[field], value);
                });
                // Make single filter function
                var filterF = (row) => fList.reduce((result,f) => !result ? result : f(row), true); // check row for all functions
                // Make transformation
                data = transforms.filter(data, filterF);
                break;
            }
            case "group": {
                var groupFs = commaVals(arg.value).map(group => (row => row[group]));
                data = transforms.group(data, groupFs);
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
                data = transforms.sort(data, sortF);
                break;
            }
            case "hide": {
                data = transforms.hideFields(data, commaVals(arg.value));
                break;
            }
            case "show": {
                data = transforms.showFields(data, commaVals(arg.value));
                break;
            }
            default: throw new Error("Unknown command: " + arg.name)
        }
    });

    // Clear data after transformation (to get rid of groups, which could be created after filtering)
    data = transforms.clear(data);

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
                    str += chalk.bold(printColumn(col, widthMap[col] + margin));
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

