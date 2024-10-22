// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export function authenticate(allowedRoles = []) {
    return async (req, res, next) => { // This returns the actual middleware function
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        try {
            const decoded = jwt.verify(token, 'secret');  // Verifies the token
            req.user = decoded;  // Attach decoded user information to the request object

            const user = await User.findById(req.user.id); // Check if user exists in the database
            if (!user) {
                return res.status(401).json({ message: 'User not found' });
            }

            // Check if the user's role matches the allowed roles
            if (allowedRoles.length && !allowedRoles.includes(user.role)) {
                return res.status(403).json({ message: 'Access denied' });
            }

            req.user = user;  // Attach user to the request object
            next();  // Proceed to the next middleware or route handler
        } catch (error) {
            return res.status(401).json({ message: 'Token is not valid' });
        }
    };
}


