Handlebars.registerHelper("not", function (val) {
  return !val;
})

Handlebars.registerHelper("isEven", function (index) {
  return (index % 2) === 0;
});

Handlebars.registerHelper("isOdd", function (index) {
  return (index % 2) === 1;
});

Handlebars.registerHelper("eq", function (a, b) {
  return a === b;
})

Handlebars.registerHelper("neq", function (a, b) {
  return a !== b;
})

Handlebars.registerHelper("gt", function (a, b) {
  return a > b;
})

Handlebars.registerHelper("gte", function (a, b) {
  return a >= b;
})

Handlebars.registerHelper("lt", function (a, b) {
  return a < b;
})

Handlebars.registerHelper("lte", function (a, b) {
  return a <= b;
})