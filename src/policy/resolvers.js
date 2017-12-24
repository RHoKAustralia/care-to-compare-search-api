const lodash = require('lodash')
const lodashFp = require('lodash/fp')

const { baseQuery } = require('../db/queries')

const OPEN_FUND_TYPE = 'OPEN'

const POLICY_TYPE_HOSPITAL = 'HOSPITAL'
const POLICY_TYPE_EXTRAS = 'GENERAL'
const POLICY_TYPE_COMBINED = 'COMBINED'

const toInclusion = (inclusion) => {
    return { 
        category: inclusion, 
        isCovered: true
    }
}

const baseFilter = (policyType, searchCriteria) => {

    const { categoryOfCover, state, maxMonthlyPremium, type, fundType  } = searchCriteria

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

    return filter
}

const hospitalPolicyFilter = (baseFilter, inclusions) => {

    if(!lodash.isEmpty(inclusions)) {
        const inclusionFilters = inclusions.map(toInclusion)

        return lodash.merge({}, baseFilter, {
            hospitalInclusions: {
                $all: inclusionFilters
            }
        })
    }

    return baseFilter
}

const extrasPolicyFilter = (baseFilter, inclusions) => {

    if(!lodash.isEmpty(inclusions)) {
        const inclusionFilters = inclusions.map(toInclusion)

        return lodash.merge({}, baseFilter, {
            extrasInclusions: {
                $all: inclusionFilters
            }
        })
    }

    return baseFilter
}

const combinedPolicyFilter = (baseFilter, hospitalInclusions, extrasInclusions) => {
    return extrasPolicyFilter(hospitalPolicyFilter(baseFilter, hospitalInclusions), extrasInclusions)
}

const Query = {
    HospialPolicies: (obj, searchCriteria, context) => {
        const { basicPolicyCriteria, hospitalInclusions } = searchCriteria
        return context.datastore.policies
            .find(hospitalPolicyFilter(baseFilter(POLICY_TYPE_HOSPITAL, basicPolicyCriteria), hospitalInclusions))
            .toArray()
    },
    ExtrasPolicies: (obj, searchCriteria, context) => {
        const { basicPolicyCriteria, extrasInclusions } = searchCriteria
        return context.datastore.policies
            .find(extrasPolicyFilter(baseFilter(POLICY_TYPE_EXTRAS, basicPolicyCriteria), extrasInclusions))
            .toArray()
    },
    CombinedPolicies: (obj, searchCriteria, context) => {
        const { basicPolicyCriteria, hospitalInclusions, extrasInclusions } = searchCriteria
        return context.datastore.policies
            .find(combinedPolicyFilter(baseFilter(POLICY_TYPE_COMBINED, basicPolicyCriteria), hospitalInclusions, extrasInclusions))
            .toArray()
    }

}

const Policy = {
    id: policy => policy._id,
    categoryOfCover: policy => policy.category
}

const HospitalPolicy = {
    ...Policy
}

const ExtrasPolicy = {
    ...Policy
}

const CombinedPolicy = {
    ...Policy
}

module.exports = {
    Query,
    HospitalPolicy,
    ExtrasPolicy,
    CombinedPolicy
}