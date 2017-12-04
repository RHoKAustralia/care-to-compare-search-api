const {
	GraphQLID,
	GraphQLNonNull,
	GraphQLString,
	GraphQLList,
	GraphQLFloat,
	GraphQLEnumType
} = require('graphql')

const {
	Policy,
	CommonTypes: {
		TypesOfCover,
		CategoriesOfCover,
		AustralianStates
	}
} = require('../types')

const search = {
	type: new GraphQLList(Policy),
	args: {
		typeOfCover: {
			name: 'typeOfCover',
			type: new GraphQLNonNull(TypesOfCover)
		},
		categoryOfCover: {
			name: 'categoryOfCover',
			type: new GraphQLNonNull(CategoriesOfCover)
		},
		location: {
			name: 'location',
			type: new GraphQLNonNull(AustralianStates)
		},
		maxMonthlyPremium: {
			name: 'maxMonthlyPremium',
			type: GraphQLFloat
		}
	},
	resolve(obj, args, context) {
		const policies = context.db.policies
		const typeOfCover = args.typeOfCover
		const categoryOfCover = args.categoryOfCover
		const location = args.location
		const maxMonthlyPremium = args.maxMonthlyPremium

		const filter = {
			type: typeOfCover,
			category: categoryOfCover,
			states: {
				$in: [location]
			}
		}

		if (maxMonthlyPremium) {
			filter.monthlyPremium = {
				$lte: maxMonthlyPremium
			}
		}

		return policies.find(filter).toArray()
	}
}

module.exports = {
	search
}
