const lodash = require('lodash')

// const hosptialInclusionCriteria = { $regex: 'yes|restricted|^BLP' }

const baseQuery = (searchCriteria) => {

    const { categoryOfCover, state, maxMonthlyPremium, type, fundType  } = searchCriteria

    const filter = {
        type,
        category: categoryOfCover,
        fundType,
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

// const hospitalInclusionsQuery = (hospitalInclusions) => {

//     const filter = {}

//     if(lodash.includes(hospitalInclusions, 'HEART_SUGERY')) 
//         filter["hospitalInclusions.cardiacAndRelatedService"] = hosptialInclusionCriteria

//     return filter
// }

module.exports = {
    baseQuery
}