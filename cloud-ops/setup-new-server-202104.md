
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

## MariaDB base installation

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
      ```

2. Install the Ubuntu package for MariaDB:
   ```shell
   apt-get install mariadb-server
   ```
   The libpq-dev is the development header needed later for installing pg gem since it needs to compile the native
   extension for the database connection driver.

3. Run the script which came with the package to secure the database:
   ```shell
   mysql_secure_installation
   ```
   When prompted, enter NO for setting root password.  Ubuntu installation requires root database password to be empty 
   so that package updates in the future would work without problems.  For the rest of the prompts, the default YES 
   response is fine.

4. Test root user can connect to the server:
   ```shell
   mariadb
   ```

5. To start / stop / check status, use the following commands:
   ```shell
   systemctl start mariadb
   systemctl stop mariadb
   systemctl status mariadb
   ```

## Registration application setup

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

### Importing database backup for the registration application

The old server on bluehost was running PostgreSQL 9.2.24 on CentOS 7.  The new server is running PostgreSQL 12.6 on 
Ubuntu 20.04 LTS.

1. In the local client session, scp a registration database backup to the new server from the local client session
   (example command):
   ```shell
   gcloud compute scp registration202104010400.sql.gz registration-wp-west1-b-1:~/
   ```

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
      chown -R root:root passenger-6.0.8
      chmod -R g-w passenger-6.0.8
      rm passenger-6.0.8.tar.gz
      ```
      Note that your home directory could be different.
      Also note that changing the ownership and permissions for the passenger directory as described in the commands 
      is important.  Passenger will refuse to run if the permissions are not tied down due to the security risks of 
      allowing non-root users to access / modify the passenger binary.
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
      1. `gcloud compute ssh registration-wp-west1-b-1`
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
      ```shell
      gcloud compute scp chineseschool20210407.tar.gz registration-wp-west1-b-1:~/
      ```
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
   6. (Continue in the tocsorg_registration user session) update gems to fix the compatibility issue between old Rails 
      version and the newer PostgreSQL 12.  Edit the file 
      **/var/www/registration/vendor/bundle/ruby/1.9.1/gems/activerecord-3.2.13/lib/active_record/connection_adapters/postgresql_adapter.rb**
      and replace *panic* with *warning* at line 384.
   7. Update database config to put in the new production database credential and keep a backup of it:
      ```shell
      vi /var/www/registration/config/database.yml
      cp /var/www/registration/config/database.yml /home/tocsorg_registration/backup/production/
      ```
   8. Update SMTP config for the production environment to use the Google Workspace relay service:
      ```shell
      vi /var/www/registration/config/environments/production.rb
      cp /var/www/registration/config/environments/production.rb /home/tocsorg_registration/backup/production/
      ```
   9. Update the following files to change hardcoded URL parts from **https://www.to-cs.org/chineseschool/** to 
      **https://register.to-cs.org/**:
      ```text
      /var/www/registration/app/mailers/signin_mailer.rb
      /var/www/registration/app/views/signin_mailer/forgot_password.text.erb
      /var/www/registration/app/views/signin_mailer/account_invitation.text.erb
      /var/www/registration/app/views/withdrawal_mailer/registration_notification.html.erb
      /var/www/registration/app/views/withdrawal_mailer/accounting_notification.html.erb
      /var/www/registration/app/views/withdrawal_mailer/student_parent_notification.html.erb
      /var/www/registration/app/views/receipt_mailer/payment_confirmation.html.erb
      ```
      These changes have been committed to the code repo so that the changes are now permanent.

