import jwt from 'jsonwebtoken';

// Function to generate a JWT token
const generateToken = (user) => {
    const Secret = 'secret';
    return jwt.sign(
        { id: user._id, role: user.role },  // Token payload: user ID and role
        Secret,             // Secret key from .env file
        { expiresIn: '1h' }                 // Token expiration: 1 hour
    );
};

export default generateToken;
