#!/bin/bash
# @file ~/.bashrc
# @author Oscar Bezi (oscar@bezi.io)
# @since 5 June 2014
#===============================================================================

# add local directory to the PATH
export PATH="$PATH:.";

# don't put duplicate lines or lines starting with space in the history.
HISTCONTROL=ignoreboth

# append to the history file, don't overwrite it
shopt -s histappend
HISTSIZE=1000
HISTFILESIZE=2000

# check the window size after each command
shopt -s checkwinsize

# set default editor
export EDITOR="vim";

# load aliases, and make sure we can use them
if [ -f ~/.bash_aliases ]; then
    shopt -s expand_aliases;
    . ~/.bash_aliases;
fi

# load location shortcuts
if [ -f ~/.bash_locations ]; then
    . ~/.bash_locations;
fi

# customisation for the prompt
function bash_prompt {
    # make sure there's no scoping issues
    local LOCATION; # contains the output of `pwd`
    local INFO; # contains the username and hostname
    local PROMPT;
    local LENGTH; # length of the prompt without color codes

    LOCATION=${PWD##*/};
    if [[ "$LOCATION" == "$USER" ]]
    then
        LOCATION="~";
    fi
    
    LENGTH=$((2 + ${#LOCATION}));
    LOCATION="$Purple[$White$LOCATION$Purple]";

    LENGTH=$((4 + ${#USER} + ${#HOSTNAME} + $LENGTH));
    INFO="$Purple[$Yellow$USER$White::$Green$HOSTNAME$Purple]"; 

    LENGTH=$((3 + $LENGTH));
    PROMPT="$Blue┌─$INFO$Blue─$LOCATION$Blue";

    # fill up the rest of the line
    # the length of the prompt and the one character at the end
    COUNT=$(($COLUMNS - $LENGTH - 1));
    i=0
    while [ $COUNT -gt 0 ]; do
        PROMPT="$PROMPT─";
        COUNT=$((COUNT - 1));
    done;

    PROMPT="$PROMPT┘";

    # second line
    PROMPT="$PROMPT\n$Blue└─$Purple["
    PROMPT="$PROMPT$White\!"
    PROMPT="$PROMPT$Purple]$Blue──╼"
    printf "$PROMPT$White ";
}

# it's a prompt command to make it execute properly every time
PROMPT_COMMAND='PS1="$(bash_prompt)"';
