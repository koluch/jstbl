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
 * Created: 28.11.2015 01:31
 */
var expect = require('chai').expect;

var transforms = require('../transforms');

describe('transforms', function () {
    describe('#mapGroup', function() {
        it('should group any structures to itself, if function is not supplied', function () {
            expect(transforms.mapGroup(42)).to.be.deep.equal(42);
            expect(transforms.mapGroup("")).to.be.deep.equal("");
            expect(transforms.mapGroup(true)).to.be.deep.equal(true);
            expect(transforms.mapGroup([1,2,3])).to.be.deep.equal([1,2,3]);
            expect(transforms.mapGroup({a:42})).to.be.deep.equal({a:42});
            expect(transforms.mapGroup({a:[1,2,3],b:{b1:42,b2:[4,5]}})).to.be.deep.equal({a:[1,2,3],b:{b1:42,b2:[4,5]}});
        });
        it('should map primitives properly', function () {
            expect(transforms.mapGroup(42, (x) => x * -1)).to.be.deep.equal(-42);
            expect(transforms.mapGroup("abc", (x) => x + x)).to.be.deep.equal("abcabc");
            expect(transforms.mapGroup(true, (x) => !x)).to.be.deep.equal(false);
        });
        it('should map empty object to itself', function () {
            expect(transforms.mapGroup({}, (x) => x + x)).to.be.deep.equal({});
        });
        it('should fold arrays to scalars', function () {
            expect(transforms.mapGroup([3,4,5], (arr) => arr.length)).to.be.equal(3);
        });
        it('should fold deeply nested arrays to scalars', function () {
            var data = {
                a: [1,2,3],
                b: {
                    b1: [4,5]
                }
            };
            var f = (arr) => arr.length;
            var expected = {
                a: 3,
                b: {
                    b1: 2
                }
            };
            expect(transforms.mapGroup(data, f)).to.be.deep.equal(expected);
        });
        it('should fold any plain JSON', function () {
            var data = {
                a: "str",
                b: {
                    b1: [4,5],
                    b2: true
                },
                c: 42
            };
            var f = (anything) => "~" + anything + "~";
            var expected = {
                a: "~str~",
                b: {
                    b1: "~4,5~",
                    b2: "~true~"
                },
                c: "~42~"
            };
            expect(transforms.mapGroup(data, f)).to.be.deep.equal(expected);
        });
    });


    describe('#map', function() {
        it('should map any structures to itself, if function is not supplied', function () {
            expect(transforms.map(42)).to.be.deep.equal(42);
            expect(transforms.map("")).to.be.deep.equal("");
            expect(transforms.map(true)).to.be.deep.equal(true);
            expect(transforms.map([1,2,3])).to.be.deep.equal([1,2,3]);
            expect(transforms.map({a:42})).to.be.deep.equal({a:42});
            expect(transforms.map({a:[1,2,3],b:{b1:42,b2:[4,5]}})).to.be.deep.equal({a:[1,2,3],b:{b1:42,b2:[4,5]}});
        });
        it('should map primitives properly', function () {
            expect(transforms.map(42, (x) => x * -1)).to.be.deep.equal(-42);
            expect(transforms.map("abc", (x) => x + x)).to.be.deep.equal("abcabc");
            expect(transforms.map(true, (x) => !x)).to.be.deep.equal(false);
        });
        it('should map empty object to itself', function () {
            expect(transforms.map({}, (x) => x + x)).to.be.deep.equal({});
        });
        it('should properly map arrays', function () {
            expect(transforms.map([3,4,5], (x) => x * x)).to.be.deep.equal([9,16,25]);
        });
        it('should map any plain JSON', function () {
            var data = {
                a: "str",
                b: {
                    b1: [4,5],
                    b2: true
                },
                c: 42
            };
            var f = (anything) => "~" + anything + "~";
            var expected = {
                a: "~str~",
                b: {
                    b1: ["~4~","~5~"],
                    b2: "~true~"
                },
                c: "~42~"
            };
            expect(transforms.map(data, f)).to.be.deep.equal(expected);
        });
    });

    describe('#filter', function(){});

    describe('#clear', function() {
        it('should clear primitive values to iteself', function () {
            expect(transforms.clear(42)).to.be.equal(42);
            expect(transforms.clear("")).to.be.equal("");
            expect(transforms.clear(true)).to.be.equal(true);
        });
        it('should clear empty object to empty object', function () {
            expect(transforms.clear({})).to.be.deep.equal({});
        });
        it('should clear empty array to empty array', function () {
            expect(transforms.clear([])).to.be.deep.equal([]);
        });
        it('should clear non-empty array to itself', function () {
            expect(transforms.clear([3,4,5])).to.be.deep.equal([3,4,5]);
        });
        it('should clear deep nested tree to itself', function () {
            var source = {
                a: [1, 2, 3],
                b: {b1: {b11:"test"}, b2: 42},
                c: [4,5]
            };
            expect(transforms.clear(source)).to.be.deep.equal(source);
        });
        it('should clear nested empty objects to empty object', function () {
            var cleared = transforms.clear({a:{},b:{b1:{},b2:{}},c:[]});
            expect(cleared).to.be.deep.equal({});
        });
        it('should clear tree, nested in non-empty tree', function () {
            var cleared = transforms.clear({
                a: [1,2,3],
                b: {b1: {}, b2: 42},
                c: []
            });
            var expected = {
                a: [1,2,3],
                b: {b2: 42}
            };
            expect(cleared).to.be.deep.equal(expected);
        });
    });

    describe('#group', function(){
        it('should group any structures to itself, if functions are not supplied', function () {
            expect(transforms.group({a:[1,2,3],b:{b1:42,b2:[4,5]}})).to.be.deep.equal({a:[1,2,3],b:{b1:42,b2:[4,5]}});
        });
        it('it should properly group table-like JSON by single function', function () {
            var data = [
                {age:21,firstName:"John",lastName:"Doe"},
                {age:21,firstName:"Ann",lastName:"Brown"},
                {age:24,firstName:"John",lastName:"Anderson"},
                {age:21,firstName:"John",lastName:"Hitchens"}
            ];

            var fs = [(row) => row.age];

            var expected = {
                21: [{age: 21, firstName: "John", lastName: "Doe"},
                    {age: 21, firstName: "Ann", lastName: "Brown"},
                    {age: 21, firstName: "John", lastName: "Hitchens"}],
                24: [{age: 24, firstName: "John", lastName: "Anderson"}]
            };

            expect(transforms.group(data, fs)).to.be.deep.equal(expected);
        });
        it('should group empty array to empty object', function () {
            expect(transforms.group([], [(row) => 42])).to.be.deep.equal({});
        });
        it('should group empty object to empty object', function () {
            expect(transforms.group({}, [(row) => 42])).to.be.deep.equal({});
        });
        it('should group table-like JSON by multiple functions properly', function () {
            var data = [
                {age:21,firstName:"John",lastName:"Doe"},
                {age:21,firstName:"Ann",lastName:"Brown"},
                {age:24,firstName:"John",lastName:"Anderson"},
                {age:21,firstName:"John",lastName:"Hitchens"}
            ];

            var fs = [(row) => row.age, (row) => row.firstName];

            var expected = {
                21: {'John': [{age: 21, firstName: "John", lastName: "Doe"},
                              {age: 21, firstName: "John", lastName: "Hitchens"}],
                      'Ann': [{age: 21, firstName: "Ann", lastName: "Brown"}]},
                24: {'John': [{age: 24, firstName: "John", lastName: "Anderson"}]}
            };

            expect(transforms.group(data, fs)).to.be.deep.equal(expected);
        });
    });

    describe('#sort', function(){});

    describe('#hideFields', function(){});

    describe('#showFields', function(){});

    describe('#map', function() {});
});