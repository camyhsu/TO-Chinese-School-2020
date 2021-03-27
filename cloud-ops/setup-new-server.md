
# Setup new server

## Pre-requisites

Create the instance through Google Cloud Console (see screenshots in engineering google drive 
`google-compute-backup/vm-creation-screenshots` for the configuration settings used).

Note that the VM instance created uses UTC by default, which is good.

Setup Google Cloud SDK for access and connect through SSH using Cloud SDK.  See <https://cloud.google.com/sdk> for 
details on installing and using Google Cloud SDK.  The rest of this document describes steps executed through SSH 
sessions.


## Apache base installation

1. Connect as your user then change to the root user:
   1. `gcloud compute ssh registration-wp-west1-b-1`
   2. After connected, change to root user: 
   `sudo -u root -H bash --login`
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
   

## PostgreSQL base installation

1. Connect as your user then change to the root user:
    1. `gcloud compute ssh registration-wp-west1-b-1`
    2. After connected, change to root user:
       `sudo -u root -H bash --login`
    3. Run system update (this should be done periodically):
    ```shell
    apt-get update
    apt-get upgrade
    apt autoremove
    ```

2. Install the Ubuntu package for PostgreSQL:
   `apt-get install postgresql`

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

4. I checked the authentication file **/etc/postgresql/12/main/pg_hba.conf** and decided to keep it with all default 
   settings for now.

5. Start the PostgreSQL server process:
   `pg_ctlcluster 12 main start`

6. Test local postgres admin can connect to the server:
   1. Change to the postgres role user: 
      `sudo -u postgres -H bash --login`
   2. Connect to the server:
      `psql template1`