3. Setup the Apache configuration for the site, including SSL certificates:
   1. Connect as your user then change to the root user:
      1. `gcloud compute ssh registration-wp-west1-b-1`
      2. After connected, change to root user:
         ```shell
         sudo -u root -H bash --login
         cd
         ```
   2. Create the file **/etc/apache2/sites-available/registration.conf** with the following content:
      ```text
      <VirtualHost *:80>
          ServerName register.to-cs.org

          ServerAdmin engineering@to-cs.org

          # Tell Apache and Passenger where your app's 'public' directory is
          DocumentRoot /var/www/registration/public

          ErrorLog ${APACHE_LOG_DIR}/error.log
          CustomLog ${APACHE_LOG_DIR}/access.log combined

          PassengerRuby /home/tocsorg_registration/.rvm/gems/ruby-1.9.3-p551/wrappers/ruby

          # Relax Apache security settings
          <Directory /var/www/registration/public>
              Allow from all
              Options -MultiViews
              Require all granted
          </Directory>
      </VirtualHost>
      ```
      This is this based on the instructions from Passenger installation guide and contains the minimum configuration 
      of a plain HTTP site mapped to the registration application code.
   3. Enable this new site configuration:
      ```shell
      a2ensite registration
      apache2ctl restart
      ```
   4. Install *snap* and *certbot* and enable secured site with valid SSL certificates:
      1. Install *snap*, which is a cross-platform app packaging and delivery mechanism:
         ```shell
         snap install core
         snap refresh core
         ```
         Note that the *snapd* daemon, which is required, is already part of the base Ubuntu 20.04 LTS.
      2. Install *certbot*:
         ```shell
         snap install --classic certbot
         ln -s /snap/bin/certbot /usr/bin/certbot
         ```
         *Certbot* is an app to automatically create and manage renewal of valid SSL certificates with
         the *Let's Encrypt* project.  See <https://letsencrypt.org/> for more information on the *Let's Encrypt* 
         project, and <https://certbot.eff.org/> for more information about *certbot* from the *Electronic Frontier 
         Foundation*.
      3. Run *certbot* to setup the secured site:
         ```shell
         certbot --apache
         ```
         This command runs through a text-based interactive session to collect information and other legal stuffs, 
         during which I agreed to the Terms of Service at 
         <https://letsencrypt.org/documents/LE-SA-v1.2-November-15-2017.pdf> and registered the email address 
         *engineering@to-cs.org* with the *Electronic Frontier Foundation*.  Then the command modified the site config 
         **/etc/apache2/sites-enabled/registration.conf** and then generated a new secured site config 
         **/etc/apache2/sites-available/registration-le-ssl.conf** and enabled them.  It also setup a system timer 
         task to check and automatically renew the certificates when needed.  This timer task can be seen with the 
         command `systemctl list-timers` and a renewal dry-run can be emulated with `certbot renew --dry-run`.
   5. Backup the generated Apache site config:
      ```shell
      cd /root/backup
      mkdir apache-config
      cp /etc/apache2/sites-available/registration* apache-config/
      ```
   6. Disable the default sites in Apache and leave only the registration sites active:
      ```shell
      a2dissite 000-default
      a2dissite default-ssl
      apache2ctl restsart
      ```
      
4. Test the registration application on the new server.  Everything should work at this point, including plain HTTP 
   connection attempts would be forced redirect to HTTPS connections.

5. Setup local daily database backups
   1. Connect as your user then change to the tocsorg_registration user:
      1. `gcloud compute ssh registration-wp-west1-b-1`
      2. After connected, change to root user:
         ```shell
         sudo -u tocsorg_registration -H bash --login
         cd
         ```
   2. Create the directory holding the daily database backup:
      ```shell
      mkdir prod_db_dump
      cd prod_db_dump
      ```
   3. Create the shell script **dump_prod_db.sh** with the following content:
      ```shell
      #!/usr/bin/bash

      DUMP_DIR=/home/tocsorg_registration/prod_db_dump
      TIMESTAMP=`date +"%Y%m%d%H%M"`

      pg_dump -f $DUMP_DIR/registration$TIMESTAMP.sql registration
      gzip $DUMP_DIR/registration$TIMESTAMP.sql
      ```
   4. Make the new script executable:
      ```shell
      chmod u+x dump_prod_db.sh
      ```
   5. Add the script to crontab so that it runs every night before Google Compute Engine takes the snapshot backup:
      ```shell
      crontab -e
      ```
      and add the entry:
      ```text
      55 9 * * *      /home/tocsorg_registration/prod_db_dump/dump_prod_db.sh
      ```
   
## Registration application live production cut-over

