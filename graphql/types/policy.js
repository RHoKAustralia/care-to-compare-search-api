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
	AustralianStates
} = require('./common')

const policyType = new GraphQLObjectType({
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
		}
	}
})

module.exports = policyType
