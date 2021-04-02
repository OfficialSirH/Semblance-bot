'use strict';

module.exports = function(app) {
    require('./UserDataRoutes')(app);
    require('./BotListingRoutes')(app);
}