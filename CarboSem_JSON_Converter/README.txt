CarboSem_JSON_Converter

This package provide a script that allows to convert JSONs from neo4j to the CarboSem's JSON format.

The conversion is automatically made by running the linux command "python3 conversion.py".
"conversion.py" is a simple python script that exploits the CarboSem_JSON_converter.py object.

The conversion takes in input a file called "result.json" situated into the folder "neo4j_JSON" and returns a file called "data.json"
situated inside the folder ../../CarboSem/static/json/data.json (the folders "CarboSem" and "CarboSem-Scripts" should be in the same folder to make the script work properly).

A demonstration script ("demo.py") explains how the "CarboSem_JSON_converter.py" could work.
