#!/bin/bash
# @file config-merge.sh
# @brief Merges any changes in the config files to the git repo assumed to be
#    checked out to ~/dev/bezi.github.io, then pushes.
# @author Oscar Bezi (oscar@bezi.io)
# @since 8 June 2014
#===============================================================================
echo "Merging in new config changes. . .";
REPO_LOC="~/dev/bezi.github.io";

FILES=".bashrc .ssh/config .bash_aliases .vimrc"; 

CHANGED="NO";
for file in $FILES; do 
    diff ~/$file $REPO_LOC/utils/$file > /dev/null; 
    if [ "$?" != "0" ]; then
	CHANGED="YES";
        echo cp ~/$file $REPO_LOC/utils/;
    fi
done

if [ "$CHANGED" == "YES" ]; then
    cd $REPO_LOC;

    MSG="Automatic merge in by config-merge on $HOSTNAME";

    echo git commit -am $MSG;
    echo git push; 
fi
