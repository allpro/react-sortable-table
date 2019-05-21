import _ from 'lodash';

/**
 * Subcategories are keyed by the categoryId they are associated with.
 * All categoryId's are unique, so NO NEED to key by category-type.
 */
const subcategories = {
    1: [
        { id: 19, text: "Potholes, Obstructions, Debris on road" },
        { id: 26, text: "Trip hazards, tree roots for public trees" },
        { id: 27, text: "Street sweeping " },
        { id: 28, text: "Street lights out or damaged wooden pole" },
        { id: 150, text: "Street lights out or damaged metal pole" },
        { id: 29, text: "Exposed wires-street lights [Emergency]" },
        { id: 30, text: "Snow removal" },
        { id: 31, text: "Snow removal volunteers (private property)" },
        { id: 32, text: "Other" }
    ],
    19: [
        { id: 33, text: "Trees & hedges in parks & on boulevards" },
        { id: 36, text: "Sidewalk encroachment or obstruction" },
        { id: 34, text: "Report illegal tree removal in progress [Emergency]" },
        { id: 35, text: "Tree removal permit - private property" },
        { id: 37, text: "Other" }
    ],
    30: [ { id: 9999,  text: "LIST NOT CREATED YET" } ],
    31: [ { id: 9999,  text: "LIST NOT CREATED YET" } ],
    32: [ { id: 9999,  text: "LIST NOT CREATED YET" } ],
    33: [ { id: 9999,  text: "LIST NOT CREATED YET" } ],
    34: [ { id: 9999,  text: "LIST NOT CREATED YET" } ],
    35: [ { id: 9999,  text: "LIST NOT CREATED YET" } ],
    36: [ { id: 9999,  text: "LIST NOT CREATED YET" } ],
    37: [ { id: 9999,  text: "LIST NOT CREATED YET" } ],
    38: [ { id: 9999,  text: "LIST NOT CREATED YET" } ],
    39: [ { id: 9999,  text: "LIST NOT CREATED YET" } ],
    40: [ { id: 9999,  text: "LIST NOT CREATED YET" } ],
    41: [ { id: 9999,  text: "LIST NOT CREATED YET" } ],
    42: [ { id: 9999,  text: "LIST NOT CREATED YET" } ],
    43: [ { id: 9999,  text: "LIST NOT CREATED YET" } ],
    44: [ { id: 9999,  text: "LIST NOT CREATED YET" } ],
    45: [ { id: 9999,  text: "LIST NOT CREATED YET" } ],
    46: [ { id: 9999,  text: "LIST NOT CREATED YET" } ]
};

// Helpers
const getSubcategory = (catId, subId) => {
    const group = subcategories[catId];
    const item = group && _.find(group, { id: subId });

    if (!group) {
        return { id: subId, text: `Invalid Category.id: "${catId}"` };
    }
    if (!item) {
        return { id: subId, text: `Invalid Subcategory.id: "${subId}"` };
    }

    return item;
}
const getSubcategoryText = (catId, subId) => {
    return getSubcategory(catId, subId).text;
}

export default subcategories;
export {
    getSubcategory,
    getSubcategoryText,
}
