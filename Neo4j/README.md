## INSTALL
following https://neo4j.com/developer/docker-run-neo4j/
```
docker run \
    --name testneo4j \
    -p7474:7474 -p7687:7687 \
    -d \
    -v $HOME/neo4j/data:/data \
    -v $HOME/neo4j/logs:/logs \
    -v $HOME/neo4j/import:/var/lib/neo4j/import \
    -v $HOME/neo4j/plugins:/plugins \
    --env NEO4J_AUTH=neo4j/test \
    neo4j:latest

## ACCESS
connect to http://0.0.0.0:7474 with user:neo4j and password:test

secure connection tbd