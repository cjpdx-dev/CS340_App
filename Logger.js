module.exports = function() {
    function logRouteCall(routeCall, req) 
    {
        const log = console.log

        log("----------------------------------------------");
        log("Called " + routeCall);
        log("req.body:" + JSON.stringify(req.body));
        log("req.params: " + JSON.stringify(req.params));
        log("req.query: " + JSON.stringify(req.query));
        log("----------------------------------------------");
    }
    return logRouteCall;
}();
