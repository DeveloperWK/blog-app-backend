const notFoundMiddleware = (
    req,
    res,
    next
) => {
    const error = new Error(`Not Found ${req.originalUrl} - ${req.method} - ${req.ip} - ${req.headers['user-agent']}`);
    res.status(404);
    next(error);
};
export default notFoundMiddleware;