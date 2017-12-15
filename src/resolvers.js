const PolicyResolvers = require('./policy/resolvers')

const PolicyQuery = PolicyResolvers.Query
const HospitalPolicy = PolicyResolvers.HospitalPolicy 

module.exports = {
    Query: {
       ...PolicyQuery
    },
    HospitalPolicy
}