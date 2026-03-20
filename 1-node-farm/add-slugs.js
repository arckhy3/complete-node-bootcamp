const fs = require('fs');
const slugify = require('slugify');

void function addSlugsToData() {

    // Read the current data
    const data = fs.readFileSync(`${__dirname}/starter/dev-data/data.json`, 'utf-8');
    const dataObj = JSON.parse(data);

    // Add slugs to each product
    const updatedData = dataObj.map(product => {
        return {
            ...product,
            slug: slugify(product.productName, { lower: true })
        };
    });

    // Write the updated data back to the file
    fs.writeFileSync(
        `${__dirname}/starter/dev-data/data.json`, 
        JSON.stringify(updatedData, null, 2), 
        'utf-8'
    );

    console.log('✅ Slugs successfully added to data.json!');
    console.log('Updated products:');
    // updatedData.forEach(product => {
    //     console.log(`- ${product.productName} → ${product.slug}`);
    // });
};