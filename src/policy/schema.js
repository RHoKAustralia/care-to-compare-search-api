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
    HEART_SUGERY
    EYE_SURGERY
    PREGNANCY
    IVF
    JOINT_REPLACEMENTS
    DIALYSIS
    SURGICAL_WEIGHT_LOSS_PROCEDURES
    STERILISATION
    NON_COSMETIC_PLASTIC_SURGERY
    IN_HOSPITAL_REHABILITATION
    IN_HOSPITAL_PSYCHIATRY
    PALLIATIVE_CARE
    OTHER_NON_MEDICARE
}

enum ExtrasInclusions {
    DENTAL_GENERAL
    DENTAL_MAJOR
    DENTAL_ENDODONTIC
    DENTAL_ORTHODONTIC
    OPTICAL
    NON_PBS_PHARMACEUTICALS
    PHYSIOTHERAPY
    CHIROPRACTIC
    PODIATRY
    CLINICAL_PSYCHOLOGY
    ACUPUNCTURE
    NATUROPATHY
    MASSAGE
    HEARING_AIDS
    BLOOD_GLUCOSE_MONITOR
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
    hospitalInclusions: [HospitalInclusionDetails]!
}

type ExtrasPolicy implements Policy {
    id: ID!
    fundCode: String!
    fundName: String!
    fundType: FundType!
    policyName: String!
    sisCode: String!
    states: [AustralianStates]!
    categoryOfCover: CategoryOfCover!
    monthlyPremium: Float!
    extrasInclusions: [ExtrasInclusionDetails]!
}

type CombinedPolicy implements Policy {
    id: ID!
    fundCode: String!
    fundName: String!
    fundType: FundType!
    policyName: String!
    sisCode: String!
    states: [AustralianStates]!
    categoryOfCover: CategoryOfCover!
    monthlyPremium: Float!
    hospitalInclusions: [HospitalInclusionDetails]!
    extrasInclusions: [ExtrasInclusionDetails]!
}

type HospitalInclusionDetails {
    category: HospitalInclusions!
    isCovered: Boolean!
}

type ExtrasInclusionDetails {
    category: ExtrasInclusions!
    isCovered: Boolean!
}

input BaseSearchCriteria {
    categoryOfCover: CategoryOfCover!, 
    state: AustralianStates!, 
    maxMonthlyPremium: Float,
}

type Query {
    HospialPolicies(
        basicPolicyCriteria: BaseSearchCriteria!
        hospitalInclusions: [HospitalInclusions]!
    ): [HospitalPolicy]

    ExtrasPolicies(
        basicPolicyCriteria: BaseSearchCriteria!
        extrasInclusions: [ExtrasInclusions]!
    ): [ExtrasPolicy]

CombinedPolicies(
        basicPolicyCriteria: BaseSearchCriteria!
        hospitalInclusions: [HospitalInclusions]!
        extrasInclusions: [ExtrasInclusions]!
    ): [CombinedPolicy]
}
`

module.exports = () => [Policy]
