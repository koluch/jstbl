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
   sign at the end of field name (e. g. `age-`). Also, it is possible to specify `+` for `asc` ordering, which is default. 
   For example:
   ```bash
   $ cat data.json | jstbl sort:gender+,age-
   id       firstName       lastName        gender       age       
   4        Elizabeth       Berridge        female       34        
   12       Alice           Curwen          female       30        
   2        Alice           Oswald          female       28        
   6        Alice           Meynell         female       27        
   8        Elizabeth       Beverley        female       20        
   11       Mary            Berry           female       16        
   7        Paul            Ableman         male         38        
   13       Paul            Williams        male         32        
   9        John            Aikin           male         29        
   5        Paul            Willis          male         22        
   10       Paul            Wilkinson       male         19        
   3        John            Arden           male         19        
   1        John            Adamson         male         18        
   ``` 
   
* `group:<field1>,<field2>` - turns arrays to objects, which keys are values of supplied fields. For example:
    ```bash
    $ cat data.json | jstbl group:gender
    male:
        id       firstName       lastName        gender       age       
        1        John            Adamson         male         18        
        3        John            Arden           male         19        
        5        Paul            Willis          male         22        
        7        Paul            Ableman         male         38        
        9        John            Aikin           male         29        
        10       Paul            Wilkinson       male         19        
        13       Paul            Williams        male         32        
    female:
        id       firstName       lastName        gender       age       
        2        Alice           Oswald          female       28        
        4        Elizabeth       Berridge        female       34        
        6        Alice           Meynell         female       27        
        8        Elizabeth       Beverley        female       20        
        11       Mary            Berry           female       16        
        12       Alice           Curwen          female       30
    ``` 

* `hide:<field1>,<field2>` - removes specified fields from output. For example:
   ```bash
   $ cat data.json | jstbl hide:age,id,gender
   firstName       lastName        
   John            Adamson         
   Alice           Oswald          
   John            Arden           
   Elizabeth       Berridge        
   Paul            Willis          
   Alice           Meynell         
   Paul            Ableman         
   Elizabeth       Beverley        
   John            Aikin           
   Paul            Wilkinson       
   Mary            Berry           
   Alice           Curwen          
   Paul            Williams     
   ``` 

* `show:<field1>,<field2>` - opposite to hide, shows only specified fields. For example:
   ```bash
   $ cat data.json | jstbl show:firstName,lastName
   firstName       lastName        
   John            Adamson         
   Alice           Oswald          
   John            Arden           
   Elizabeth       Berridge        
   Paul            Willis          
   Alice           Meynell         
   Paul            Ableman         
   Elizabeth       Beverley        
   John            Aikin           
   Paul            Wilkinson       
   Mary            Berry           
   Alice           Curwen          
   Paul            Williams     
   ```    

* `filter:<field1><op><value>,<field2><op><value>` - filters data by comparing specified rows fields, using
   operator `<op>` and value `<value>` to compare. Supported operators: `<`, `>`, `<=`, `>=`. For example:
   
   ```bash
   $ cat data.json | jstbl "filter:gender=female,age>20"
   id       firstName       lastName       gender       age       
   2        Alice           Oswald         female       28        
   4        Elizabeth       Berridge       female       34        
   6        Alice           Meynell        female       27        
   12       Alice           Curwen         female       30    
   ```