### Setup the splash site on the new server

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
      ```

2. Create the splash site for the registration application on the new server and activate it.  This can be used in the 
   future when we update the registration application on the new server.
   1. Make a copy of the needed files from the default site content to a new directory:
      ```shell
      cd /var/www
      mkdir registration-splash
      cp html/index.html registration-splash/
      cp html/*.png registration-splash/
      ```
   2. Copy the site config from the registration pair and modify them to change the *DocumentRoot* to the new 
      directory and remove Passenger related lines:
      ```shell
      cd /etc/apache2/sites-available/
      cp registration.conf registration-splash.conf
      cp registration-le-ssl.conf registration-splash-ssl.conf
      vi registration-splash.conf
      vi registration-splash-ssl.conf
      cp registration-splash* /root/backup/apache-config/
      ```
      The last line is to backup the new config files to the root home directory.
   3. Disable the registration application sites and enable the splash sites:
      ```shell
      a2dissite registration
      a2dissite registration-le-ssl
      a2ensite registration-splash
      a2ensite registration-splash-ssl
      apache2ctl restart
      ```

### Turn on the splash site on the old server and grab a copy of the latest data

1. Connect to the old server and activate the splash site there:
   ```shell
   ssh tocsorg@to-cs.org
   rm /home/tocsorg/public_html/chineseschool
   ln -s /home/tocsorg/public_html/chineseschool-splash /home/tocsorg/public_html/chineseschool
   ```

2. Because there is no changes in the application code since I grab a copy on 2021-04-07 to setup the first copy on 
   the new server, we don't have to update the application code again.  This can be verified by the following commands:
   ```shell
   cd /home/tocsorg/chineseschool
   find . -type f -mtime -10
   ```
   The command would output the list of files modified within the last 10 days (it is 2021-04-16 now when I perform 
   the production cut-over.)  We can see that only the production log file has been modified, due to the production 
   traffic.
   
3. Make a final backup of the production log:
   ```shell
   cp /home/tocsorg/chineseschool/log/production.log /home/tocsorg/camyhsu_backup/prod_log/production.log.20210416
   ```

4. Generate a new database backup of the registration application:
   ```shell
   cd /home/tocsorg/prod_db_dump
   ./dump_prod_db.sh
   ```
   The script will generate database backups for both the registration application and the WordPress site.
   
5. In the local client session, scp the database backup for the registration application to the local machine:
   ```shell
   scp tocsorg@to-cs.org:/home/tocsorg/prod_db_dump/registration202104162147.sql.gz .
   ```

### Update the data and turn off the splash sites on the new server

1. In the local client session, scp the latest database backup to the new server from the local client session:
   ```shell
   gcloud compute scp registration202104162147.sql.gz registration-wp-west1-b-1:~/
   ```

2. Connect as your user then change to the tocsorg_registration user:
   1. `gcloud compute ssh registration-wp-west1-b-1`
   2. After connected, change to tocsorg_registration user:
      ```shell
      sudo -u tocsorg_registration -H bash --login
      cd
      ```

3. Copy over the backup and unpack it:
   ```shell
   cd backup
   cp /home/engineering1/registration202104162147.sql.gz .
   gunzip registration202104162147.sql.gz
   ```
   Note that your home directory and the backup file name could be different.

4. Replace the data in the database with the latest backup:
   1. Connect to the PostgreSQL server:
      `psql template1`
   2. Drop the existing database:
      ```sql
      DROP DATABASE registration;
      ```
   3. Create a new empty database:
      ```sql
      CREATE DATABASE registration OWNER tocsorg_registration TEMPLATE template0 
      ENCODING 'UTF8' LC_COLLATE 'en_US.UTF8' LC_CTYPE 'en_US.UTF8';
      ```
   4. Connect to the new (currently empty) registration database:
      ```sql
      \c registration;
      ```
   5. Import the latest backup:
      ```sql
      \i /home/tocsorg_registration/backup/registration202104162147.sql;
      ```
      Note that there will be a bunch of error messages complaining about role *tocsorg_dump* does not exist like this:
      ```text
      psql:/home/tocsorg_registration/backup/registration202104010400.sql:76674: ERROR:  role "tocsorg_dump" does not exist
      ```
      It is safe to ignore these error messages about the role *tocsorg_dump*.  It was a database role on the old server
      specifically setup to take a daily backup dump.  The PostgreSQL authentication security is setup differently on
      the new server (since we have more freedom here and I followed a more typical default settings allowing local
      UNIX peer authentication) so that this dump role is no longer needed on the new server.
   6. Poke around and see expected data in the database.
   7. Disconnect from the PostgreSQL server:
      `\q`

5. Clean up the backup file in the home directory:
   ```shell
   exit
   cd
   rm registration202104162147.sql.gz
   ```

6. Change to root user and turn off the splash sites:
   ```shell
   sudo -u root -H bash --login
   cd
   a2dissite registration-splash
   a2dissite registration-splash-ssl
   a2ensite registration
   a2ensite registration-le-ssl
   apache2ctl restart
   ```
   At this point, the registration application is up and running on the new server with the latest data.

### Setup redirect on the old server to point to the new server

1. Connect to the old server and kill the splash site there:
   ```shell
   ssh tocsorg@to-cs.org
   rm /home/tocsorg/public_html
   rm chineseschool
   ```

2. Create a new *chineseschool* directory and put a redirect config in the **.htaccess** file:
   ```shell
   mkdir chineseschool
   cd chineseschool
   vi .htaccess
   ```
   The **.htaccess** file should contain the following line:
   ```text
   Redirect 301 /chineseschool https://register.to-cs.org
   ```

3. Test in the browser to make sure it works.  Then we can leave the old server: `exit`


## WordPress setup

### Role users in Ubuntu and MariaDB

The WordPress database on the old server was named **tocsorg_school** and the database user was named **tocsorg_web** 
so we will use the same names on the new server.

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
      ```

2. Add the Ubuntu user with default settings:
   ```shell
   adduser tocsorg_web
   ```
   I have to put in a password, but we don't need to use the password since we will be switching to the role user with
   sudo.

3. Test the Ubuntu user:
   ```shell
   sudo -u tocsorg_web -H bash --login
   cd
   pwd
   id
   exit
   ```

4. Create the database user in the MariaDB:
   1. Connect to the MariaDB server:
      ```shell
      mariadb
      ```
   2. Add the new user:
      ```mariadb
      GRANT ALL ON *.* TO 'tocsorg_web'@'localhost' IDENTIFIED BY 'xxxx' WITH GRANT OPTION;
      FLUSH PRIVILEGES;
      ```
      where *xxxx* should be a real strong password.
      Then disconnect from the MariaDB server:
      `exit`
   3. Test the new user with:
      ```shell
      mariadb -u tocsorg_web -p
      ```
   4. Users existing inside the database can be inspected with:
      ```mariadb
      SELECT host, user, password FROM mysql.user;
      ```
   5. Disconnect from the MariaDB server:
      `exit`
   
### Installing PHP

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
      ```

2. Install PHP:
   1. Install PHP and its Apache2 module:
      ```shell
      apt-get install php libapache2-mod-php php-mysql php-curl php-gd php-pear php-imagick php-imap php-tidy php-xmlrpc
      ```
   2. Modify PHP settings to allow bigger file uploads:
      1. Make a backup copy of the original PHP ini file:
         ```shell
         cd /etc/php/7.4/apache2
         cp php.ini php.ini.original
         cp php.ini.original /root/backup/
         ```
      2. Modify php.ini to change the following values from the original default settings:
         ```text
         388c388
         < max_execution_time = 30
         ---
         > max_execution_time = 600
         398c398
         < max_input_time = 60
         ---
         > max_input_time = 600
         409c409
         < memory_limit = 128M
         ---
         > memory_limit = 512M
         694c694
         < post_max_size = 8M
         ---
         > post_max_size = 448M
         846c846
         < upload_max_filesize = 2M
         ---
         > upload_max_filesize = 384M
         ```
         The above is shown in the diff format.
      3. Make a backup copy of the new PHP ini file:
         ```shell
         cp php.ini /root/backup/
         ```
   3. Restart Apache2 to load the installed PHP module:
      ```shell
      apache2ctl restart
      ```

### Creating the empty wordpress database in MariaDB

1. Connect as your user then change to the tocsorg_web user:
   1. `gcloud compute ssh registration-wp-west1-b-1`
   2. After connected, change to tocsorg_registration user:
      ```shell
      sudo -u tocsorg_web -H bash --login
      cd
      ```

2. Connect to the MariaDB server and create the new database:
   1. Connect to MariaDB:
      ```shell
      mariadb -u tocsorg_web -p
      ```
   2. Add the new database:
   ```mariadb
   CREATE DATABASE tocsorg_school;
   ```

3. Disconnect from the MariaDB server:
   `exit`
   
### Install WordPress

1. Create the web directory under **/var/www**:
   1. Connect as your user then change to the root user:
      1. `gcloud compute ssh registration-wp-west1-b-1`
      2. After connected, change to root user:
         ```shell
         sudo -u root -H bash --login
         cd
         ```
   2. Create the directory **/var/www/web** and change the ownership to tocsorg_web:
      ```shell
      mkdir /var/www/web
      chown tocsorg_web:tocsorg_web /var/www/web
      ```

