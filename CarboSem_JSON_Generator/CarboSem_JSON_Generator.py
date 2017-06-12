# Copyrights 2017 Dima Mhrez & Aly Shmahell

import sys
import json
import random

types = ["rna22","pictar","path", "dis"]
labels=["microRNA","pathway","DNA","disease"]

for j in range(0,10):
	nodes= []
	for i in range (0,random.randint(100,1000)):
		targets =[]
		for i in range(0,random.randint(1,3)):
			targets.append({"target":random.randint(0,3),"type":types[random.randint(0,3)]})
		nodes.append({"label":labels[random.randint(0,3)],"title":labels[random.randint(0,3)]+str(i),"targets":targets})

	jsoncon={"nodes":nodes}

	with open("data"+str(j)+".json","w") as datafile:
		json.dump(jsoncon,datafile)





