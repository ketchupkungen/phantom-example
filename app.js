const phantom = require('phantom');

async function fillInBlocketForm(){

  // Create a new phantom browser
  const instance = await phantom.create();

  // Create a new page/tab in the brwoser
  const page = await instance.createPage();

  // Goto a url
  await page.open('https://www.blocket.se/helasverige')
    .catch((err)=>console.log(err))

  let content = await page.property('content');

}

fillInBlocketForm();