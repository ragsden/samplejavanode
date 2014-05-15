#!/bin/sh
date1=$(date)

num=0
while test $num -le 4; do
	date2=$(date)
	num=$(($(date -d "$date2" "+%S")-$(date -d "$date1" "+%S")))
	echo $num
	sleep 1
done
ls