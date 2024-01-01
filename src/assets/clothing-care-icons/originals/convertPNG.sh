#!/bin/bash
ls -1 > fileList.txt
while read -r line; 
do
    newFile=$(sed "s/png/svg/" <<< "$line")
    echo $newFile
    convert $line $newFile
done < fileList.txt
rm -r fileList.txt