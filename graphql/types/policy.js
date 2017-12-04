const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLNonNull,
	GraphQLID,
	GraphQLList,
	GraphQLFloat
} = require('graphql')

const {
	TypesOfCover,
	CategoriesOfCover,
	AustralianStates,
	FundTypes
} = require('./common')

const GeneralInclusion = new GraphQLObjectType({
	name: 'GeneralInclusion',
	fields: {
		benefits: {
			type: new GraphQLNonNull(GraphQLString)
		},
		limits: {
			type: new GraphQLNonNull(GraphQLString)
		}
	}
})

const Policy = new GraphQLObjectType({
	name: 'Policy',
	fields: {
		id: {
			type: new GraphQLNonNull(GraphQLID),
			resolve(obj, args, context) {
				return obj._id
			}
		},
		fundCode: {
			type: new GraphQLNonNull(GraphQLString)
		},
		fundName: {
			type: new GraphQLNonNull(GraphQLString)
		},
		fundType: {
			type: new GraphQLNonNull(FundTypes)
		},
		policyName: {
			type: new GraphQLNonNull(GraphQLString)
		},
		sisCode: {
			type: new GraphQLNonNull(GraphQLString)
		},
		monthlyPremium: {
			type: new GraphQLNonNull(GraphQLFloat)
		},
		states: {
			type: new GraphQLNonNull(new GraphQLList(AustralianStates))
		},
		categoryOfCover: {
			type: new GraphQLNonNull(CategoriesOfCover),
			resolve(obj, args, context) {
				return obj.category
			}
		},
		typeOfCover: {
			type: new GraphQLNonNull(TypesOfCover),
			resolve(obj, args, context) {
				return obj.type
			}
		},
		hospitalInclusions: {
			type: new GraphQLObjectType({
				name: 'HospitalInclusions',
				fields: {
					accomodation: {
						type: new GraphQLNonNull(GraphQLString)
					}
				}
			})
		},
		generalInclusions: {
			type: new GraphQLObjectType({
				name: 'GeneralInclusions',
				fields: {
					optical: {
						type: new GraphQLNonNull(GeneralInclusion)
					},
					nonPbs: {
						type: new GraphQLNonNull(GeneralInclusion)
					},
				}
			})
		}
	}
})

module.exports = Policy
