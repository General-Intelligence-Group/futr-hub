# 1. Installation of data platform

The repository provides a 4-Step-Guide to install a preconfigured data platform.

Steps 1 - 3 only describe the preparation of the configuration.

In Step 4 you will install the environment with these 4 Ansible Playbooks

* Playbook 1: Prepare a Base System
* Playbook 2: Install Docker and needed tools
* Playbook 3: Deploy and configure containers

## 1.1. Prerequisites

You need at least the following infrastructure to run the environment on a remote host:

* 4 vCPUs
* 8 GB of RAM
* 50 + X GB of SSD (depending on your PoC Data)
* Ubuntu 20.04 LTS or Debian 10 as Operating System
* Login Data for root User (will be deactivated during installation)
* The Server must be reachable from the Internet to make Let's Encrypt Mechanism working
* In best case you use a wildcard (sub-)domain for the Remote Servers IP, e.g. `*.sandbox.<domain.tld>`

  In this case, all hosts names that are needed get an working hostname. All currently used hostnames can be found at the end of this document.
* Important: On the remote machine the remote login for root must be enabled for the first playpook. If this is not active by default, please login to the machine and execute the following steps:

  Edit file `/etc/ssh/sshd_config` and set the value `PermitRootLogin yes`.

  Save and close the file.

  Execute `systemctl restart sshd.service`

Additionally you need a „local“ machine to run Ansible with installed sshpass. This will be referenced in the following as „local system“ but can be any Ansible compatible system you have access to.

## 1.2. Installation Step 1

### 1.2.1. Install Ansible

