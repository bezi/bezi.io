#!/bin/bash
# @file init.sh
# @brief Initialisation file to be run to set up some preferences for the first 
#   time on a new Linux PC
# @author Oscar Bezi (oscar@bezi.io)
# @since 6 June 2014
#===============================================================================

# Because the alias file might not have the colours
GREEN='\e[1;92m'      # Green
YELLOW='\e[1;93m'     # Yellow
BLUE='\e[1;94m'       # Blue

# download files and stick them in the right places, then source the ~/.bashrc
# note that I didn't get a .bash_locations: this is a per-computer file
echo -e "${BLUE}Downloading files. . .";
cd /tmp/;

URL_ROOT='https://raw.githubusercontent.com/bezi/bezi.github.io/master/utils';
# .bashrc
wget -nv -O ~/.bashrc $URL_ROOT/.bashrc;
# .bash_aliases
wget -nv -O ~/.bash_aliases $URL_ROOT/.bash_aliases;
# .bash_prompt
wget -nv -O ~/.bash_prompt $URL_ROOT/.bash_prompt;
# .vimrc
wget -nv -O ~/.vimrc $URL_ROOT/.vimrc;
# .ssh/config
wget -nv -O ~/.ssh/config $URL_ROOT/.ssh/config;

echo -e "${GREEN}|-- Done!";

shopt -s expand_aliases;
source ~/.bashrc;

# programs I use a lot. gimme is an alias to the installer for the OS
echo -e "${BLUE}Installing programs. . .";
gimme vim;
gimme git;
gimme sshpass;
gimme xclip;
gimme atool;
gimme firefox;
echo -e "${GREEN}|-- Done!";

# git configuration
echo -e "${BLUE}Configuring git. . .";
git config --global user.name "Oscar Bezi";
git config --global user.email "oscar@bezi.io";
git config --global color.ui true;
git config --global push.default simple;
echo -e "${GREEN}|-- Done!";

# installs my favourite font! :)

echo -e "${BLUE}Installing Cousine. . .";
COUSINE_URL="$URL_ROOT/Cousine.zip";
wget -nv -O Cousine.zip $COUSINE_URL;
aunpack -q Cousine.zip;
mkdir -p ~/.fonts;
cp Cousine/*.ttf ~/.fonts;
sudo fc-cache -f;
rm Cousine.zip;
rm -rf Cousine/;
echo -e "${GREEN}|-- Done!";

# generate SSH keys and propagate them to the various things in ~/.ssh/config
echo -e "${BLUE}Distributing ssh keys. . .";
yes y | ssh-keygen -t rsa -N "" -f ~/.ssh/id_rsa;


# generate password files
for i in `cat ~/.ssh/config | grep "^host " | awk '{print $2}'`; do 
    read -s -p "Adding keys to host $i.  Password: " password;
    echo -e; # new line
    echo -e $password > $i.password
    sshpass -f $i.password ssh-copy-id $i > /dev/null 2>&1;
    
    STATUS=$?;
    if [ "$STATUS" == "5" ]; then
        echo -e "Wrong password!";
        while [ "$STATUS" == "5" ]; do
            read -s -p "Password: " password;
            echo -e; # new line
            echo -e $password > $i.password
            sshpass -f $i.password ssh-copy-id $i > /dev/null 2>&1;
            STATUS=$?;
            if [ "$STATUS" == "5" ]; then
                echo -e "Wrong password!";
                while [ "$STATUS" == "5" ]; do
                    read -s -p "Password: " password;
                    echo -e; # new line
                    echo -e $password > $i.password
                    sshpass -f $i.password ssh-copy-id $i > /dev/null 2>&1;
                    STATUS=$?;
                done;
            elif [ "$STATUS" == "0" ]; then
                echo -e "Success!";
            else 
                echo -e "FAILURE: STATUS $STATUS";
            fi
        done;
    elif [ "$STATUS" == "0" ]; then
        echo -e "Success!";
    else 
        echo -e "FAILURE: STATUS $STATUS";
    fi
    rm $i.password
    
done

# add ssh keys to github: cannae automate :(
# from github; copies the key to my clipboard so I can go paste it into ffox
xclip -sel clip < ~/.ssh/id_rsa.pub

echo -e "${YELLOW}|-- SSH key copied to clipboard.  Opening firefox to add to github. . ." ;
firefox https://github.com/settings/ssh &;
echo -e "${GREEN}|-- Done!";
echo -e "${GREEN}Setup complete!$No_color";
