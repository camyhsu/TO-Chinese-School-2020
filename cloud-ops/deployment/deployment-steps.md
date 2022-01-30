
# Registration App Update Deployment

This document describes the deployment steps for updating TOCS registration applications created around year 2021 - 2022.
The registration applications include two parts, the front-end single-page React app, and a back-end nodejs Express 
API server.  This doc has only the steps for updating the applications with newer versions.  For the initial setup 
of the server environment and the first deployment, please refer to the other document 
[New Registration App Deployment](../new-registration-app-deployment-2021q4.md)

## Front-end Update

1. Run the packaging script in the local check-out:
   ```shell
   ./package-tocs-front-end-preview.sh
   ```
   Note that the packaging scripts are different for different environments (preview v.s. production).  This is because
   the back-end server URL is part of the packaged build and they are different for different environments.

2. Upload the code package to the server (example command, actual filename likely different):
   ```shell
   gcloud compute scp tocs-front-end-build-preview-202201301331.tar.gz registration-wp-west1-b-1:~/
   ```

3. Connect as your user then change to the tocsorg_registration user:
   1. `gcloud compute ssh registration-wp-west1-b-1`
   2. After connected, change to tocsorg_registration user:
      ```shell
      sudo -u tocsorg_registration -H bash --login
      cd
      ```

4. Copy over the package to the deployment directory:
   ```shell
   cd deployment
   cp /home/engineering1/tocs-front-end-build-preview-202201301331.tar.gz .
   ```
   Note that your home directory and the package filename could be different.

5. Execute the deployment script.  For example:
   ```shell
   ./update-tocs-front-end-preview.sh tocs-front-end-build-preview-202201301331.tar.gz
   ```
   Note that the deployment update scripts are different for different environments.

6. Verify that the update is successful.

7. Move the code package to the backup directory:
   ```shell
   mv tocs-front-end-build-preview-202201301331.tar.gz ~/backup/react-code/
   ```

8. Clean up the file in the home directory:
   ```shell
   exit
   cd
   rm tocs-front-end-build-preview-202201301331.tar.gz
   ```


## Back-end Update

1. Run the packaging script in the local check-out:
   ```shell
   ./package-tocs-back-end.sh
   ```
   
2. Upload the code package to the server (example command, actual filename likely different):
   ```shell
   gcloud compute scp tocs-back-end-build-202112191046.tar.gz registration-wp-west1-b-1:~/
   ```
   
3. Connect as your user then change to the tocsorg_registration user:
    1. `gcloud compute ssh registration-wp-west1-b-1`
    2. After connected, change to tocsorg_registration user:
       ```shell
       sudo -u tocsorg_registration -H bash --login
       cd
       ```

4. Copy over the package to the deployment directory:
   ```shell
   cd deployment
   cp /home/engineering1/tocs-back-end-build-202112191115.tar.gz .
   ```
   Note that your home directory and the package filename could be different.

5. Make sure the needed configuration and the deployment script is up-to-date inside the deployment directory.
   For example, to update the preview environment, we need the latest *back-end-preview.json* and 
   *update-tocs-back-end-preview.sh* in the deployment directory.  Copies of the update scripts should be in the 
   code repository, but the configuration files are likely not since they may hold sensitive data.
   
6. Execute the deployment script.  For example:
   ```shell
   ./update-tocs-back-end-preview.sh tocs-back-end-build-202112191115.tar.gz
   ```
   Note that the deployment update scripts are different for different environments.

7. Verify that the update is successful.
   
8. Move the code package to the backup directory:
   ```shell
   mv tocs-back-end-build-202112191115.tar.gz ~/backup/express-code/
   ```
   
9. Clean up the file in the home directory:
   ```shell
   exit
   cd
   rm tocs-back-end-build-202112191115.tar.gz
   ```
