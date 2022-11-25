"use strict";
var import_vitest = require("vitest");
var import_pageInfo = require("./pageInfo");
(0, import_vitest.test)("can extract current page info", function() {
  const data = {
    user: {
      friends: {
        pageInfo: {
          startCursor: "1",
          endCursor: "2",
          hasNextPage: true,
          hasPreviousPage: false
        },
        edges: [
          {
            node: {
              id: "1"
            }
          }
        ]
      }
    }
  };
  const path = ["user", "friends"];
  (0, import_vitest.expect)((0, import_pageInfo.extractPageInfo)(data, path)).toEqual(data.user.friends.pageInfo);
});
(0, import_vitest.test)("can count offset page size", function() {
  const data = {
    viewer: {
      friends: [{}, {}, {}]
    }
  };
  (0, import_vitest.expect)((0, import_pageInfo.countPage)(["viewer", "friends"], data)).toEqual(3);
});
