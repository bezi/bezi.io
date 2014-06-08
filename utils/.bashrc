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
    local LENGTH="$COLUMNS"; # number of dashed to fill the line
    local STATUS=$1; # status of last command ran
    local REPO_INFO=""; # status message from a repo, be it svn or git
    local LINE_COLOR="$Blue";

    # make sure to subtract 3 from length every time this is called
    function wrap_things {
        echo "$Purple[$1$Purple]$LINE_COLOR─";
    }

    
    # Information string
    LENGTH=$(($LENGTH - 2 - ${#USER} - ${#HOSTNAME} - 3));
    INFO=`wrap_things $Yellow$USER$White::$Green$HOSTNAME`; 

    # Repository information
    local GIT_INFO=`git status 2>&1`;
    
    if [ "`echo $GIT_INFO | awk '{print $1}'`" != "fatal:" ]; then
        # we're in a git repo
        local REPO_NAME=`git rev-parse --show-toplevel 2>&1 | awk '{print $1}'`;
        REPO_NAME="${REPO_NAME##*/}";
        local REPO_TYPE="git";
        local REPO_BRANCH=`echo $GIT_INFO | grep 'On branch' | awk '{print $3}'`;
        local STATUS_COLOR=`echo $GIT_INFO | grep 'nothing to commit'`;
        local AHEAD=`echo $GIT_INFO | grep "ahead" | awk '{ print $(NF - 1) }'`;
        
        if [ "$STATUS_COLOR" == "" ]; then
            STATUS_COLOR="$Red";
        else
            STATUS_COLOR="$Green";
        fi

        LENGTH=$(($LENGTH - ${#REPO_TYPE} - 2));
        REPO_INFO="$Yellow$REPO_TYPE$White::";

        LENGTH=$(($LENGTH - ${#REPO_NAME} - 2));
        REPO_INFO="$REPO_INFO$STATUS_COLOR$REPO_NAME$White::";

        LENGTH=$(($LENGTH - ${#REPO_BRANCH})); 
        REPO_INFO="$REPO_INFO$STATUS_COLOR$REPO_BRANCH";

        if [ "$AHEAD" != "" ]; then
            LENGTH=$(($LENGTH - ${#Ahead} - 3));
            REPO_INFO="$REPO_INFO$BCyan(+$AHEAD)";
        fi
        LENGTH=$(($LENGTH - 3));
        REPO_INFO=`wrap_things $REPO_INFO`;
    fi

    # Location info
    LOCATION=${PWD##*/};
    if [[ "$LOCATION" == "$USER" ]]; then
        LOCATION="~";
    fi

    LENGTH=$(($LENGTH - ${#LOCATION} - 3));
    LOCATION=`wrap_things $White$LOCATION`;

    # Status codes
    if [ "$STATUS" == "0" ]; then
        STATUS="$Green:)";
    else
        STATUS="$Red:(";
    fi
    LENGTH=$(($LENGTH - 2 - 3));
    STATUS=`wrap_things $STATUS`;

    # combine the first bits
    LENGTH=$(($LENGTH - 2));
    PROMPT="$LINE_COLOR┌─$INFO$REPO_INFO$LOCATION$LINE_COLOR";

    # the ─┘ characters at the end
    LENGTH=$(($LENGTH - 2));
    
    # fill up the rest of the line
    while [ $LENGTH -gt 0 ]; do
        PROMPT="$PROMPT─";
        LENGTH=$((LENGTH - 1));
    done;

    PROMPT="$PROMPT$STATUS$LINE_COLOR─┘";

    # second line
    PROMPT="$PROMPT\n$LINE_COLOR└─"
    PROMPT="$PROMPT`wrap_things $White\\\!`"
    PROMPT="$PROMPT$LINE_COLOR──╼"
    printf "$PROMPT$White ";
}

# it's a prompt command to make it execute properly every time
PROMPT_COMMAND='PS1="$(bash_prompt $?)"';
