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

8. Setup JAVA_HOME and other environments. (All nodes)

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

9. Create a directory for HDFS to store its important files. (All nodes)

   ```shell
   sudo mkdir -p /usr/local/hadoop/hdfs/data
   ```

10. Set the permission to the file. (All nodes)

    ```shell
    sudo chown -R hadoop:hadoop /usr/local/hadoop/hdfs/data
    ```

11. Update core_site.xml file. (All nodes)

    ```shell
    vi ~/hadoop/hadoop-3.1.4/etc/hadoop/core-site.xml
    ```

    In master node, change the content to be like this. (IP in value tag is 0.0.0.0 to accept external ip)

    ```xml
    <configuration>
      <property>
        <name>fs.default.name</name>
        <value>hdfs://0.0.0.0:9000/</value>
      </property>
    </configuration>
    ```

    In slave nodes, change the content to be like this. (IP in value tag is IP of master node)

    ```xml
    <configuration>
      <property>
        <name>fs.default.name</name>
        <value>hdfs://10.148.0.8:9000/</value>
      </property>
    </configuration>
    ```

12. Create public-private key-pair on every nodes. (All nodes)

    ```shell
    ssh-keygen
    ```

13. Copy public key from master node. (Master node)

    ```shell
    cat ~/.ssh/id_rsa.pub
    ```

    After you see the content of file, make sure that you copy the content of this file.

14. Copy master node’s public key into authorized_keys file of every node. (All nodes)

    ```shell
    vi ~/.ssh/authorized_keys
    ```

    Make sure that you paste public key of master node to authorized_keys file of every nodes.

15. On hadoop-master, open ssh configuration file. (Master node)

    ```shell
    vi ~/.ssh/config
    ```

    Add the content to be like this. (Host and host name is IP of your VM)

    ```xml
    Host 34.101.229.166
        HostName 34.101.229.166
        User hadoop
        IdentityFile ~/.ssh/id_rsa
    
    Host 34.101.169.177
        HostName 34.101.169.177
        User hadoop
        IdentityFile ~/.ssh/id_rsa
    
    Host 34.101.128.39
        HostName 34.101.128.39
        User hadoop
        IdentityFile ~/.ssh/id_rsa
    ```

16. Config hdfs-site.xml on master node. (Master node)

    ```shell
    vi ~/hadoop/hadoop-3.1.4/etc/hadoop/hdfs-site.xml
    ```

    Change the content to be like this. (IP in value is IP of one of your slave node)

    ```xml
    <configuration>
      <property>
        <name>dfs.replication</name>
        <value>3</value>
      </property>
      <property>
        <name>dfs.namenode.name.dir</name>
        <value>file:///usr/local/hadoop/hdfs/data</value>
      </property>
      <property>
        <name>dfs.secondary.http.address</name>
        <value>34.101.169.177:50090</value>
      </property>
    </configuration>
    ```

    