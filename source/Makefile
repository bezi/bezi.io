# Makefile
# Author: Oscar Bezi
# Created: 01 May 2014
#============================

all:
	make update;

start:
	when-changed -r ./ -c 'make update;'

update:
	scss --update --stop-on-error scss/main.scss:../css/main.css;
	jade --pretty index.jade --out ../;
