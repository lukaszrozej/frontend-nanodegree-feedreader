/* feedreader.js
 *
 * This is the spec file that Jasmine will read and contains
 * all of the tests that will be run against your application.
 */

/* We're placing all of our tests within the $() function,
 * since some of these tests may require DOM elements. We want
 * to ensure they don't run until the DOM is ready.
 */
$(function() {
  /* This is our first test suite - a test suite just contains
   * a related set of tests. This suite is all about the RSS
   * feeds definitions, the allFeeds variable in our application.
   */
  describe('RSS Feeds', function() {

    // beforeEach or beforeAll
    beforeEach(function() {
      const customMatchers = {
        toBeNonEmptyString: function() {
          return {
            compare: function(actual) {
              const result = {};
              result.pass = (typeof actual === 'string' || actual instanceof String) &&
                actual.length > 0;
              if (result.pass) {
                result.message = 'Expected feed NOT to be non-empty string';
              } else {
                result.message = 'Expected feed to be non-empty string';
              }
              return result;
            }
          }
        }
      };

      jasmine.addMatchers(customMatchers);
    });

    /* This is our first test - it tests to make sure that the
     * allFeeds variable has been defined and that it is not
     * empty. Experiment with this before you get started on
     * the rest of this project. What happens when you change
     * allFeeds in app.js to be an empty array and refresh the
     * page?
     */
    it('are defined', function() {
      expect(allFeeds).toBeDefined();
      expect(allFeeds.length).not.toBe(0);
    });

    /* TODO: Write a test that loops through each feed
     * in the allFeeds object and ensures it has a URL defined
     * and that the URL is not empty.
     */
    /* If I just expect it toBeDefined and length not to be > 0
     * it might be a nonempty array
     * or maybe something else with length property
     */

    it('have non-empty URLs', function() {
      allFeeds.forEach(feed => {
        expect(feed.url).toBeNonEmptyString();
      });
    });

    /* TODO: Write a test that loops through each feed
     * in the allFeeds object and ensures it has a name defined
     * and that the name is not empty.
     */
    it('have non-empty names', function() {
      allFeeds.forEach(feed => {
        expect(feed.name).toBeNonEmptyString();
      });
    });
  });

  /* TODO: Write a new test suite named "The menu" */
  describe('The menu', function() {

    /* TODO: Write a test that ensures the menu element is
     * hidden by default. You'll have to analyze the HTML and
     * the CSS to determine how we're performing the
     * hiding/showing of the menu element.
     */
    it('is hidden by default', function() {
      const body = document.querySelector('body');

      expect(body.classList).toContain('menu-hidden')
    });

    /* TODO: Write a test that ensures the menu changes
     * visibility when the menu icon is clicked. This test
     * should have two expectations: does the menu display when
     * clicked and does it hide when clicked again.
     */
    it('changes visibility when menu icon is clicked', function() {
      const body = document.querySelector('body');
      const icon = document.querySelector('.menu-icon-link');

      icon.click();
      expect(body.classList).not.toContain('menu-hidden');

      icon.click();
      expect(body.classList).toContain('menu-hidden')
    });
  });

  // In the following two test suits
  // variable allFeeds is overwritten for the duration of the test
  // to make sure function loadFeed is tested independently of allFeeds.
  //
  // Without this the test could even if function loadFeed would work properly.
  //
  // For example in the 'New Feed selection' suit the test would fail
  // if allFeeds had only 1 feed
  //
  // This approach was inspired by tests provided by Udacity
  // for 'Build your own templating function' quiz in
  // Lesson 9 about frameworks,
  // where console.log is overwritten in the test
  //
  // I considered using dependency injection:
  // passing allFeeds to loadFeed as a parameter
  // but decided against it because I'm assuming
  // we're only supposed to test existing code, not to change it

  describe('Initial Entries', function() {
    let savedAllFeeds;

    beforeEach(function(done) {
      savedAllFeeds = allFeeds;
      allFeeds = [{
        name: 'Udacity Blog',
        url: 'http://blog.udacity.com/feed'
      }];
      loadFeed(0, done);
    });

    afterEach(function() {
      allFeeds = savedAllFeeds;
    });

    it('are in the feed container after loadFeed is called', function() {
      const entry = document.querySelector('.feed .entry');

      expect(entry).not.toBeNull();
    });
  });

  describe('New Feed Selection', function() {
    let savedAllFeeds;
    let contentBefore;
    let contentAfter;

    beforeEach(function(done) {
      savedAllFeeds = allFeeds;
      allFeeds = [{
        name: 'Udacity Blog',
        url: 'http://blog.udacity.com/feed'
      }, {
        name: 'CSS Tricks',
        url: 'http://feeds.feedburner.com/CssTricks'
      }];

      const feedContainer = document.querySelector('.feed');

      loadFeed(1, () => {
        contentBefore = feedContainer.innerHTML;
        loadFeed(0, () => {
          contentAfter = feedContainer.innerHTML;
          done();
        });
      });

    });

    afterEach(function() {
      allFeeds = savedAllFeeds;
    });

    it('changes content of the feed container', function() {
      expect(contentBefore).not.toEqual(contentAfter);
    });
  });
}());
