## INSTALL
Following https://docs.openproject.org/installation-and-operations/installation/docker/
```
git clone https://github.com/opf/openproject-deploy --depth=1 --branch=stable/11 openproject
cd openproject/compose
docker-compose pull          # Long download
docker-compose up -d
PORT=8090 docker-compose up -d
# Up: http://localhost:8090/
```
###LOGIN
Admin/admin first time, new pass: xxxxxxxxx


## ADMIN
```
docker exec -it e69e6658ba5e /bin/bash # on the container running at 8090
```


## UPGRADE
https://docs.openproject.org/installation-and-operations/operation/upgrading/
```
docker-compose pull
docker-compose up -d
```

I couldn’t find how to run the “openproject reconfigure” command in the above.  So…

## All-In-One
From https://docs.openproject.org/installation-and-operations/installation/docker/#all-in-one-container
```
docker run -it -p 8081:80 -e SECRET_KEY_BASE='xxxxxxxxx' openproject/community:11
# Up: http://localhost:8081/
# But, needed to Ctrl-C out of that.  So run detached:
docker run -d -p 8081:80 -e SECRET_KEY_BASE='xxxxxxxxx' openproject/community:11
# And then attach separately:
docker exec -it 3caeefffbe4d /bin/bash
```

Still didn’t work.. did a bunch of reading, found that there’s an environment variable to set the edition
```
cat bim.env
# OPENPROJECT_EDITION=bim
# SECRET_KEY_BASE='xxxxxxxxx'
docker run -d -p 8081:80 --env-file bim.env openproject/community:11
# wait a few mins..
# Up: http://localhost:8081/
```

Now on BIM edition
