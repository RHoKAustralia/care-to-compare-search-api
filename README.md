# Care2Compare Search Service

## Installation

You will need `yarn` installed.

Then run the following to install all project dependancies:
```bash
yarn install
```

## Running the application

You will need `docker`.

Install `mongo` docker image:
```bash
docker pull mongo
```

Start container (from repo directory):
```bash
docker run \
    --publish=27017:27017 \
    --volume $HOME/mongodb/data:/data/db \
    --volume=$(pwd)/seed-data:/input-data \
    --name policy-search \
    -d \
    mongo
```

> Note: the second volume mount points where you have checked out the `care-to-compare-search-api` repo.

Import the policy data:
```bash
docker exec -it policy-search bash -c "mongoimport --db policy-search-db --collection policies --type json --file /input-data/policies.json --jsonArray"
```

Update `policy` database schema:
```bash
docker exec -it policy-search bash -c "mongo policy-search-db /input-data/update-schema.js"
```

Start the search API server:
```bash
yarn start
```
> Note: this starts up using `nodemon`, so any changes will automatically restart the `express` server.

## Search API
The Search API has been implemented using `GraphQL`. After start up visit http://localhost:8080/graphql, and look at what is available.

For example:
```
{
  search(
    typeOfCover: COMBINED,
    categoryOfCover: FAMILIES
    location: ACT
  ) {
    id,
    policyName,
    monthlyPremium,
    typeOfCover,
    categoryOfCover,
    states
  }
}
```
> This query returns policies (only requested attributes) for policies that are `Combined`, covers `Families` and in `ACT`.

Example using fragments:
```
{
  search(typeOfCover: COMBINED, categoryOfCover: FAMILIES, location: VIC, maxMonthlyPremium: 400) {
    id
    fundName
    fundType
    policyName
    monthlyPremium
    typeOfCover
    categoryOfCover
    states
    hospitalInclusions {
      accomodation
    }
    generalInclusions {
      optical {
        ...generalInclusionFragment
      }
      nonPbs {
        ...generalInclusionFragment
      }
    }
  }
}

fragment generalInclusionFragment on GeneralInclusion {
  limits
  benefits
}

```
