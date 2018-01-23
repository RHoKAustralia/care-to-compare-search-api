const PolicyResolvers = require('./policy/resolvers')

const PolicyQuery = PolicyResolvers.Query
const Policy = PolicyResolvers.Policy

module.exports = {
    Query: {
        ...PolicyQuery
    },
    Policy
}