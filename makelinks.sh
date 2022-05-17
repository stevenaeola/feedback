#!/bin/bash

ASSDIR=Prog/2122/Assignment\ 2
CLIENTDIR=client
CLIENTFILES=markscheme.json
for FILE in ${CLIENTFILES} ; do
    rm -f "${CLIENTDIR}/${FILE}"
    ln -s ~/"OneDrive - Durham University/Teaching/${ASSDIR}/${FILE}" ${CLIENTDIR}
done