const Query = {
    HospialPolicies: (obj, {
        basicPolicyCriteria: {
            categoryOfCover,
            state,
            maxMonthlyPremium
        },
        hospitalInclusions
    }, context) => {

        const filter = {
            type: 'HOSPITAL',
            category: categoryOfCover,
            fundType: 'OPEN', // TODO: at the moment only restrict to OPEN
            states: {
                $in: [state]
            }
        }

        if (maxMonthlyPremium) {
            filter.monthlyPremium = {
                $lte: maxMonthlyPremium
            }
        }

        return context
            .datastore
            .policies
            .find(filter)
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

module.exports = {
    Query,
    HospitalPolicy
}