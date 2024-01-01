#!/bin/bash
echo $1 
echo $2
grep -i -R "/$1';" # 2>&1 | tee -a /home/bobby/Desktop/jitt/jitt/logs/$2.txt

# program [arguments...] 2>&1 | tee outfile