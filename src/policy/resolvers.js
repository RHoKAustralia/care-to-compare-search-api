const lodash = require('lodash')

const OPEN_FUND_TYPE = 'OPEN'

const POLICY_TYPE_HOSPITAL = 'HOSPITAL'
const POLICY_TYPE_EXTRAS = 'EXTRAS'
const POLICY_TYPE_COMBINED = 'COMBINED'

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
    Policies: (obj, searchCriteria, context) => context.datastore.policies.find(createDbQuery(searchCriteria)).toArray()
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