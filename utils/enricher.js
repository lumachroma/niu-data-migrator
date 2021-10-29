const enrichCategories = (categories) => {
    let enrichedCategories = []

    categories.forEach(category => {
        enrichedCategories.push({
            name: category.name.toUpperCase(),
            code: category.name.toUpperCase().replaceAll(" ", "_").replaceAll("/", "_"),
            subcategories: [{
                name: "DEFAULT",
                code: "DEFAULT"
            }]
        })
    })

    return enrichedCategories
}

export default enrichCategories