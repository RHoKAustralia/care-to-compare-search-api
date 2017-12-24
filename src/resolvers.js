const PolicyResolvers = require('./policy/resolvers')

const PolicyQuery = PolicyResolvers.Query
const HospitalPolicy = PolicyResolvers.HospitalPolicy 
const ExtrasPolicy = PolicyResolvers.ExtrasPolicy
const CombinedPolicy = PolicyResolvers.CombinedPolicy

module.exports = {
    Query: {
       ...PolicyQuery
    },
    HospitalPolicy,
    ExtrasPolicy,
    CombinedPolicy
}