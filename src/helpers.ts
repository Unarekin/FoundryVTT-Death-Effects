Handlebars.registerHelper("isEven", function (index) {
  return (index % 2) === 0;
});

Handlebars.registerHelper("isOdd", function (index) {
  return (index % 2) === 1;
});