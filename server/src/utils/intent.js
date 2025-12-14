/**
 * Detects if the query is related to travel planning
 * @param {string} query
 * @returns {boolean}
 */
function isTravelQuery(query = "") {
    const travelRegex =
        /(trip|tour|travel|itinerary|vacation|holiday|visit|plan)/i;

    return travelRegex.test(query);
}

module.exports = {
    isTravelQuery
};
