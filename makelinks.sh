#!/bin/bash

ASSDIR=Prog/2324/Assignment\ 1/peer_analysis
CLIENTDIR=client
CLIENTFILES="markscheme.json comments.csv peer_grades.csv"
for FILE in ${CLIENTFILES} ; do
    rm -f "${CLIENTDIR}/${FILE}"
    ln -s ~/"OneDrive - Durham University/Teaching/${ASSDIR}/${FILE}" ${CLIENTDIR}
done