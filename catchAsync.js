module.exports = function catchAsync(asyncFunc) {
    return function(req, res, next) {
        asyncFunc(req, res, next).catch(e => next(e));
    }
}