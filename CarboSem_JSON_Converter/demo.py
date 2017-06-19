# Copyright 2017 Carlo Attardi
import CarboSem_JSON_converter

demo="./demo_path/"

"""
the function "make_converter()" constructs a converter 
with file path as parameters (neo4jJSON pathfile, CarboSemJSON pathfile).
convert_to_carbosem() converts the input file in the output file.
"""
converter = CarboSem_JSON_converter.make_converter(demo+"neo4j_JSONs/result.json", demo+"static/json/data.json")
converter.convert_to_carbosem()

"""
manual change of attributes and conversion of the file pointed from first
into the file pointed from second (the first file is not deleted).
"""
converter.jsonDB = demo+"neo4j_JSONs/result(2).json"
converter.jsonCarboSem = demo+"static/json/data(2).json"
converter.convert_to_carbosem()

"""
the function "change_files_and_convert()" automatically changes attributes 
and convert the input file into the output file.
"""
converter.change_files_and_convert(demo+"neo4j_JSONs/result(1).json", demo+"static/json/data(1).json")

"""
simple conversion of the first file into the second without creating an object.
"""
CarboSem_JSON_converter.simple_conversion(demo+"neo4j_JSONs/result(3).json", demo+"static/json/data(3).json")
