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
    --volume $(pwd)/data/db:/data/db \
    --volume=$(pwd)/data/seed-data:/input-data \
    --name policy-search \
    -d \
    mongo
```

> Note: The second volume mount points where you have checked out the `care-to-compare-search-api` repo.

> Note: If you have already imported data in you need to drop the Mongo policies collection i.e. db.policies.drop()

Import the policy data:
```bash
docker exec -it policy-search bash -c "mongoimport --db policy-search-db --collection policies --drop --type json --file /input-data/policies-2018.json --jsonArray"
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
The Search API has been implemented using `GraphQL`. After start up visit http://localhost:4000/graphql, and look at what is available.

For example:
```
query{
  Policies(
    policyType: HOSPITAL
    categoryOfCover: SINGLES
    state: VIC
    hospitalInclusions: [
      HEART_SUGERY
      JOINT_REPLACEMENTS
    ]
    maxMonthlyPremium: 150
    page: 0
    pageSize: 3
  ) {
    policies {
      id
      fundName
      policyName
      policyType
      monthlyPremium
      hospitalComponent {
        coPayments
        excess {
          perHospitalVisit
          maxPerPerson
          maxPerAnnum
        }
        inclusions {
          category
          covered
        }
      }
    }
    meta {
      page
      pageSize
      total
    }
  }
}
```
> This query returns hosptial policies (only requested attributes) for policies that covers `Singles` and in `VIC` and with maximum monthly premium of $150. Also page 0 is requested with page size of 3.
