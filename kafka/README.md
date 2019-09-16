# MongoDB Kafka Connector Demo

Updated documentation: https://docs.google.com/document/d/1ypF-OcleK1ZtC-lnpfB5COD5ESBa9dox-zpGkKBejUo


1. Launch t2.medium instance on AWS
2. sudo yum install java
3. Install Kafka: <https://kafka.apache.org/documentation/#quickstart>
4. Rename the folder to kafka
5. Create the plugins folder: mkdir -p kafka/plugins/kafka-connect-mongodb
6. Add the plugins folder /user/ec2-user/kafka/plugins to config/connect-standalone.properties
7. Download the mongodb java driver and move it into the kafka-connect-mongodb folder
8. Download the mongodb kafka connector: <https://www.confluent.io/hub/mongodb/kafka-connect-mongodb>
9. Unzip the connector file to kafka/plugins/kafka-connect-mongodb
10. Start Zookeper: bin/zookeeper-server-start.sh config/zookeeper.properties
11. bin/zookeeper-server-start.sh -daemon config/zookeeper.properties > ~/zookeeper-logs
12. bin/kafka-server-start.sh -daemon config/server.properties > ~/kafka-logs
13. bin/kafka-topics.sh --create --bootstrap-server localhost:9092 --replication-factor 1 --partitions 1 --topic low.demo.kafka
14. bin/kafka-topics.sh --list --bootstrap-server localhost:9092
15. Update connection string in MongoSourceConnector.properties and move it to the kafka/config folder
16. nohup bin/connect-standalone.sh config/connect-standalone.properties config/MongoAtlasInventorySourceConnector.properties > ~/kafka-mongo-atlas-inventory-source.log &

bin/connect-standalone.sh -daemon config/connect-standalone.properties config/MongoAtlasInventorySourceConnector.properties > ~/kafka-mongo-atlas-inventory-source.log

bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic low.demo.kafka
