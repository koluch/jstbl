# jstbl
[![Build Status](https://travis-ci.org/koluch/jstbl.svg)](https://travis-ci.org/koluch/jstbl)

Tool for printing JSON data in a table manner

## Example

Suppose we have following JSON file

```js
[
    {"id":1,"firstName":"John","lastName":"Adamson","gender":"male","age":18},
    {"id":2,"firstName":"Alice","lastName":"Oswald","gender":"female","age":18},
    {"id":3,"firstName":"John","lastName":"Arden","gender":"male","age":18},
    {"id":2,"firstName":"Lisa","lastName":"See","gender":"female","age":18},
    {"id":3,"firstName":"Paul","lastName":"Willis","gender":"male","age":18},
    {"id":2,"firstName":"Alice","lastName":"Meynell","gender":"female","age":18},
    {"id":3,"firstName":"Paul","lastName":"Ableman","gender":"male","age":18},
    {"id":2,"firstName":"Lisa","lastName":"Gardner","gender":"female","age":18},
    {"id":3,"firstName":"John","lastName":"Aikin","gender":"male","age":18},
    {"id":3,"firstName":"Paul","lastName":"Wilkinson","gender":"male","age":18},
    {"id":2,"firstName":"Mary","lastName":"Berry","gender":"female","age":18},
    {"id":2,"firstName":"Alice","lastName":"Curwen","gender":"female","age":18},
    {"id":3,"firstName":"Paul","lastName":"Williams","gender":"male","age":18}
]
```

We can print it as a table using `jstbl`:

![Simple displaying](misc/screen1.png)

Also, it is possible to apply some processing commands before printing:  

![Advanced displaying](misc/screen2.png)

## Instalation
```
$ sudo npm install jstbl -g
```

## Usage
Tool CLI is follow:

```
jstbl <cmd1>:<arg1>,<arg1> <cmd2>:<arg1>,<arg1> ...
```

All commands applied to data in the supplied order. Full list of available commands is follow:

* `sort:<field1>,<field2>,...` - sorts data by supplied fields. It is possible to use `desc` order, specifying `-`
   sign at the end of field name (e. g. `age-`)
   
* `group:<field1>,<field2>` - turns arrays to objects, which keys are values of supplied fields.

* `hide:<field1>,<field2>` - removes specified fields from output

* `show:<field1>,<field2>` - opposite to hide, shows only specified fields

* `filder:<field1><op><value>,<field2><op><value>` - filters data by comparing specified rows fields, using
   operator `<op>` and value `<value>` to compare         
