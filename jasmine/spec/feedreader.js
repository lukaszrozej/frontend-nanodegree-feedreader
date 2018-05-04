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

    /* If I just expect it toBeDefined and length not to be > 0
     * it might be a nonempty array
     * or maybe something else with length property
     */

    it('have non-empty URLs', function() {

      // Regular Expression for URL validation
      //
      // Author: Diego Perini
      // Updated: 2010/12/05
      // License: MIT      // Regular expr
      //
      // copied from: https://gist.github.com/dperini/729294

      const re_weburl = new RegExp(
        "^" +
          // protocol identifier
          "(?:(?:https?|ftp)://)" +
          // user:pass authentication
          "(?:\\S+(?::\\S*)?@)?" +
          "(?:" +
            // IP address exclusion
            // private & local networks
            "(?!(?:10|127)(?:\\.\\d{1,3}){3})" +
            "(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})" +
            "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})" +
            // IP address dotted notation octets
            // excludes loopback network 0.0.0.0
            // excludes reserved space >= 224.0.0.0
            // excludes network & broacast addresses
            // (first & last IP address of each class)
            "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
            "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
            "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
          "|" +
            // host name
            "(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)" +
            // domain name
            "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*" +
            // TLD identifier
            "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))" +
            // TLD may end with dot
            "\\.?" +
          ")" +
          // port number
          "(?::\\d{2,5})?" +
          // resource path
          "(?:[/?#]\\S*)?" +
        "$", "i"
      );

      allFeeds.forEach(feed => {
        // makes sure url is defined and is string
        expect(feed.url).toEqual(jasmine.any(String));
        // makes sure it's properly formatted url
        expect(feed.url).toMatch(re_weburl);
      });
    });

    /* TODO: Write a test that loops through each feed
     * in the allFeeds object and ensures it has a name defined
     * and that the name is not empty.
     */
    it('have non-empty names', function() {
      allFeeds.forEach(feed => {
        // makes sure name is defined and is string
        expect(feed.name).toEqual(jasmine.any(String));
        // makes sure it is not empty
        expect(feed.name.length).not.toBe(0);
      });
    });
  });

  describe('The menu', function() {

    const body = document.querySelector('body');
    const menu = document.querySelector('.slide-menu');
    const icon = document.querySelector('.icon-list');

    beforeEach(function() {
      const customMatchers = {
        // This matcher checks if html element is outside the bounds of document
        toBeHidden: function() {
          return {
            compare: function(actual) {
              const result = {};
              const elementRect = actual.getBoundingClientRect();
              const documentRect = document.documentElement.getBoundingClientRect();
              result.pass =
                elementRect.right <= documentRect.left ||
                elementRect.left >= documentRect.right ||
                elementRect.bottom <= documentRect.top ||
                elementRect.top >= documentRect.bottom;
              if (result.pass) {
                result.message = 'Expected feed NOT to be non-empty string';
              } else {
                result.message = 'Expected feed to be non-empty string';
              }
              return result;
            }
          };
        }
      };
      jasmine.addMatchers(customMatchers);
    });

    it('is hidden by default', function() {
      expect(body.classList).toContain('menu-hidden');
      expect(menu).toBeHidden();
    });

    describe('when hidden and hamburger icon is clicked', function() {
      beforeEach(function(done) {
        body.classList.add('menu-hidden');
        // wait to make sure it starts hidden
        setTimeout(function() {
          icon.click();
          // wait to give it time to appear
          setTimeout(done, 300);
        }, 300);
      });

      it('appears within 300 ms', function() {
        expect(body.classList).not.toContain('menu-hidden');
        expect(menu).not.toBeHidden();
      });
    });

    describe('when visible and hamburger icon is clicked', function() {
      beforeEach(function(done) {
        body.classList.remove('menu-hidden');
        // wait to make sure it starts visible
        setTimeout(function() {
          icon.click();
          // wait to give it time to hide
          setTimeout(done, 300);
        }, 300);
      });

      it('hides within 300 ms', function() {
        expect(body.classList).toContain('menu-hidden');
        expect(menu).toBeHidden();
      });
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
