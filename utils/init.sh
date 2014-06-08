
echo "$BGreen|-- Done!";

shopt -s expand_aliases;
source ~/.bashrc;

# programs I use a lot. gimme is an alias to the installer for the OS
echo "$BBlueInstalling programs. . .";
gimme vim;
gimme git;
gimme sshpass;
gimme xclip;
gimme atool;
gimme firefox;
echo "$BGreen|-- Done!";

# git configuration
echo "$BBlueConfiguring git. . .";
git config --global user.name "Oscar Bezi";
git config --global user.email "oscar@bezi.io";
git config --global color.ui true;
git config --global push.default simple;
echo "$BGreen|-- Done!";

# installs my favourite font! :)

echo "$BBlueInstalling Cousine. . .";
COUSINE_URL="$URL_ROOT/Cousine.zip";
wget -nv -O Cousine.zip $COUSINE_URL;
aunpack -q Cousine.zip;
mkdir -p ~/.fonts;
cp Cousine/*.ttf ~/.fonts;
sudo fc-cache -f;
rm Cousine.zip;
rm -rf Cousine/;
echo "$BGreen|-- Done!";

# generate SSH keys and propagate them to the various things in ~/.ssh/config
echo "$BBlueDistributing ssh keys. . .";
yes y | ssh-keygen -t rsa -N "" -f ~/.ssh/id_rsa;


# generate password files
for i in `cat ~/.ssh/config | grep "^host " | awk '{print $2}'`; do 
    read -s -p "Adding keys to host $i.  Password: " password;
    echo; # new line
    echo $password > $i.password
    sshpass -f $i.password ssh-copy-id $i > /dev/null 2>&1;
    
    STATUS=$?;
    if [ "$STATUS" == "5" ]; then
        echo "Wrong password!";
        while [ "$STATUS" == "5" ]; do
            read -s -p "Password: " password;
            echo; # new line
            echo $password > $i.password
            sshpass -f $i.password ssh-copy-id $i > /dev/null 2>&1;
            STATUS=$?;
            if [ "$STATUS" == "5" ]; then
                echo "Wrong password!";
                while [ "$STATUS" == "5" ]; do
                    read -s -p "Password: " password;
                    echo; # new line
                    echo $password > $i.password
                    sshpass -f $i.password ssh-copy-id $i > /dev/null 2>&1;
                    STATUS=$?;
                done;
            elif [ "$STATUS" == "0" ]; then
                echo "Success!";
            else 
                echo "FAILURE: STATUS $STATUS";
            fi
        done;
    elif [ "$STATUS" == "0" ]; then
        echo "Success!";
    else 
        echo "FAILURE: STATUS $STATUS";
    fi
    rm $i.password
    
done

# add ssh keys to github: cannae automate :(
# from github; copies the key to my clipboard so I can go paste it into ffox
xclip -sel clip < ~/.ssh/id_rsa.pub

echo "$BCyan|-- SSH key copied to clipboard.  Opening firefox to add to github. . ." ;
firefox https://github.com/settings/ssh;
echo "$BGreen|-- Done!";
echo "$BGreenSetup complete!$No_color";

# wait till they've added the keys before proceeding
read -p "Press [Enter] key once you've added the github key."

mkdir ~/dev;
mkdir ~/bin;

wget -nv -O ~/bin/config-merge.sh $URL_ROOT/config-merge.sh;
chmod +x ~/bin/config-merge.sh
