
# New Registration App Deployment

This file documents the steps performed when deploying the new registration app.  The new registration app in the year 
2021 is written in NodeJS / Express / React, instead of the older Ruby on Rails stack.  This document is intended for 
reference / backup purpose, but there is no expectation that we have to go through this again from scratch, unless 
somehow we lost all snapshot backup of the boot disk.

## Update NodeJS on Ubuntu

When the server was first setup in early 2021 in Google Compute Engine, the NodeJS was installed through NodeSource 
repos and was version 14.x.  NodeJS LTS version will move from 14.x to 16.x in October 2021.  Hence, we should update 
the NodeJS version to 16.x before deploying the new app (some time in Q4 of 2021).

Since the version 14.x was installed through the NodeSource repo, the best way to update NodeJS version is to remove 
version 14.x completely and then install version 16.x through the same NodeSource mechanism.

1. Connect as your user then change to the root user:
    1. `gcloud compute ssh registration-wp-west1-b-1`
    2. After connected, change to root user:
       ```shell
       sudo -u root -H bash --login
       cd
       ```

2. Purge the version 14.x package installation and remove the NodeSource repo for 14.x:
   ```shell
   apt-get --purge remove nodejs
   rm /etc/apt/sources.list.d/nodesource.list
   ```

3. Download the setup script from NodeSource:
   ```shell
   curl -fsSL -o setup-nodejs16 https://deb.nodesource.com/setup_16.x
   ```

4. Install nodejs:
   ```shell
   bash setup-nodejs16
   apt-get install -y nodejs
   ```
   After the installation, the vesrion can be verified by simple checks such as `node -v`

## Update Passenger on Ubuntu

When the server was first setup in early 2021 in Google Compute Engine, the Passenger was installed through source 
tarball and was version 6.0.8.  This was because the Passenger official site does not support Debian packages for Ubuntu 
20.04 LTS yet at that time.  As of November 2021, the Passenger official site has pre-built Debian packages for Ubuntu 
20.04, so it is better and easier for upgrading Passenger if we switch to using the pre-built Debian packages instead 
of compiling from the source tarball.

1. Connect as your user then change to the root user:
   1. `gcloud compute ssh registration-wp-west1-b-1`
   2. After connected, change to root user:
      ```shell
      sudo -u root -H bash --login
      cd
      ```

2. Edit **/etc/bash.bashrc** to remove the following lines we put in when installing through source:
   ```shell
   PATH=/opt/passenger-6.0.8/bin:$PATH
   export PATH
   ```

3. Disconnect from the server and re-login to activate the new PATH:
   ```shell
   exit
   exit
   gcloud compute ssh registration-wp-west1-b-1
   sudo -u root -H bash --login
   cd
   ```

4. Disable passenger modules in apache and stop apache:
   ```shell
   a2dismod passenger
   systemctl stop apache2
   ```
   Note that at this point the site is down.  I stopped apache all together since the register site won't work without 
   Passenger modules anyway.

5. Move the existing apache passenger module config files to backup locations since the new package installation will
   put in new (different) ones:
   ```shell
   mkdir /root/backup/passenger-tarball
   mv /etc/apache2/mods-available/passenger.load /root/backup/passenger-tarball/
   mv /etc/apache2/mods-available/passenger.conf /root/backup/passenger-tarball/
   ```

6. Install Passenger from the pre-built Debian packages for Ubuntu 20.04:
   ```shell
   apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 561F9B9CAC40B2F7
   apt-get install -y apt-transport-https ca-certificates
   sh -c 'echo deb https://oss-binaries.phusionpassenger.com/apt/passenger focal main > /etc/apt/sources.list.d/passenger.list'
   apt-get update
   apt-get install -y libapache2-mod-passenger
   apache2ctl restart
   ```
   At the end of the above commands, everything should be back up and running.  The package installation automatically
   enabled the passenger modules so we just need to restart apache.

7. The Passenger installation can be validated with:
   ```shell
   /usr/bin/passenger-config validate-install
   ```
   and the run-time status can be checked with:
   ```shell
   /usr/sbin/passenger-memory-stats
   ```



