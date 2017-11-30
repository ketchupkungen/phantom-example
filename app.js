const express = require('express');
const app = express();

const phantom = require('phantom');
const asleep = require('asleep');

// Path to screenshot folder or false (to turn off screenshots)
const screenshots = __dirname + '/www/phantom-screenshots/';

async function fillInBlocketForm(){

  // Create a new phantom browser
  const instance = await phantom.create();

  // Create a new page/tab in the brwoser
  const page = await instance.createPage();

  async function waitForPageLoad() {
    while(! await page.evaluate(function() {

      // No jQuery so can't be done
      if (window.onOldPage || !window.$) {
        return false;
      }

      // Do this on DOM load
      $(function() {
        window.domLoaded = true;
      });

      // Return if the DOM was looaded
      return window.domLoaded;
    })) {
      await asleep(100);
    }
  }



  // Set the size of the viewport
  await page.property('viewportSize', {width: 1024, height: 2000});

  // Goto a url
  await page.open('https://www.blocket.se/helasverige')
    .catch((err)=>console.log(err))

  let content = await page.property('content');

  // Fill in basic search form
  // Note: No ES6/ES7 inside evaluated functions!
  page.evaluate(
    function(searchtext, category, counties){
      // Fill in the searchtext
      $('#searchtext').val(searchtext);
      // Find the option value for a certain category
      var catNumber = $('#catgroup option:contains("' + category + '")').val();
      // Now select the correct option
      $('#catgroup').val(catNumber).change();
      // Select the correct counties
      $('.multiselect').click(); // show the list
      // Check the correct checkboxes
      counties.forEach(function(county){
        $('.multiselect-container input[data-dropdown-readable-name="' + county +'"]').click();
      });
    },
    // Hardcoded test data for now:
    'BMW',
    'Motorcyklar',
    ['Jämtland', 'Gävleborg', 'Dalarna']
  );

  screenshots && page.render(screenshots + 'blocket1.jpg');

  page.evaluate(function(){
    $('#searchbutton').click();
  });

  // Await page load
  await waitForPageLoad();

  // Now scrape all data
  let searchResult = await page.evaluate(function(){
    var content = [];
    $('#item_list article').each(function(){
      content.push(this.outerHTML);
    });
    return content;
  });

  screenshots && page.render(screenshots + 'blocket2.jpg');

  console.log(searchResult);

  console.log("DONE");
}


fillInBlocketForm();





// Start app on port 3004
app.use(express.static(__dirname + '/www',{extensions:['.html']}));

app.listen(3004, function () {
  console.log('Webserver listening on port 3004');
});




