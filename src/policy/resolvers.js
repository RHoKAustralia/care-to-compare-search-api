const lodash = require('lodash')
const sleep = require('sleep')

const OPEN_FUND_TYPE = 'OPEN'

const POLICY_TYPE_HOSPITAL = 'HOSPITAL'
const POLICY_TYPE_EXTRAS = 'EXTRAS'
const POLICY_TYPE_COMBINED = 'COMBINED'

const DEFAULT_PAGE = 1
const DEFAULT_PAGE_SIZE = 3
const DEFAULT_SORT = { monthlyPremium: +1 }

const toInclusionCovered = (inclusion) => ({ category: inclusion, covered: true})
const createInclusionCoveredQuery = (inclusions) => ({ $all: inclusions.map(toInclusionCovered) })

const createDbQuery = (searchCriteria) => {
    
    const { policyType, categoryOfCover, state, maxMonthlyPremium, hospitalInclusions, extrasInclusions  } = searchCriteria

    const filter = {
        type: policyType,
        fundType: OPEN_FUND_TYPE,
        category: categoryOfCover,
        states: {
            $in: [state]
        }
    }

    if (maxMonthlyPremium) {
        filter.monthlyPremium = {
            $lte: maxMonthlyPremium
        }
    }

    if(!lodash.isEmpty(hospitalInclusions)) {
        filter['hospitalComponent.inclusions'] = createInclusionCoveredQuery(hospitalInclusions)
    }

    if(!lodash.isEmpty(extrasInclusions)) {
        filter['extrasComponent.inclusions'] = createInclusionCoveredQuery(extrasInclusions)
    }

    return filter
}

const Query = {
    search: async (obj, searchCriteria, context) => {
            // sleep.sleep(1) // NOTE: added sleep to test front end waiting and showing loading spinner
            const page = searchCriteria.page || DEFAULT_PAGE
            const pageSize = searchCriteria.pageSize || DEFAULT_PAGE_SIZE
            const dbQuery = createDbQuery(searchCriteria)
            const totalRecords = await context.datastore.policies.find(dbQuery).count()
            const totalPages = totalRecords > 0 ? Math.ceil(totalRecords/pageSize) : 0
            const results = await context.datastore.policies
                .find(dbQuery)
                .sort(DEFAULT_SORT)
                .skip((page - 1) * pageSize)
                .limit(pageSize)
                .toArray()

            return {
                policies: results,
                meta: {
                    page,
                    pageSize,
                    totalPages,
                    totalRecords
                }
            }
    }
}

const Policy = {
    id: policy => policy._id,
    categoryOfCover: policy => policy.category,
    policyType: policy => policy.type
}

module.exports = {
    Query,
    Policy
}