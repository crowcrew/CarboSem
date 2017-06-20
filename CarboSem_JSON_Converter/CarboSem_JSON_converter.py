# Copyright 2017 Carlo Attardi
import json


class CarboSem_JSON_converter(object):
    jsonDB = None
    jsonCarboSem = None

    def __init__(self, jsonFileToConvert, jsonFileToSend):
        self.jsonDB = jsonFileToConvert
        self.jsonCarboSem = jsonFileToSend

    def change_files_and_convert(self, jsonFileToConvert, jsonFileToSend):
        self.jsonDB = jsonFileToConvert
        self.jsonCarboSem = jsonFileToSend
        self.convert_to_carbosem()

    def convert_to_carbosem(self):
        with open(self.jsonDB) as data_file:
            data = json.load(data_file)

        assoc = {}
        nodes = []
        for i in data['data']:
            for j in i['graph']['nodes']:
                if j['id'] not in assoc:
                    nodes.append({"label": j['labels'][0], "title": 'Name: ' + j['properties']['name'] + ', Species: ' + j['properties']['species'] + ', Accession number: ' + j['properties']['name']})
                    assoc[j['id']] = len(nodes) - 1

        for i in data['data']:
            for j in i['graph']['relationships']:
                if 'targets' not in nodes[assoc[j['startNode']]]:
                    nodes[assoc[j['startNode']]].update(
                        {"targets": [{"type": j['properties']['name'], "target": assoc[j['endNode']]}]})
                else:
                    nodes[assoc[j['startNode']]]["targets"].append(
                        {"type": j['properties']['name'], "target": assoc[j['endNode']]})

        nodes = {"nodes": nodes}

        with open(self.jsonCarboSem, 'w') as fp:
            json.dump(nodes, fp)


def make_converter(jsonFileToConvert, jsonFileToSend):
    converter=CarboSem_JSON_converter(jsonFileToConvert, jsonFileToSend)
    return converter


def simple_conversion(jsonFileToConvert, jsonFileToSend):
    converter = CarboSem_JSON_converter(jsonFileToConvert, jsonFileToSend)
    converter.convert_to_carbosem()