2. Setup a copy of the initial WordPress code:
   Change to the user tocsorg_web and download the latest WordPress package to the web directory:
   ```shell
   sudo -u tocsorg_web -H bash --login
   cd 
   wget https://wordpress.org/latest.tar.gz
   tar zxvf latest.tar.gz
   cd wordpress
   mv * /var/www/web/
   cd 
   mkdir backup
   mv latest.tar.gz backup/
   rmdir wordpress
   ```
   
3. (Continue in the tocsorg_web user session) create WordPress configuration so that it can connect to the database:
   1. Create a new WordPress config file by copying from the sample file:
      ```shell
      cd /var/www/web
      cp wp-config-sample.php wp-config.php
      ```
   2. Edit the file **/var/www/web/wp-config.php** and put in proper database connection information.
   3. Edit the file **/var/www/web/wp-config.php** and put in randomly generated keys and salts.
      Values generated from online tool <https://api.wordpress.org/secret-key/1.1/salt/>
   4. Add the following lines at the end of the file **/var/www/web/wp-config.php** to allow direct upload without FTP:
      ```php
      /* Allow direct file upload without using FTP */
      define('FS_METHOD', 'direct');
      ```
   5. Keep a backup of the updated WordPress configuration:
      ```shell
      vi /var/www/registration/config/database.yml
      cp /var/www/web/wp-config.php /home/tocsorg_web/backup/
      ```
   
