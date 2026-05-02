const isAdmin = (req, res, next) => {
    // Check if the user exists on the request object and their role is admin
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            error: 'Access denied. Admin privileges required.'
        });
    }
    
    return next();
};

module.exports = isAdmin;
