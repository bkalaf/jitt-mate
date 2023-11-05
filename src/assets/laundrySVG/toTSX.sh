#!/bin/bash
ls -1 > fileList.txt *.js
while read -r line; 
do
    newFile=$(sed "s/js/tsx/" <<< "$line")
    echo $newFile
    mv $line $newFile
done < fileList.txt
rm -r fileList.txt