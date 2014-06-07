#!/bin/bash
# @file init.sh
# @brief Initialisation file to be run to set up some preferences for the first 
#   time on a new Linux PC
# @author Oscar Bezi (oscar@bezi.io)
# @since 6 June 2014
#===============================================================================

# download files and stick them in the right places, then source the ~/.bashrc
# note that I didn't get a .bash_locations: this is a per-computer file
echo "Downloading files. . .";
cd ~/;

$URL_ROOT='http://bezi.io/utils';
# .bashrc
wget -nv -O ~/.bashrc $URL_ROOT/.bashrc;
# .bash_aliases
wget -nv -O ~/.bash_aliases $URL_ROOT/.bash_aliases;
# .vimrc
wget -nv -O ~/.vimrc $URL_ROOT/.vimrc;
# .ssh/config
wget -nv -O ~/.ssh/config $URL_ROOT/.ssh/config;

echo "|-- Done!";

shopt -s expand_aliases;
source ~/.bashrc;


# git configuration
echo "Configuring git. . .";
gimme git;
git config --global user.name "Oscar Bezi";
git config --global user.email "oscar@bezi.io";
git config --global color.ui true;
git config --global push.default simple;
echo "|-- Done!";

# generate SSH keys and propagate them to the various things in ~/.ssh/config
echo "Distributing ssh keys. . .";
ssh-keygen -t rsa -N "" -f ~/.ssh/id_rsa;

for i in `cat ~/.ssh/config | grep "^host " | awk '{print $2}'`; do 
    echo "Adding keys to host $i. . .";
    echo ssh-copy-id $i; 
done

# add ssh keys to github: cannae automate :(
gimme xclip;
# from github; copies the key to my clipboard so I can go paste it into ffox
xclip -sel clip < ~/.ssh/id_rsa.pub

echo "  SSH key copied to clipboard.  Opening firefox to add to github. . ." &;
gimme firefox;
firefox https://github.com/settings/ssh;
echo "|-- Done!";

# installs my favourite font! :)
gimme atool;

COUSINE_URL='http://www.google.com/fonts/download?kit=M2CeFoF86bDfqp_rSFi-T6CWcynf_cDxXwCLxiixG1c';
wget -nv -O Cousine.zip $COUSINE_URL;
aunpack -q Cousine.zip;
mkdir -p ~/.fonts;
cp Cousine/*.ttf ~/.fonts;
sudo fc-cache -f;
rm Cousine.zip;
rm -rf Cousine/;
