
# Setup new server

This file documents the steps Chiaming did to setup the new TOCS main server.  It is intended for reference / backup 
purpose, but there is no expectation that we have to go through this again from scratch, unless somehow we lost all 
snapshot backup of the boot disk.


## Pre-requisites

Create the instance through Google Cloud Console (see screenshots in engineering google drive 
`google-compute-backup/vm-creation-screenshots` for the configuration settings used).

Note that the VM instance created uses UTC by default, which is good.

Setup Google Cloud SDK for access and connect through SSH using Cloud SDK.  See <https://cloud.google.com/sdk> for 
details on installing and using Google Cloud SDK.  The rest of this document describes steps executed through SSH 
sessions.  For each section of setup, the first step is typically connecting to the server as the root user.  If setup 
is done continuously, the first step does not have to be repeated.


## Apache base installation

1. Connect as your user then change to the root user:
   1. `gcloud compute ssh registration-wp-west1-b-1`
   2. After connected, change to root user: 
      ```shell
      sudo -u root -H bash --login
      cd
      ```
   3. Run system update (this should be done periodically):
      ```shell
      apt-get update
      apt-get upgrade
      apt autoremove
      ```

2. Install the Ubuntu package for Apache web server:
   `apt-get install apache2`

3. Replace the default index page with the Chinese School splash page:
   1. In the local client session, scp a splash page backup to the new server from the local client session 
      (example command):
      `gcloud compute scp chineseschool-splash-20210305.tar.gz registration-wp-west1-b-1:~/`
   2. In the root user session, get the splash page package and unpack it:
      ```shell
      cd
      mkdir backup
      cd backup/
      mv /home/engineering1/chineseschool-splash-20210305.tar.gz .
      tar zxvf chineseschool-splash-20210305.tar.gz
      ```
      Note that your home directory could be different.
   3. Replace the default index page:
      ```shell
      cd /var/www/html
      mv index.html index.html.default
      mv /root/backup/chineseschool-splash/index.html .
      mv /root/backup/chineseschool-splash/*png .
      ```
      
4. Test the splash page.  I have previously setup the DNS mapping for the hostname **register.to-cs.org** in the 
   bluehost DNS records.  Test that the URL <http://register.to-cs.org/> works without problems.
   
5. Enable SSL mode:
   ```shell
   a2enmod ssl
   a2ensite default-ssl
   systemctl restart apache2
   ```
   After this change, the splash page should be visible through <https://register.to-cs.org/> with a insecure 
   self-signed certificate.

## PostgreSQL base installation

1. Connect as your user then change to the root user:
    1. `gcloud compute ssh registration-wp-west1-b-1`
    2. After connected, change to root user:
       ```shell
       sudo -u root -H bash --login
       cd
       ```
    3. Run system update (this should be done periodically):
       ```shell
       apt-get update
       apt-get upgrade
       apt autoremove
       ```

2. Install the Ubuntu package for PostgreSQL:
   ```shell
   apt-get install postgresql libpq-dev
   ```
   The libpq-dev is the development header needed later for installing pg gem since it needs to compile the native 
   extension for the database connection driver.

3. Adjust base settings.  The only PostgreSQL settings I changed away from default are in **/etc/postgresql/12/main/postgresql.conf**:
   ```text
   logging_collector = on
   logging_collector = on
   log_directory = 'log'
   log_filename = 'postgresql-%a.log'
   log_truncate_on_rotation = on
   log_rotation_age = 1d
   log_rotation_size = 0
   
   lc_messages = 'en_US.UTF-8'
   lc_monetary = 'en_US.UTF-8'
   lc_numeric = 'en_US.UTF-8'
   lc_time = 'en_US.UTF-8'
   ```
   Note that the default timezone of the database is UTC and I leave it as-is, which is better than using local timezone.

4. I checked the authentication file **/etc/postgresql/12/main/pg_hba.conf** and decided to keep it with all default 
   settings for now.

