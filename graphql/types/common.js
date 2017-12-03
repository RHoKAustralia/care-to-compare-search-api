const {
	GraphQLEnumType
} = require('graphql')

const TypesOfCover = new GraphQLEnumType({
	name: 'TYPES_OF_COVER',
	values: {
		HOSPITAL: {},
		GENERAL: {},
		COMBINED: {}
	}
})

const CategoriesOfCover = new GraphQLEnumType({
	name: 'PERSONS_OF_COVER',
	values: {
		SINGLES: {},
		COUPLES: {},
		FAMILIES: {},
		SINGLE_PARENTS: {},
		DEPENDANTS: {}
	}
})

const AustralianStates = new GraphQLEnumType({
	name: 'AUSTRALIAN_STATES',
	values: {
		ACT: {},
		NSW: {},
		NT: {},
		QLD: {},
		SA: {},
		TAS: {},
		VIC: {},
		WA: {}
	}
})

module.exports = {
	TypesOfCover,
	CategoriesOfCover,
	AustralianStates
}
