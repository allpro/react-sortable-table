const categories = {
	// website
	1: [
		{ id: 17, text: 'Site down or technical problem' },
		{ id: 47, text: 'Questions about any of our City online services' },
		{ id: 54, text: 'Other' },
		{ id: 2, text: 'Content Issue' }
	],

	// general
	2: [
		{ id: 23, text: 'Comment' },
		{ id: 55, text: 'Compliment' },
		{ id: 56, text: 'Question' },
		{ id: 53, text: 'Other' }
	],

	// problem
	4: [
		{ id: 1, text: 'Roads, Sidewalks & Street Lights' },
		{ id: 29, text: 'Boulevards, Trees & Hedges' },
		{ id: 30, text: 'Parks, Trails, Community Gardens' },
		{ id: 31, text: 'Traffic & Transportation' },
		{ id: 32, text: 'Vehicles & Parking' },
		{ id: 33, text: 'Water & Sewers' },
		{ id: 34, text: 'Garbage & Recycling' },
		{ id: 35, text: 'Property Taxes & Utilities' },
		{ id: 36, text: 'Community Centres & Facilities' },
		{ id: 37, text: 'Graffiti & Vandalism' },
		{ id: 38, text: 'Noise' },
		{ id: 39, text: 'Pets, Animals & Pests' },
		{ id: 40, text: 'Health Related Concerns' },
		{ id: 41, text: 'Environmental Concerns' },
		{ id: 42, text: 'Safety & Emergency Preparedness' },
		{ id: 43, text: 'Building & Construction Sites' },
		{ id: 44, text: 'Business Licences' },
		{ id: 45, text: 'Zoning & Property Use' },
		{ id: 46, text: 'All other concerns' }
	]
}

// Map using friendly names so UI is more clear
const categoriesMap = {
	website: categories[1],
	general: categories[2],
	problem: categories[4]
}

// Helpers
const getCategory = catId => {
	const item = categories[catId]

	if (!item) {
		return { id: catId, text: `Invalid Category.id: "${catId}"` }
	}

	return item
}
const getCategoryText = catId => {
	return getCategory(catId).text
}

export default categories
export { categoriesMap, getCategory, getCategoryText }