To use the repository an Ansible Installation on the local system is needed. We recommend to install Ansible via pip. To do this, please follow the official [Ansible Documentation](https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html#installing-ansible-with-pip).

In addition, please install `jmespath` that is used to set facts in the playbooks (e.g. `sudo apt install python3-jmespath`).

Alternativly you can install ansible via apt:<br>
Since Ansible 2.10 there are two ways to install Ansible.
1. If you install `sudo apt install ansible`, the Ansible Base incl. Colleactions will be installed (same scope as all versions before 2.10)
2. If you install `sudo apt install ansible-base`, only the Ansible Base will be installed

In case of variant 2 you have to install additional collections to run these scripts:

To do this, please execute the following commands:
- `ansible-galaxy collection install community.grafana`

### 1.2.2. Clone the repository

Clone this repository to a location you like on you local system.

## 1.3. Installation Step 2

### 1.3.1. Configure the remote host

In the root folder of the repository a `inventory.default`. Please copy this to a files called `inventory` and adjust the contents to your needs. Normally, you only have to add you IP address of the remote system in this line:

``` bash
#########################################################################
# The "servers" groups contains the remote hosts
#########################################################################

[servers]
demo ansible_host=<ip>
```

### 1.3.2. Configure central external values for the deployment

The repository contains several Ansible Playbooks - each in a seperate subfolder. The starting numbers of the the subfolders define the sequence to execute the playbooks.

All Playbooks have seperate Variable Sets defined. These are defined by the vars/default.yaml in the respective subfolder. these variables are used internally for the configuration of the components.

External values are defined in the `inventory` file again. Please configure the following variables according to your needs.

``` bash
#########################################
# Inventory for Urban Data Platform Setup
#########################################

#########################################################################
# The "servers" groups contains the remote hosts
#########################################################################

[servers]
demo ansible_host=<IP>

##########################################################################
# Makes sure we use Python 3 (/usr/bin/python3) on remote hosts.
# [servers:vars] sets global values for all nodes in the "servers" group.
# This is necessary because by default Ansible will try to use
# /usr/bin/python, which is not available on newer Ubuntu versions.
#########################################################################

[servers:vars]
ansible_python_interpreter=/usr/bin/python3
ansible_ssh_pipelining=true

####################################################
# External Data - please provide valid configuration
####################################################

# Subdomain for the PoC Installation
DOMAIN=<server.domain.com>
# Emails Address for Let's Encrypt Registration
EMAIL=dns@urban-data.cloud

# Unix User Name to run to Platform
CREATE_USER=mrdocker

# Filename template of private and public ssh key to use - standard: id_rsa_sc_admin
# Filenames will be ~/.ssh/$SSH_KEY_NAME for private key and ~/.ssh/$SSH_KEY_NAME.pub for public key
SSH_KEY_NAME='id_rsa_sc_admin'
# Password for the central platform admin (to be created with frist installation)
SC_ADMIN_PASSWORD='<password>'

# Sender Email Address for generated Emails
SC_EMAIL_FROM='demo@<server.domain.com>'
# Email SMTP Server
SC_EMAIL_SERVER='<email.domain.com>'
# Email Server Login
SC_EMAIL_USER='<user>'
# Email Server Password
SC_EMAIL_PASSWORD='<password>'

# Keycloak DB Password
KEYCLOAK_POSTGRES_PASSWORD='<password>'
# Keycloak master realm name (change only, of you know what you are doing)
KEYCLOAK_REALM_MASTER: 'master'
# Keycloak default realm name
IDM_REALM: '<default_realm>'
# Keycloak default client name
IDM_CLIENT: '<default_client>'

# API Key for Open Weather Map Access
SC_OWM_API_KEY='<OWN_API_KEY>'
# ID of wished OWM Station
SC_OWM_STATION='OWM_STATION_ID'
# ID of Wished Open Sense Map Sensor
SC_OSM_SENSOR_ID='<OSM_SENSOR_ID>'

# Gitlab User used to to clone the needed repos in node red
NR_GIT_LOGIN='<user>'
# Git Token used to to clone the needed repos in node red.
# Depending on your authentication method please provide you login credentials (e.g. if you use 2FA use a specific token and so on)
NR_GIT_TOKEN='<token>'
# Repo for external flows (external API Integration)
# Example: gitlab.com/urban-data/demo-flows/urban-data-external-demo-flows.git
NR_EXT_GIT_REPO='gitlab.com/urban-data/demo-flows/urban-data-external-demo-flows.git'
# Repo for connector flows (Connector Integration)
# Example: gitlab.com/urban-data/demo-flows/urban-data-conn-demo-flows.git
NR_CON_GIT_REPO='gitlab.com/urban-data/demo-flows/urban-data-conn-demo-flows.git'
# Repo Target folder
NR_REPO_TARGET_FOLDER='sc-node-red-flows'
# Key to encrypt/decrypt Nodered Secrets in Node Red Project
NR_SECRETS_KEY='<nodered_secrets_key>'

# TimescaleDB Password
TIMESCALE_PASSWORD='<password>'

# FROST-DB Password
FROST_DB_PASSWORD='<password>'

# Key for Session Encryption of keycloak-gatekeyer (16 or 32 signs)
AUTH_ENCRYPTION_KEY='<AUTH_KEY>'

# Grafana Admin Password. Necessary to import Dashboards after deployment.
GRAFANA_ADMIN_PASSWORD='<grafana_admin_password>'

# Only applicable if Gitlab Docker Registry is used
# Gitlab registry username
REGISTRY_ACCESS_USER='<USERNAME>'
# Gitlab registry RW access token
REGISTRY_ACCESS_TOKEN='<ACCESS_TOKEN>'

# AWS S3 compatibel Access Key for min.io, access key length should be at least 3
MINIO_ACCESS_KEY='minio'
# AWS S3 compatibel Secret Key for min.io, secret key length at least 8 characters
MINIO_SECRET_KEY='minio123'
# AWS S3 compatibel Region Name for min.io
MINIO_REGION_NAME='de-fra-rack2'

# Organization Name to be used in several Configurations - only descriptive
ORGANIZATION_NAME="<company/organization_name>"

# Use Case 01 - Twitter
# Generate Bearer Token with:
# curl -u "$API_KEY:$API_SECRET_KEY" --data 'grant_type=client_credentials' 'https://api.twitter.com/oauth2/token'
TWITTER_BEARER_TOKEN="AAAAAAAAAAAAAAAAAAAAA..."
TWITTER_ID="B_TXL"

# Use Case 05 - Luftdaten.info Sensor ID - to be set before Use Case 5 is deployed (normally 5 digits)
LUFTDATEN_INFO_SENSOR_ID='<sensor_id>'

# Use Case 06 - Sensebox Sensor ID - to be set before Use Case 6 is deployed - con be taken from opensensemap Backend
SENSEBOX_SENSOR_ID='<sensor_id>'
```

## 1.4. Installation Step 3

To secure the remote host, we configure the remote host to only accept SSH Login with Public/Private Key Authentication. For this, an existing key is needed, or will be created by the playbook. If an existing key shall be used, please store it into your local `~/.ssh` Folder and set the environment variable `SSH_KEY_NAME` to its name.

## 1.5. Installation Step 4

The follwing steps run the Ansible Playbooks. The commands are prepared to run the Playbooks from the root folder of the repository. If you start from another location, you have to adopt the paths.

### 1.5.1. Basic Server Configuration

The first steps configures the base system. You have to provide the root Password for this first step - all others use the new user. To log in with password, `sshpass` has to be installed (e.g. `sudo apt-get install sshpass`) on your local machine.

Please adjust the name behind `-l ` according to your inventory. The line `demo ansible_host=<IP>` starts with the name you need. This is needed for all of the following steps.

``` bash
ansible-playbook 01_setup_base/playbook.yml -l demo -u root -k -i inventory
```

The first playbook will interact with `sshpass` and ask you for the root password of the target host. (Do not get confused with the prompt, since it will only say `SSH:`)<br>
If you want to use the playbook without interaction (e.g. in a CI/CD pipeline), you can provide the password on the command line `-e 'ansible_password=YourRootPassword'` or in your inventory file:

``` bash
[all:vars]
ansible_password=YourRootPassword
```

If you use the inventory, please omit the `-k` parameter for `ansible-playbook`.

### 1.5.2. Docker Installation

``` bash
ansible-playbook 02_setup_docker/playbook.yml -l demo -u mrdocker --private-key ~/.ssh/id_rsa_sc_admin -i inventory
```

### 1.5.3. Basic Platform Installation

The basic platform installation includes a traefik service that is configured to automatically get letsencrypt certificates for all sub domains. If you want to use an existing certificates store, place the traefik `acme.json` file to `03_setup_containers_plattform/files/trafik`. It will be pushed into the `traefik certs volume` by ansible. The `acme.json` can be obtained after a first complete deployment from the traefik container from the `/certs` directory (or by using the third playbook with tag `acme_copy`: `ansible-playbook 03_setup_containers_plattform/playbook.yml -l demo -u mrdocker --private-key ~/.ssh/id_rsa_sc_admin -i inventory -t "acme_copy"`).

``` bash
ansible-playbook 03_setup_containers_plattform/playbook.yml -l demo -u mrdocker --private-key ~/.ssh/id_rsa_sc_admin -i inventory
```

## 1.6. Use the PoC Environment

Now you are ready to use the preconfigured PoC Environment. These are the important URLs to use:

* https://idm.<server.domain.com>             --> IDM Keycloak
* https://api.<server.domain.com>/ 			      --> API Portal
* https://apigw.<server.domain.com>/       	  --> API Gateway
* https://api.<server.domain.com>/manage/     --> API Management UI (mind trailing slash)
* https://api.<server.domain.com>/management/ --> API Management API
* https://api.<server.domain.com>/portal/     --> API Portal API
* https://portainer.<server.domain.com>       --> Container Management
* https://nr-admin-ext.<server.domain.com>    --> Nodered UI external Flows
* https://grafana.<server.domain.com>         --> Grafana for Data Management
* https://monitoring.<server.domain.com>      --> Grafana for System Monitoring
User admin@<server.domain.com> - Password as configured.

ENJOY!

## 1.7. Use the GitLab CI/CD

The repository comes with a GitLab CI pipeline preconfigured. To make it happen, please configure the following variables in your GitLab `Settings -> CI/CD -> Variables`:

* File: `DEPLOY_KEY_PRIVATE_PROD`: private ssh key
* File: `DEPLOY_KEY_PUBLIC_PROD`: public ssh key
* File: `INVENTORY_PROD`: ansible inventory file
* Variable: `TARGET_HOST_PROD`: IP address of target host
* Variable: `TARGET_HOSTNAME_PROD`: name of target host from inventory (e.g. demo)

To retrieve the contents of these variables, please run the first playbook locally and copy the data from your local ssh keys and inventory.
The gitlab-ci expects the private and public ssh key names to be `id_rsa_sc_admin`. Please set this variable within your inventory accordingly in the GitLab variable.
Make sure, the private ssh key in `DEPLOY_KEY_PRIVATE_PROD` ends with an empty line in the GitLab file variable.
