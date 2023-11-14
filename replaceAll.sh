#!/bin/bash
rm -r toSed.txt
ls -1 ./src/schema/multiDecorators/*.ts >> toSed.txt
while read -r line;
do 
    sed -i 's/src\/dal\/types\/wrappedSetMetadata/..\/..\/dal\/types\/wrappedSetMetadata/g' $line
done < toSed.txt 