4. Setup and enable the Apache configuration for the site:
   1. Connect as your user then change to the root user:
      1. `gcloud compute ssh registration-wp-west1-b-1`
      2. After connected, change to root user:
         ```shell
         sudo -u root -H bash --login
         cd
         ```
   2. Change the ownership of the WordPress directory tree to the apache run user www-data:
      ```shell
      cd /var/www
      chown -R www-data:www-data web
      ```
   3. Create the file **/etc/apache2/sites-available/web.conf** with the following content:
      ```text
      <VirtualHost *:80>
          ServerName info.to-cs.org
          ServerAlias to-cs.org
          ServerAlias www.to-cs.org

          ServerAdmin webmaster@to-cs.org

          DocumentRoot /var/www/web

          ErrorLog ${APACHE_LOG_DIR}/error.log
          CustomLog ${APACHE_LOG_DIR}/access.log combined
      </VirtualHost>
      ```
      This contains the minimum configuration of a plain HTTP site mapped to the WordPress code.
   4. Enable this new site configuration:
      ```shell
      a2ensite web
      apache2ctl restart
      ```

5. Execute the WordPress installation script:
   1. Use a web browser and load the page pointing to the installation script <http://info.to-cs.org/wp-admin/install.php>
   2. Enter the following values when prompted in the page:
      ```text
      Site Title: Thousand Oaks Chinese School
      Username: webmaster
      Password using the one generated by the page
      Your Email: webmaster@to-cs.org
      ```
   3. Clicked on the button "Install WordPress".
   4. After the installation completed successfully, test by logging-in with the webmaster credential.

### Move WordPress site from the old server to the new server

1. Create a migration package from the old server:
   1. Install and activate the plugin "All-in-One WP Migration" in the WordPress site on the old server.
   2. Use the plugin to export a migration package, with the following text replacement:
      ```text
      www.to-cs.org/tocs/ => info.to-cs.org/
      ```
      Download the migration package to the local machine.
   
2. Import the migration package to the new server:
   1. Install and activate the plugin "All-in-One WP Migration" in the WordPress site on the new server.
   2. Use the plugin to import the migration package generated above.
   3. As part of the importing process, confirm the basic settings and the PermaLink settings.

### Setup SMTP email sending

WordPress is not able to send email using the default settings since it would only use PHP mail() function, 
which uses the local sendmail process on the server.  This won't work for a Cloud server instance such as the 
one in Google Compute Engine we are using.  We have to install a plugin to use SMTP email sending.

1. Install and activate the plugin "WP Mail SMTP" in the WordPress site on the new server.
2. Configure the plugin using the "Other SMTP" mailer option and put in our Google Workspace SMTP relay configuration.
   The "Gmail" mailer option would not work since it uses published G Suite app API, which is not how our SMTP relay 
   is setup.



