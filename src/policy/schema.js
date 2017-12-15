const Policy = `

enum AustralianStates {
    ACT
    NSW
    NT
    QLD
    SA
    TAS
    VIC
    WA
}

enum CategoryOfCover {
    SINGLES
    COUPLES
    FAMILIES
    SINGLE_PARENTS
    DEPENDANTS
}

enum FundType {
    OPEN
    RESTRICTED
}

enum AmbulanceCover {
    YES
    NO
    STATE
    PARTIAL
}

enum HospitalInclusions {
    CARDIAC_AND_RELATED_SERVICE
    CATARACT_AND_EYE_LENSE_PROCEDURES
    PREGNANCY_AND_BIRTH_SERVICES
    ASSISTED_REPRODUCTIVE_SERVICES
    JOINT_REPLACEMENTS
    DIALISIS_CHRONIC_RENAL_FAILURE
}

interface Policy {
    id: ID!
    fundCode: String!
    fundName: String!
    fundType: FundType!
    policyName: String!
    sisCode: String!
    states: [AustralianStates]!
    categoryOfCover: CategoryOfCover!
    monthlyPremium: Float!
}

type HospitalPolicy implements Policy {
    id: ID!
    fundCode: String!
    fundName: String!
    fundType: FundType!
    policyName: String!
    sisCode: String!
    states: [AustralianStates]!
    categoryOfCover: CategoryOfCover!
    monthlyPremium: Float!
}

type Query {
    HospialPolicies(
        categoryOfCover: CategoryOfCover!, 
        state: AustralianStates!, 
        hospitalInclusions: [HospitalInclusions]
        maxMonthlyPremium: Float
    ): [HospitalPolicy]
}
`

module.exports = () => [Policy]
