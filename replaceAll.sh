#!/bin/bash
toReplace=$1
substituion=$2
rm -r toSed.txt
ls -1 ./src/schema/multiDecorators/*.ts >> toSed.txt
while read -r line;
do 
# src\/dal\/types\/wrappedSetMetadata
#..\/..\/dal\/types\/wrappedSetMetadata
    sed -i "s/$toReplace/$substitution/g" $line
done < toSed.txt 