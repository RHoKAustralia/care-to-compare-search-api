# Care2Compare Search Service

## Installation

```
npm install
```

## Running the application

```
docker run \
    --publish=27017:27017 \
    --volume $HOME/mongodb/data:/data/db \
    --volume=$HOME/caretocompare/data:/input-data \
    --name policy-search \
    -d \
    mongo

npm start
```

## Search

POST to the /policies/search endpoint with the correct payload:

```
curl  -H "Content-Type: application/json" -X POST -d '{"fundType":"Open","category":"Two adults"}' localhost:3000/policies/search
```


## Loading the data into Mongo DB

Run the MongoDB database if not already running:

```
docker run \
    --publish=27017:27017 \
    --volume $HOME/mongodb/data:/data/db \
    --volume=$HOME/caretocompare/data:/input-data \
    --name policy-search \
    -d \
    mongo
```

Load the data into the MongoDB database

```
docker exec -it policy-search bash -c "mongoimport --db policy-search-db --collection policies --type json --file /input-data/policies-updated.json --jsonArray"
```