5. Start the PostgreSQL server process:
   `pg_ctlcluster 12 main start`

6. Test local postgres admin can connect to the server:
   1. Change to the postgres role user: 
      ```shell
      sudo -u postgres -H bash --login
      cd
      ```
   2. Connect to the PostgreSQL server:
      `psql template1`
   3. Disconnect from the PostgreSQL server after poking around:
      `\q`
      

## Registration system setup

### Role users in Ubuntu and PostgreSQL

The PostgreSQL database on the old server was owned by the role **tocsorg_registration** so it is easier to name the 
Ubuntu role user the same on the new server so that we can import the backup dump without modifications.

1. Connect as your user then change to the root user:
    1. `gcloud compute ssh registration-wp-west1-b-1`
    2. After connected, change to root user:
       ```shell
       sudo -u root -H bash --login
       cd
       ```
    3. Run system update (this should be done periodically):
       ```shell
       apt-get update
       apt-get upgrade
       apt autoremove
       ```

2. Add the Ubuntu user with default settings:
   ```shell
   adduser tocsorg_registration
   ```
   I have to put in a password, but we don't need to use the password since we will be switching to the role user with 
   sudo.
   
3. Test the Ubuntu user:
   ```shell
   sudo -u tocsorg_registration -H bash --login
   cd
   pwd
   id
   exit
   ```
   
4. Change to the postgres role user and create the database role:
   1. Change to the postgres role user:
      ```shell
      sudo -u postgres -H bash --login
      cd
      ```
   2. Connect to the PostgreSQL server:
      `psql template1`
   3. Add the new role:
      `CREATE ROLE tocsorg_registration LOGIN CREATEDB PASSWORD 'xxxx';`
      where *xxxx* should be a real strong password
   4. Roles existing inside the database can be inspected with:
      `SELECT rolname FROM pg_roles;`
   5. Disconnect from the PostgreSQL server:
      `\q`


### Creating the empty registration database in PostgreSQL

Before we import the backup dump from the old server, we have to create the database first.

1. Connect as your user then change to the tocsorg_registration user:
    1. `gcloud compute ssh registration-wp-west1-b-1`
    2. After connected, change to tocsorg_registration user:
       ```shell
       sudo -u tocsorg_registration -H bash --login
       cd
       ```

2. Connect to the PostgreSQL server:
   `psql template1`
    
3. Create the new database:
   ```sql
   CREATE DATABASE registration OWNER tocsorg_registration TEMPLATE template0 
   ENCODING 'UTF8' LC_COLLATE 'en_US.UTF8' LC_CTYPE 'en_US.UTF8';
   ```

4. The new database can be seen by listing all databases: 
   `\l`
   
5. Disconnect from the PostgreSQL server:
   `q`

### Importing database backup for the registration system

The old server on bluehost was running PostgreSQL 9.2.24 on CentOS 7.  The new server is running PostgreSQL 12.6 on 
Ubuntu 20.04 LTS.

1. In the local client session, scp a registration database backup to the new server from the local client session
   (example command):
   `gcloud compute scp registration202104010400.sql.gz registration-wp-west1-b-1:~/`

2. Connect as your user then change to the tocsorg_registration user:
   1. `gcloud compute ssh registration-wp-west1-b-1`
   2. After connected, change to tocsorg_registration user:
      ```shell
      sudo -u tocsorg_registration -H bash --login
      cd
      ```

3. Copy over the backup and unpack it:
   ```shell
   cd
   mkdir backup
   cd backup/
   cp /home/engineering1/registration202104010400.sql.gz .
   gunzip registration202104010400.sql.gz
   ```
   Note that your home directory and the backup file name could be different.

