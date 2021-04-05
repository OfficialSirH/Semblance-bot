'use strict';

module.exports = function(app, client) {
    require('./UserDataRoutes')(app, client);
    require('./BotListingRoutes')(app);
}