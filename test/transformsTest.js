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

describe('transforms', () =>  {
    describe('#mapGroup', () =>  {
        it('should do nothing with null', () =>  {
            expect(transforms.mapGroup(null, (x) => x)).to.be.deep.equal(null);
        });
        it('should do nothing with undefined', () =>  {
            expect(transforms.mapGroup(undefined, (x) => x)).to.be.deep.equal(undefined);
        });
        it('should do nothing with null, if function is not supplied', () =>  {
            expect(transforms.mapGroup(null)).to.be.deep.equal(null);
        });
        it('should do nothing with undefined, if function is not supplied', () =>  {
            expect(transforms.mapGroup(undefined)).to.be.deep.equal(undefined);
        });
        it('should group any structures to itself, if function is not supplied', () =>  {
            expect(transforms.mapGroup(42)).to.be.deep.equal(42);
            expect(transforms.mapGroup("")).to.be.deep.equal("");
            expect(transforms.mapGroup(true)).to.be.deep.equal(true);
            expect(transforms.mapGroup([1,2,3])).to.be.deep.equal([1,2,3]);
            expect(transforms.mapGroup({a:42})).to.be.deep.equal({a:42});
            expect(transforms.mapGroup({a:[1,2,3],b:{b1:42,b2:[4,5]}})).to.be.deep.equal({a:[1,2,3],b:{b1:42,b2:[4,5]}});
        });
        it('should map primitives to itself', () =>  {
            expect(transforms.mapGroup(42, (x) => x * -1)).to.be.deep.equal(42);
            expect(transforms.mapGroup("abc", (x) => x + x)).to.be.deep.equal("abc");
            expect(transforms.mapGroup(true, (x) => !x)).to.be.deep.equal(true);
        });
        it('should map empty object to itself', () =>  {
            expect(transforms.mapGroup({}, (x) => x + x)).to.be.deep.equal({});
        });
        it('should fold arrays to scalars', () =>  {
            expect(transforms.mapGroup([3,4,5], (arr) => arr.length)).to.be.equal(3);
        });
        it('should fold deeply nested arrays to scalars', () =>  {
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
        it('should fold any plain JSON', () =>  {
            var data = {
                a: "str",
                b: {
                    b1: [4,5],
                    b2: true
                },
                c: 42
            };
            var f = (group) => group.length;
            var expected = {
                a: "str",
                b: {
                    b1: 2,
                    b2: true
                },
                c: 42
            };
            expect(transforms.mapGroup(data, f)).to.be.deep.equal(expected);
        });
    });


    describe('#map', () =>  {
        it('should do nothing with null', () =>  {
            expect(transforms.map(null, (x) => x)).to.be.deep.equal(null);
        });
        it('should do nothing with undefined', () =>  {
            expect(transforms.map(undefined, (x) => x)).to.be.deep.equal(undefined);
        });
        it('should do nothing with null, if function is not supplied', () =>  {
            expect(transforms.map(null)).to.be.deep.equal(null);
        });
        it('should do nothing with undefined, if function is not supplied', () =>  {
            expect(transforms.map(undefined)).to.be.deep.equal(undefined);
        });
        it('should map any structures to itself, if function is not supplied', () =>  {
            expect(transforms.map(42)).to.be.deep.equal(42);
            expect(transforms.map("")).to.be.deep.equal("");
            expect(transforms.map(true)).to.be.deep.equal(true);
            expect(transforms.map([1,2,3])).to.be.deep.equal([1,2,3]);
            expect(transforms.map({a:42})).to.be.deep.equal({a:42});
            expect(transforms.map({a:[1,2,3],b:{b1:42,b2:[4,5]}})).to.be.deep.equal({a:[1,2,3],b:{b1:42,b2:[4,5]}});
        });
        it('should map primitives to itself', () =>  {
            expect(transforms.map(42, (x) => x * -1)).to.be.deep.equal(42);
            expect(transforms.map("abc", (x) => x + x)).to.be.deep.equal("abc");
            expect(transforms.map(true, (x) => !x)).to.be.deep.equal(true);
        });
        it('should map empty object to itself', () =>  {
            expect(transforms.map({}, (x) => x + x)).to.be.deep.equal({});
        });
        it('should properly map arrays', () =>  {
            expect(transforms.map([3,4,5], (x) => x * x)).to.be.deep.equal([9,16,25]);
        });
        it('should map any plain JSON', () =>  {
            var data = {
                a: "str",
                b: {
                    b1: [4,5],
                    b2: true
                },
                c: 42
            };
            var f = (x) => x * x;
            var expected = {
                a: "str",
                b: {
                    b1: [16,25],
                    b2: true
                },
                c: 42
            };
            expect(transforms.map(data, f)).to.be.deep.equal(expected);
        });
    });

    describe('#filter', () => {
        it('should do nothing with null', () =>  {
            expect(transforms.filter(null, (x) => x)).to.be.deep.equal(null);
        });
        it('should do nothing with undefined', () =>  {
            expect(transforms.filter(undefined, (x) => x)).to.be.deep.equal(undefined);
        });
        it('should do nothing with null, if function is not supplied', () =>  {
            expect(transforms.filter(null)).to.be.deep.equal(null);
        });
        it('should do nothing with undefined, if function is not supplied', () =>  {
            expect(transforms.filter(undefined)).to.be.deep.equal(undefined);
        });
        it('should filter primitive values to itself', () =>  {
            expect(transforms.filter(42)).to.be.equal(42);
            expect(transforms.filter("")).to.be.equal("");
            expect(transforms.filter(true)).to.be.equal(true);
        });
        it('should filter empty arrays to itself', () =>  {
            expect(transforms.filter({}, (x) => true)).to.be.deep.equal({});
        });
        it('should filter empty objects to itself', () =>  {
            expect(transforms.filter({}, (x) => true)).to.be.deep.equal({});
        });
        it('should filter empty arrays to itself, when function is not supplied', () =>  {
            //expect(transforms.filter([])).to.be.deep.equal([]);
        });
        it('should filter empty objects to itself, when function is not supplied', () =>  {
            expect(transforms.filter({})).to.be.deep.equal({});
        });
        it('should filter simple arrays properly with single function', () =>  {
            var data = [1,2,3,4,5];
            var f = (x) => x >= 3;
            var expected = [3,4,5];
            expect(transforms.filter(data, f)).to.be.deep.equal(expected);
        });
        it('should filter simple arrays properly with multiple functions', () =>  {
            var data = [1,2,3,4,5];
            var fs = [
                (x) => x > 2,
                (x) => x < 4,
            ];
            var expected = [3];
            expect(transforms.filter(data, fs)).to.be.deep.equal(expected);
        });
        it('should filter arrays, nested in tree', () =>  {
            var data = {
                a:[1,2,3,4,5],
                b:42
            };
            var fs = [
                (x) => x > 2,
                (x) => x < 4,
            ];
            var expected = {
                a:[3],
                b:42
            };
            expect(transforms.filter(data, fs)).to.be.deep.equal(expected);
        });
    });

    describe('#clear', () =>  {
        it('should do nothing with null', () =>  {
            expect(transforms.clear(null)).to.be.deep.equal(null);
        });
        it('should do nothing with undefined', () =>  {
            expect(transforms.clear(undefined)).to.be.deep.equal(undefined);
        });
        it('should clear primitive values to itself', () =>  {
            expect(transforms.clear(42)).to.be.equal(42);
            expect(transforms.clear("")).to.be.equal("");
            expect(transforms.clear(true)).to.be.equal(true);
        });
        it('should clear empty object to empty object', () =>  {
            expect(transforms.clear({})).to.be.deep.equal({});
        });
        it('should clear empty array to empty array', () =>  {
            expect(transforms.clear([])).to.be.deep.equal([]);
        });
        it('should clear non-empty array to itself', () =>  {
            expect(transforms.clear([3,4,5])).to.be.deep.equal([3,4,5]);
        });
        it('should clear deep nested tree to itself', () =>  {
            var source = {
                a: [1, 2, 3],
                b: {b1: {b11:"test"}, b2: 42},
                c: [4,5]
            };
            expect(transforms.clear(source)).to.be.deep.equal(source);
        });
        it('should clear nested empty objects to empty object', () =>  {
            var cleared = transforms.clear({a:{},b:{b1:{},b2:{}},c:[]});
            expect(cleared).to.be.deep.equal({});
        });
        it('should clear tree, nested in non-empty tree', () =>  {
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

    describe('#group', () => {
        it('should do nothing with null', () =>  {
            expect(transforms.group(null, (x) => x)).to.be.deep.equal(null);
        });
        it('should do nothing with undefined', () =>  {
            expect(transforms.group(undefined, (x) => x)).to.be.deep.equal(undefined);
        });
        it('should do nothing with null, if function is not supplied', () =>  {
            expect(transforms.group(null)).to.be.deep.equal(null);
        });
        it('should do nothing with undefined, if function is not supplied', () =>  {
            expect(transforms.group(undefined)).to.be.deep.equal(undefined);
        });
        it('should group any structures to itself, if functions are not supplied', () =>  {
            expect(transforms.group({a:[1,2,3],b:{b1:42,b2:[4,5]}})).to.be.deep.equal({a:[1,2,3],b:{b1:42,b2:[4,5]}});
        });
        it('it should properly group table-like JSON by single function', () =>  {
            var data = [
                {age:21,firstName:"John",lastName:"Doe"},
                {age:21,firstName:"Ann",lastName:"Brown"},
                {age:24,firstName:"John",lastName:"Anderson"},
                {age:21,firstName:"John",lastName:"Hitchens"}
            ];

            var fs = (row) => row.age;

            var expected = {
                21: [{age: 21, firstName: "John", lastName: "Doe"},
                    {age: 21, firstName: "Ann", lastName: "Brown"},
                    {age: 21, firstName: "John", lastName: "Hitchens"}],
                24: [{age: 24, firstName: "John", lastName: "Anderson"}]
            };

            expect(transforms.group(data, fs)).to.be.deep.equal(expected);
        });
        it('should group empty array to empty object', () =>  {
            expect(transforms.group([], (row) => 42)).to.be.deep.equal({});
        });
        it('should group empty object to empty object', () =>  {
            expect(transforms.group({}, (row) => 42)).to.be.deep.equal({});
        });
        it('should group table-like JSON by multiple functions properly', () =>  {
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

    describe('#sort', () => {
        it('should do nothing with null', () =>  {
            expect(transforms.sort(null, (x) => x)).to.be.deep.equal(null);
        });
        it('should do nothing with undefined', () =>  {
            expect(transforms.sort(undefined, (x) => x)).to.be.deep.equal(undefined);
        });
        it('should do nothing with null, if function is not supplied', () =>  {
            expect(transforms.sort(null)).to.be.deep.equal(null);
        });
        it('should do nothing with undefined, if function is not supplied', () =>  {
            expect(transforms.sort(undefined)).to.be.deep.equal(undefined);
        });
        it('should sort any structures to itself, if functions are not supplied', () =>  {
            expect(transforms.sort({a:[1,2,3],b:{b1:42,b2:[4,5]}})).to.be.deep.equal({a:[1,2,3],b:{b1:42,b2:[4,5]}});
        });
        it('should sort empty array to itself', () =>  {
            expect(transforms.sort([], (row) => -1)).to.be.deep.equal([]);
        });
        it('should group empty object to itself', () =>  {
            expect(transforms.group({}, (row) => 42)).to.be.deep.equal({});
        });
        it('should sort simple arrays properly', () =>  {
            var data = [3,2,5,4,1];
            var f = (x,y) => (x == y ? 0 : (x < y ? -1: 1));
            var expected = [1,2,3,4,5];
            expect(transforms.sort(data, f)).to.be.deep.equal(expected);
        });
        it('should properly sort arrays with by single function', () =>  {
            var data = [
                {age:21,firstName:"John",lastName:"Doe"},
                {age:21,firstName:"Ann",lastName:"Brown"},
                {age:24,firstName:"John",lastName:"Anderson"},
                {age:21,firstName:"John",lastName:"Hitchens"}
            ];

            var f = (row1,row2) => row1.lastName.localeCompare(row2.lastName);

            var expected = [
                {age:24,firstName:"John",lastName:"Anderson"},
                {age:21,firstName:"Ann",lastName:"Brown"},
                {age:21,firstName:"John",lastName:"Doe"},
                {age:21,firstName:"John",lastName:"Hitchens"}
            ];

            expect(transforms.sort(data, f)).to.be.deep.equal(expected);
        });
        it('should properly sort arrays with by multiple functions', () =>  {
            var data = [
                {age:21,firstName:"John",lastName:"Doe"},
                {age:21,firstName:"Ann",lastName:"Brown"},
                {age:24,firstName:"John",lastName:"Anderson"},
                {age:21,firstName:"John",lastName:"Hitchens"}
            ];

            var fs = [
                (row1,row2) => row1.firstName.localeCompare(row2.firstName),
                (row1,row2) => row2.lastName.localeCompare(row1.lastName)
            ];

            var expected = [
                {age:21,firstName:"Ann",lastName:"Brown"},
                {age:21,firstName:"John",lastName:"Hitchens"},
                {age:21,firstName:"John",lastName:"Doe"},
                {age:24,firstName:"John",lastName:"Anderson"},
            ];

            expect(transforms.sort(data, fs)).to.be.deep.equal(expected);
        });
        it('should properly sort arrays, nested in tree', () =>  {
            var data = {
                'a': [
                    {age:21,firstName:"John",lastName:"Doe"},
                    {age:21,firstName:"Ann",lastName:"Brown"},
                    {age:24,firstName:"John",lastName:"Anderson"},
                    {age:21,firstName:"John",lastName:"Hitchens"}
                ],
                'b': 42
            };

            var fs = [
                (row1,row2) => row1.firstName.localeCompare(row2.firstName),
                (row1,row2) => row2.lastName.localeCompare(row1.lastName)
            ];

            var expected = {
                'a': [
                    {age:21,firstName:"Ann",lastName:"Brown"},
                    {age:21,firstName:"John",lastName:"Hitchens"},
                    {age:21,firstName:"John",lastName:"Doe"},
                    {age:24,firstName:"John",lastName:"Anderson"},
                ],
                'b': 42
            };

            expect(transforms.sort(data, fs)).to.be.deep.equal(expected);
        })
    });

    describe('#hideFields', () => {
        it('should do nothing with null', () =>  {
            expect(transforms.hideFields(null, ["age"])).to.be.deep.equal(null);
        });
        it('should do nothing with undefined', () =>  {
            expect(transforms.hideFields(undefined, ["age"])).to.be.deep.equal(undefined);
        });
        it('should do nothing with null, if fields are not supplied', () =>  {
            expect(transforms.hideFields(null)).to.be.deep.equal(null);
        });
        it('should do nothing with undefined, if fields are  not supplied', () =>  {
            expect(transforms.hideFields(undefined)).to.be.deep.equal(undefined);
        });
        it('should do nothing with primitive values, when list of fields is not supplied', () =>  {
            expect(transforms.hideFields("abc")).to.be.deep.equal("abc");
            expect(transforms.hideFields(42)).to.be.deep.equal(42);
            expect(transforms.hideFields(true)).to.be.deep.equal(true);
        });
        it('should do nothing with primitive values, when list of fields is supplied', () =>  {
            expect(transforms.hideFields("abc", ["age"])).to.be.deep.equal("abc");
            expect(transforms.hideFields(42, ["age"])).to.be.deep.equal(42);
            expect(transforms.hideFields(true, ["age"])).to.be.deep.equal(true);
        });
        it('should do nothing with tree, when list of fields is not supplied', () =>  {
            expect(transforms.hideFields({a:[1,2,3],b:{b1:42}})).to.be.deep.equal({a:[1,2,3],b:{b1:42}});
        });
        it('should hide fields in simple object array', () =>  {
            var data = [
                {age:21,firstName:"John",lastName:"Doe"},
                {age:21,firstName:"Ann",lastName:"Brown"},
                {age:24,firstName:"John",lastName:"Anderson"},
                {age:21,firstName:"John",lastName:"Hitchens"}
            ];
            var fields = ['age', 'firstName'];
            var expected = [
                {lastName:"Doe"},
                {lastName:"Brown"},
                {lastName:"Anderson"},
                {lastName:"Hitchens"}
            ];
            expect(transforms.hideFields(data, fields)).to.be.deep.equal(expected);
        });
        it('should hide fields in nested object arrays', () =>  {
            var data = {a:[
                {age:21,firstName:"John",lastName:"Doe"},
                {age:21,firstName:"Ann",lastName:"Brown"},
                {age:24,firstName:"John",lastName:"Anderson"},
                {age:21,firstName:"John",lastName:"Hitchens"}
            ]};
            var fields = ['age', 'firstName'];
            var expected = {a:[
                {lastName:"Doe"},
                {lastName:"Brown"},
                {lastName:"Anderson"},
                {lastName:"Hitchens"}
            ]};
            expect(transforms.hideFields(data, fields)).to.be.deep.equal(expected);
        });
    });

    describe('#showFields', () => {
        it('should do nothing with null', () =>  {
            expect(transforms.showFields(null, ["age"])).to.be.deep.equal(null);
        });
        it('should do nothing with undefined', () =>  {
            expect(transforms.showFields(undefined, ["age"])).to.be.deep.equal(undefined);
        });
        it('should do nothing with null, if fields are not supplied', () =>  {
            expect(transforms.showFields(null)).to.be.deep.equal(null);
        });
        it('should do nothing with undefined, if fields are  not supplied', () =>  {
            expect(transforms.showFields(undefined)).to.be.deep.equal(undefined);
        });
        it('should do nothing with primitive values, when list of fields is not supplied', () =>  {
            expect(transforms.showFields("abc")).to.be.deep.equal("abc");
            expect(transforms.showFields(42)).to.be.deep.equal(42);
            expect(transforms.showFields(true)).to.be.deep.equal(true);
        });
        it('should do nothing with primitive values, when list of fields is supplied', () =>  {
            expect(transforms.showFields("abc", ["age"])).to.be.deep.equal("abc");
            expect(transforms.showFields(42, ["age"])).to.be.deep.equal(42);
            expect(transforms.showFields(true, ["age"])).to.be.deep.equal(true);
        });
        it('should show fields in simple object array', () =>  {
            var data = [
                {age:21,firstName:"John",lastName:"Doe"},
                {age:21,firstName:"Ann",lastName:"Brown"},
                {age:24,firstName:"John",lastName:"Anderson"},
                {age:21,firstName:"John",lastName:"Hitchens"}
            ];
            var fields = ['age', 'firstName'];
            var expected = [
                {age:21,firstName:"John"},
                {age:21,firstName:"Ann"},
                {age:24,firstName:"John"},
                {age:21,firstName:"John"}
            ];
            expect(transforms.showFields(data, fields)).to.be.deep.equal(expected);
        });
        it('should show fields in nested object arrays', () =>  {
            var data = {a:[
                {age:21,firstName:"John",lastName:"Doe"},
                {age:21,firstName:"Ann",lastName:"Brown"},
                {age:24,firstName:"John",lastName:"Anderson"},
                {age:21,firstName:"John",lastName:"Hitchens"}
            ]};
            var fields = ['age', 'firstName'];
            var expected = {a:[
                {age:21,firstName:"John"},
                {age:21,firstName:"Ann"},
                {age:24,firstName:"John"},
                {age:21,firstName:"John"}
            ]};
            expect(transforms.showFields(data, fields)).to.be.deep.equal(expected);
        });
    });

});