4. Import the backup into the new database:
   1. Connect to the (currently empty) registration database:
      `psql registration`
   2. Import the backup:
      ```sql
      \i /home/tocsorg_registration/backup/registration202104010400.sql;
      ```
      Note that there will be a bunch of error messages complaining about role *tocsorg_dump* does not exist like this:
      ```text
      psql:/home/tocsorg_registration/backup/registration202104010400.sql:76674: ERROR:  role "tocsorg_dump" does not exist
      ```
      It is safe to ignore these error messages about the role *tocsorg_dump*.  It was a database role on the old server 
      specifically setup to take a daily backup dump.  The PostgreSQL authentication security is setup differently on 
      the new server (since we have more freedom here and I followed a more typical default settings allowing local 
      UNIX peer authentication) so that this dump role is no longer needed on the new server.
   3. Poke around and see expected data in the database.
   4. Disconnect from the PostgreSQL server:
      `\q`

5. Clean up the backup file in the home directory:
   ```shell
   exit
   cd
   rm registration202104010400.sql.gz
   ```

### Installing Ruby, Nodejs, and Passenger

1. Connect as your user then change to the root user:
   1. `gcloud compute ssh registration-wp-west1-b-1`
   2. After connected, change to root user:
      ```shell
      sudo -u root -H bash --login
      cd
      ```
   3. Run system update (this should be done periodically):
      ```shell
      apt-get update
      apt-get upgrade
      apt autoremove
      ```

2. Install RVM and Ruby:
   1. Install essential libraries for building:
      ```shell
      apt-get install -y curl gnupg build-essential
      ```
   2. Install GPG keys which are used to verify RVM packages:
      ```shell
      gpg --keyserver hkp://pool.sks-keyservers.net --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3 7D2BAF1CF37B13E2069D6956105BD0E739499BDB
      ```
   3. Install RVM through specific Ubuntu packages:
      ```shell
      apt-add-repository -y ppa:rael-gc/rvm
      apt-get update
      apt-get install rvm
      usermod -a -G rvm root
      usermod -a -G rvm tocsorg_registration
      ```
      The last two commands add the user root and the user tocsorg_registration to the rvm group, which is required for 
      any user where RVM will be used.
      This step described here came from the README page of the Ubuntu RVM package here: <https://github.com/rvm/ubuntu_rvm>
   4. Disconnect from the server and re-login to activate RVM:
      ```shell
      exit
      exit
      gcloud compute ssh registration-wp-west1-b-1
      sudo -u root -H bash --login
      cd
      ```
   5. As the user root, enable local gemsets and install Ruby 1.9.3:
      ```shell
      rvm user gemsets
      rvm_rubygems_version=2.7.3 rvm install ruby-1.9.3
      ```
      Note that we have to specify an old rubygems version here because the latest 3.x rubygems are not compatible 
      with the older Ruby 1.9.x we use.  We specifically use Ruby 1.9.3 because our Rails 3 code is not compatible 
      with newer Ruby 2.x.
   
      In the last part of the installation, this error popped up:
      ```text
      Making gemset ruby-1.9.3-p551 pristine.......................................................................\
      'command gem pristine --extensions  --version ' failed, you need to fix these gems manually.
      .
      Error running '__rvm_with ruby-1.9.3-p551 gemset_pristine',
      please read /root/.rvm/log/1617394516_ruby-1.9.3-p551/gemset.pristine-ruby-1.9.3-p551.log
      ```
      But it seems the installations of both Ruby 1.9.3 and Rubygems 2.7.3 were successful otherwise.  I then executed 
      this command to make gems pristine and it ran without problems:
      ```shell
      gem pristine --all
      ```
   6. Set the default Ruby to the 1.9.3 installed for the root user:
      ```shell
      rvm --default use 1.9.3
      ```
   7. Install bundler for the root user:
      ```shell
      gem install bundler -v 1.17.3 --no-rdoc --no-ri
      ```
      Note that we have to install the specific older version of bundler.  The latest version is not compatible with
      the older Ruby 1.9.3 we use.
   7. Set the default Ruby to the 1.9.3 installed for the user tocsorg_registration:
      ```shell
      sudo -u tocsorg_registration -H bash --login
      cd 
      rvm user gemsets
      rvm --default use 1.9.3
      ```
   8. Install bundler for the user tocsorg_registration:
      ```shell
      gem install bundler -v 1.17.3 --no-rdoc --no-ri
      ```
      Note that we have to install the specific older version of bundler.  The latest version is not compatible with 
      the older Ruby 1.9.3 we use.
   9. Exit back to the root user before continuing to the next step:
      ```shell
      exit
      cd
      ```

