## CSC217 Operating System Individual Project (Hadoop)

## 62130500212 Thanaphon Sombunkaeo

## Virtual Machine

> Create three Virtual Machines (Ubuntu18.0.4) on Google Cloud

- hadoop-master: 137.116.150.214
- hadoop-worker1: 104.215.184.216
- hadoop-worker2: 13.76.26.55

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
   
   tar xvzf hadoop-3.1.4.tar.gz
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
        <value>hdfs://137.116.150.214:9000/</value>
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
    Host 137.116.150.214
        HostName 137.116.150.214
        User hadoop
        IdentityFile ~/.ssh/id_rsa
    
    Host 104.215.184.216
        HostName 104.215.184.216
        User hadoop
        IdentityFile ~/.ssh/id_rsa
    
    Host 13.76.26.55
        HostName 13.76.26.55
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
        <value>104.215.184.216:50090</value>
      </property>
    </configuration>
    ```

17. Config mapred-site.xml on master node. (Master node)

    ```shell
    vi ~/hadoop/hadoop-3.1.4/etc/hadoop/mapred-site.xml
    ```

    ```xml
    <configuration>
      <property>
        <name>mapreduce.jobtracker.address</name>
        <value>137.116.150.214:54311</value>
      </property>
      <property>
        <name>mapreduce.framework.name</name>
        <value>yarn</value>
      </property>
      <property>
        <name>yarn.nodemanager.vmem-check-enabled</name>
        <value>false</value>
      </property>
      <property>
        <name>yarn.app.mapreduce.am.env</name>
        <value>HADOOP_MAPRED_HOME=${HADOOP_HOME}</value>
      </property>
      <property>
        <name>mapreduce.map.env</name>
        <value>HADOOP_MAPRED_HOME=${HADOOP_HOME}</value>
      </property>
      <property>
        <name>mapreduce.reduce.env</name>
        <value>HADOOP_MAPRED_HOME=${HADOOP_HOME}</value>
      </property>
    </configuration>
    ```
    
18. Config yarn-site.xml on master node. (Master node)

    ```shell
    vi ~/hadoop/hadoop-3.1.4/etc/hadoop/yarn-site.xml
    ```

    ```xml
    <configuration>
      <property>
        <name>yarn.nodemanager.aux-services</name>
        <value>mapreduce_shuffle</value>
      </property>
      <property>
        <name>yarn.nodemanager.aux-services.mapreduce.shuffle.class</name>
        <value>org.apache.hadoop.mapred.ShuffleHandler</value>
      </property>
      <!-- Site specific YARN configuration properties -->
    </configuration>
    ```

19. Config masters file on master node. (Master node)

    ```shell
    vi ~/hadoop/hadoop-3.1.4/etc/hadoop/masters
    ```

    ```
    137.116.150.214
    ```

20. Config workers file on master node. (Master node)

    ```shell
    vi ~/hadoop/hadoop-3.1.4/etc/hadoop/workers
    ```

    ```
    localhost
    104.215.184.216
    13.76.26.55
    ```

21. Config hdfs-site.xml file on worker nodes. (All slave nodes) (IP in value is IP of master node)

    ```shell
    vi ~/hadoop/hadoop-3.1.4/etc/hadoop/hdfs-site.xml
    ```

    ```xml
    <configuration>
      <property>
        <name>yarn.nodemanager.aux-services</name>
        <value>mapreduce_shuffle</value>
      </property>
      <property>
        <name>yarn.nodemanager.aux-services.mapreduce.shuffle.class</name>
        <value>org.apache.hadoop.mapred.ShuffleHandler</value>
      </property>
      <property>
        <name>yarn.resourcemanager.hostname</name>
        <value>137.116.150.214</value>
      </property>
    </configuration>
    ```

22. Config hots (All nodes)

    ```shell
    sudo vi /etc/hosts
    ```

    ```
    127.0.0.1 localhost
    137.116.150.214 hadoop-master
    104.215.184.216 hadoop-worker-01
    13.76.26.55 hadoop-worker-02
    ```

23. Setup alias and environment variable (All nodes)

    ```shell
    vi ~/.bashrc
    ```

    add this content on top of the file

    ```shell
    alias hadoop="~/hadoop/hadoop-3.1.4/bin/hadoop"
    alias hadoop_start="~/hadoop/hadoop-3.1.4/sbin/start-all.sh"
    alias hadoop_stop="~/hadoop/hadoop-3.1.4/sbin/stop-all.sh"
    alias hadoop_clear="sudo ~/hadoop/hadoop-3.1.4/bin/hdfs namenode -format"
    alias hadoop_logs="cd ~/hadoop/hadoop-3.1.4/logs"
    alias hadoop_setting="cd ~/hadoop/hadoop-3.1.4/etc/hadoop"
    export HADOOP_HOME="~/hadoop/hadoop-3.1.4"
    ```

    activate the .bashrc file

    ```shell
    source ~/.bashrc
    ```

24. Start Hadoop (on master node)

    You can go to hadoop installation directory to start hadoop or use alias to start

    ```shell
    cd ~/hadoop/hadoop-3.1.4/
    ```

    ```shell
    sudo ./bin/hdfs namenode -format
    ```

    ```shell
    sudo ./sbin/start-all.sh
    ```

    (Optional -> start hadoop by alias command)

    (This command use to clear namnode, you only run this command only once or when you want to clear name node)

    ```shell
    hadoop_clear
    ```

    ```shell
    hadoop_start
    ```

25. Test services of Hadoop

    After you run

    ```shell
    jps
    ```

    On master node you should see like this

    ```
    10867 NodeManager
    11411 Jps
    10149 NameNode
    10329 DataNode
    10681 ResourceManager
    ```

    On slave node, you should see like this (SecondayNameNode only run in node that you set it as a secondary name node)

    ```
    24086 NodeManager
    23928 SecondaryNameNode
    23741 DataNode
    24461 Jps
    ```

    You can access to your master node ip and port 9870 to see the information of cluster (in DataNodes page, you should see 3 data nodes running)

    ```
    http://137.116.150.214:9870/
    ```

## Example of hdfs (Hadoop File System) command

> All of these command execute in the mastre node (All of command similar to linux command)

1. **Create directory** (mkdir)

   ```
   hadoop fs -mkdir input
   hadoop fs -mkdir output
   ```

2. **list** all directory and files in hdfs. (You should see /input) (ls)

   ```shell
   hadoop fs -ls /
   ```

3. **Put file** from local to hdfs (You need to create file inside your vm first)

   ```shell
   cd ~
   vi input_1
   ```

   You can put any text inside the file

   ```
   hello world boy hello boy test
   ```

   ```shell
   hadoop fs -put input_1 /input
   ```

4. **See content of file** (cat)

   ```shell
   hadoop cat /input/input_1
   ```

5. **Remove directory** (rm)

   ```shell
   hadoop fs -rm /output
   ```

6. **Remove directory and all files inside directory** (rm -R)

   ```shell
   hadoop fs -rm -R /input
   ```

## Run simple mapreduce (Word Count Program)

> All of these command run in user directory (cd ~)

1. Install hadoop core

   ```shell
   wget https://repo1.maven.org/maven2/org/apache/hadoop/hadoop-core/1.2.1/hadoop-core-1.2.1.jar
   ```

2. Create WordCount.java

   ```shell
   vi WordCount.java
   ```

   copy content from this link into file

   https://www.dropbox.com/s/yp9i7nwmgzr3nkx/WordCount.java?dl=0

3. Create input file and put it into hdfs

   ```shell
   vi input_1
   ```

   ```
   hello world boy hello boy test
   ```

   ```shell
   hadoop fs -mkdir /input
   hadoop fs -put input_1 /input
   ```

4. Create jar file from WordCount.java

   ```shell
   mkdir mapR
   javac -classpath hadoop-core-1.2.1.jar -d mapR WordCount.java
   jar -cvf WordCount.jar -C mapR/ .
   ```

5. Run the jar file (all files in /input in hdfs will be the input of program)

   ```shell
   hadoop jar WordCount.jar WordCount /input /output
   ```

6. After the mapreduce job is finished, you can see the output in /output directory

   ```shell
   hadoop fs -ls /output
   hadoop fs -cat /output/<file that you see from above command>
   ```

   The output is a mapping between word and count of that word

## TroubleShooting

> If you start the hadoop but some service is missing, you can see the log of error

This command will change directory to log directory

```shell
hadoop_logs
```



### Data Node is not starting