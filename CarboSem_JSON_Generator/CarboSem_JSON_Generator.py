# Copyrights 2017 Dima Mhrez & Aly Shmahell

import sys
import json
import random

types = ["rna22","pictar","path", "dis"]
labels=["microRNA","pathway","DNA","disease"]

for i in range(0,10):
	nodes= []
	for j in range (0,random.randint(100,1000)):
		targets =[]
		if(j>4):
			for k in range(j-4,random.randint(j-4,j-1)):
				targets.append({"target":random.randint(0,j-1),"type":types[random.randint(0,3)]})
		nodePar = labels[random.randint(0,3)]
		nodes.append({"label":nodePar,"title":nodePar+str(j),"targets":targets})

	jsoncon={"nodes":nodes}

	with open("data"+str(i)+".json","w") as datafile:
		json.dump(jsoncon,datafile)