3. Install Nodejs:
   1. Install essential libraries for building:
      ```shell
      apt-get install -y curl apt-transport-https ca-certificates
      ```
   2. Download the setup script from NodeSource:
      ```shell
      curl -fsSL -o setup-nodejs14 https://deb.nodesource.com/setup_14.x
      ```
      Note that we use version 14.x which is the current LTS as of 2021-04-03.  The LTS version could be different at a 
      later date if this procedure is re-run again.
   3. Install nodejs:
      ```shell
      bash setup-nodejs14
      apt-get install -y nodejs
      ```

4. Install Passenger:
   1. Download the latest stable Passenger source tarball from the Passenger website 
      <https://www.phusionpassenger.com/latest_stable_tarball> to the local machine.
   2. In the local client session, scp the tarball to the new server from the local client session (example command):
      `gcloud compute scp passenger-6.0.8.tar.gz registration-wp-west1-b-1:~/`
   3. In the root user session, move the tarball to the backup directory and unpack a copy into **/opt**:
      ```shell
      cd /root/backup
      mv /home/engineering1/passenger-6.0.8.tar.gz .
      cd /opt
      cp /root/backup/passenger-6.0.8.tar.gz .
      tar zxvf passenger-6.0.8.tar.gz
      rm passenger-6.0.8.tar.gz
      ```
      Note that your home directory could be different.
   4. Add Passenger binaries to shell PATH by editing **/etc/bash.bashrc** and add the following lines at the end of 
      the file:
      ```shell
      PATH=/opt/passenger-6.0.8/bin:$PATH
      export PATH
      ```
   5. Disconnect from the server and re-login to activate the new PATH:
      ```shell
      exit
      exit
      gcloud compute ssh registration-wp-west1-b-1
      sudo -u root -H bash --login
      cd
      ```
   6. Install additional development libraries needed:
      ```shell
      apt-get install -y libcurl4-openssl-dev apache2-dev libapr1-dev libaprutil1-dev libssl-dev
      gem install rack -v 1.6.13
      ```
      Note that we have to install the specific older version of rack.  The latest version is not compatible with
      the older Ruby 1.9.3 we use.
   7. Install Passenger Apache module:
      ```shell
      passenger-install-apache2-module
      ```
      Note that this step compiles Passenger from source, so it will take a while (about 20 minutes).
   8. Add required Apache configuration and restart Apache:
      These steps are actually part of the installation script started in the previous step.
      1. Create the file **/etc/apache2/mods-available/passenger.load** containing the following line:
         ```text
         LoadModule passenger_module /opt/passenger-6.0.8/buildout/apache2/mod_passenger.so
         ```
      2. Create the file **/etc/apache2/mods-available/passenger.conf** containing the following line:
         ```text
         <IfModule mod_passenger.c>
             PassengerRoot /opt/passenger-6.0.8
             PassengerDefaultRuby /root/.rvm/gems/ruby-1.9.3-p551/wrappers/ruby
         </IfModule>
         ```
      3. Enable the new module and restart Apache:
         ```shell
         a2enmod passenger
         systemctl restart apache2
         ```
   9. Validate the installation:
      1. Passenger validation script should return good results:
         ```shell
         passenger-config validate-install
         ```
      2. Passenger stats script should show one Passenger watchdog process and at least one Passenger core process:
         ```shell
         passenger-memory-stats
         ```

