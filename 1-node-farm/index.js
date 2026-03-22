const fs = require('fs');
const http = require('http');
const slugify = require('slugify');
const replaceTemplate = require('./modules/replaceTemplate');

//////////////////////////////////////////////////////////
// FILES
// // Blocking, synchronous way
// const textInput = fs.readFileSync('./starter/txt/input.txt','utf-8');
// console.log(textInput);

// const textOutput = `This is what we know about the avocado: ${textInput}.\nCreated on ${Date.now()}`;
// fs.writeFileSync('./starter/txt/output.txt', textOutput);
// console.log('File written successfully');

// // Non-blocking, asynchronous way
// fs.readFile('./starter/txt/start.txt','utf-8', (err, data1) => {
//     if(err) return console.log('Error reading file!');
//     fs.readFile(`./starter/txt/${data1}.txt`, 'utf-8', (err, data2) => {
//         console.log(data2);
//         fs.readFile('./starter/txt/append.txt','utf-8', (err, data3) => {
//             console.log(data3);
//             fs.writeFile('./starter/txt/final.txt',`${data2}\n${data3}`, 'utf-8', (err) => {
//                 console.log('Your file has been written');
//             });
//         });
//     });
// });

// console.log('Will read file now...');

//////////////////////////////////////////////////////////
// SERVER

const data = fs.readFileSync(
  `${__dirname}/starter/dev-data/data.json`,
  'utf-8',
);
const tempOverview = fs.readFileSync(
  `${__dirname}/starter/templates/template-overview.html`,
  'utf-8',
);
const tempProduct = fs.readFileSync(
  `${__dirname}/starter/templates/template-product.html`,
  'utf-8',
);
const tempCard = fs.readFileSync(
  `${__dirname}/starter/templates/template-card.html`,
  'utf-8',
);
const dataObj = JSON.parse(data);

if (!dataObj[0].slug) {
  const updateDataWithSlugs = dataObj.map((el) => {
    return {
      ...el,
      slug: slugify(el.productName, { lower: true }),
    };
  });

  const temp = fs.writeFileSync(
    `${__dirname}/starter/dev-data/data.json`,
    JSON.stringify(updateDataWithSlugs, null, 2),
  );
}

// console.log('Available product slugs:', updateDataWithSlugs.map(el => el.slug));

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;

  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join('');
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
    res.end(output);
  } else if (pathname.startsWith('/product')) {
    res.writeHead(200, { 'Content-type': 'text/html' });

    const query = parsedUrl.searchParams;
    let product;

    if (pathname === '/product') {
      // Support both ID and slug-based routing
      if (query.has('id')) {
        product = dataObj[query.get('id')];
      } else if (query.has('slug')) {
        product = dataObj.find((el) => el.slug === query.get('slug'));
      }

      if (product) {
        const output = replaceTemplate(tempProduct, product);
        res.end(output);
      } else {
        // Product not found
        res.writeHead(404, { 'Content-type': 'text/html' });
        res.end('<h1>Product not found</h1>');
      }
    } else {
      const pathParts = pathname.split('/');
      const slug = pathParts[2];
      product = dataObj.find((el) => el.slug === slug);

      if (product) {
        const output = replaceTemplate(tempProduct, product);
        res.end(output);
      } else {
        // Product not found
        res.writeHead(404, { 'Content-type': 'text/html' });
        res.end('<h1>Product not found</h1>');
      }
    }
  } else if (pathname === '/api') {
    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(data);
  } else {
    res.writeHead(404, {
      'Content-type': 'text-html',
      'my-own-header': 'hello-world',
    });
    res.end('<h1>Page not found<h1>');
  }
});
server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to requests on port 8000');
});
