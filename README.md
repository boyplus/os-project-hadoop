## CSC217 Operating System Individual Project (Hadoop)

## 62130500212 Thanaphon Sombunkaeo

## Virtual Machine

> Create three Virtual Machines (Ubuntu18.0.4) on Google Cloud

- hadoop-master: 34.101.229.166
- hadoop-worker1: 34.101.169.177
- hadoop-worker2: 34.101.128.39

## Steps to set up hadoop

1. Create 3 virtual machine (1 master, 2 workers) and open every port for all virtual machines

2. SSH to each virtual machine.

3. Create non-root user and switch to that user. (This case I create user name hadoop, if you use another username, make sure that in other stpes you use your username, not hadoop).

   ```shell
   sudo adduser hadoop
   sudo adduser hadoop sudo
   sudo su - hadoop
   ```

4. Update Ubuntu to the latest version. (All nodes)

   ```shell
   sudo apt-get update && sudo apt-get -y dist-upgrade
   ```

5. Install Headless version of Java for Ubuntu. (All nodes)

   ```shell
   sudo apt-get -y install openjdk-8-jdk-headless
   ```

6. Create a directory for hadoop to be installed. (All nodes)

   ```shell
   mkdir hadoop && cd hadoop
   ```

7. Download and unzip Hadoop version 3.1.4 archive. (All nodes)

   ```shell
   wget https://downloads.apache.org/hadoop/common/hadoop-3.1.4/hadoop-3.1.4.tar.gz
   ```

8. Setup JAVA_HOME and other environments

   ```shell
   vi ~/hadoop/hadoop-3.1.4/etc/hadoop/hadoop-env.sh
   ```

   At the top of file you should add environments like this.

   ```shell
   export JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64
   export HDFS_NAMENODE_USER="hadoop"
   export HDFS_DATANODE_USER="hadoop"
   export HDFS_SECONDARYNAMENODE_USER="hadoop"
   export YARN_RESOURCEMANAGER_USER="hadoop"
   export YARN_NODEMANAGER_USER="hadoop"
   ```

   Exit and save file, then activate the environments

   ```shell
   source ~/hadoop/hadoop-3.1.4/etc/hadoop/hadoop-env.sh
   ```

9. Create a directory for HDFS to store its important files.

   ```shell
   sudo mkdir -p /usr/local/hadoop/hdfs/data
   ```

10. Set the permission to the file.

    ```shell
    sudo chown -R hadoop:hadoop /usr/local/hadoop/hdfs/data
    ```

    