### Setup the registration application

1. Create the application directory under **/var/www**:
   1. Connect as your user then change to the root user:
      `gcloud compute ssh registration-wp-west1-b-1`
   2. After connected, change to root user:
      ```shell
      sudo -u root -H bash --login
      cd
      ```
   3. Create the directory **/var/www/registration** and change the ownership to tocsorg_registration:
      ```shell
      mkdir /var/www/registration
      chown tocsorg_registration:tocsorg_registration /var/www/registration
      ```

2. Setup a copy of the registration application code:
   1. In the local client session, scp a tarball backup of the registration application code to the new server from 
      the local client session (example command):
      `gcloud compute scp chineseschool20210407.tar.gz registration-wp-west1-b-1:~/`
   2. In the root user session, move the tarball to the user tocsorg_registration:
      ```shell
      cd /root/backup
      mv /home/engineering1/chineseschool20210407.tar.gz /home/tocsorg_registration/
      chown tocsorg_registration:tocsorg_registration /home/tocsorg_registration/chineseschool20210407.tar.gz
      ```
      Note that your home directory could be different.
   3. Change to the user tocsorg_registration and unpack the tarball:
      ```shell
      sudo -u tocsorg_registration -H bash --login
      cd 
      tar zxvf chineseschool20210407.tar.gz
      cd chineseschool/
      mv * /var/www/registration/
      cd 
      mkdir backup
      mv chineseschool20210407.tar.gz backup/
      rmdir chineseschool
      ```
   4. Install gems:
      ```shell
      cd /var/www/registration
      bundle install --deployment --without development test
      ```
      Note that with the --deployment option, the gems are installed into **/var/www/registration/vendor/bundle** 
      instead of the local GEM_HOME of tocsorg_registration.
   5. Update gems for specific changes required by the Authorize.Net gateway:
      1. Edit the file **/var/www/registration/vendor/bundle/ruby/1.9.1/gems/activemerchant-1.43.3/lib/active_merchant/billing/gateways/authorize_net.rb** 
         and replace *secure.authorize.net* with *secure2.authorize.net*
      2. Replace **/var/www/registration/vendor/bundle/ruby/1.9.1/gems/active_utils-2.2.3/lib/certs/cacert.pem** 
         with a different one containing new Authorize.Net Root CA **authorize.net.root.ca.20180307.pem** from the 
         old server:
         1. In the local client session, scp a backup of the cert file to the new server from the local client session 
            (example command):
            `gcloud compute scp authorize.net.root.ca.20180307.pem registration-wp-west1-b-1:~/`
         2. In the root user session, move the cert file to the user tocsorg_registration:
            ```shell
            mv /home/engineering1/authorize.net.root.ca.20180307.pem /home/tocsorg_registration/backup/
            chown tocsorg_registration:tocsorg_registration /home/tocsorg_registration/backup/authorize.net.root.ca.20180307.pem
            ```
            Note that your home directory could be different.
         3. In the tocsorg_registration user session, replace the cert file:
            ```shell
            cd 
            cd backup
            mkdir production
            cp /var/www/registration/vendor/bundle/ruby/1.9.1/gems/active_utils-2.2.3/lib/certs/cacert.pem production/original-active_utils-2.2.3-cacert.pem
            cp authorize.net.root.ca.20180307.pem /var/www/registration/vendor/bundle/ruby/1.9.1/gems/active_utils-2.2.3/lib/certs/cacert.pem
            mv authorize.net.root.ca.20180307.pem production/
            ```
   6. (Continue in the tocsorg_registration user session) update database config to put in the new production database 
      credential and keep a backup of it:
      ```shell
      vi /var/www/registration/config/database.yml
      cp /var/www/registration/config/database.yml /home/tocsorg_registration/backup/production/
      ```
   7. Update SMTP config for the production environment to use the Google Workspace
   





