CarboSem_JSON_Converter

This package provide a script that allows to convert neo4j JSONs to the CarboSem's JSON format.

The conversion is automatically made by running "python3.4 conversion.py", a file that exploits the CarboSem_JSON_Converter.py object contained
in the "Entity" folder. 

The conversion takes in input a file called "result.json" into the folder "neo4j_JSON" and returns a file called "data.json"
inside the folder ../../CarboSem/static/json/data.json (folders "CarboSem" and "CarboSem-Scripts" should be in the same folder).

A demonstration script ("demo.py") explains how the "Entity/CarboSem_JSON_Converter.py" could works.
