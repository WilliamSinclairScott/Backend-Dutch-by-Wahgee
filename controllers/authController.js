// Using ES module import statements
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const signup = async (req, res) => {
    try {
        bcrypt.hash(req.body.password, 10, function(err, hash) {
            if (err) { throw (err); }
            bcrypt.compare(req.body.password, hash, function(err, result) {
                if (err) { throw (err); }
                req.body.password = hash;
            });
        });
        const user = await User.create(req.body);
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        if (user) {
            const result = await bcrypt.compare(req.body.password, user.password);
            if (result) {
                const payload = { id: user._id, email: user.email, displayName: user.displayName };
                const token = jwt.sign(payload, process.env.SECRET, { expiresIn: '1d' });
                res.cookie('token', token, { httpOnly: true }).json(user);
            } else {
                res.status(400).json({ error: 'Password does not match' });
            }
        } else {
            res.status(400).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
};


export const logout = async (req, res) => { 
    res.clearCookie('token').json({ message: 'Logout successful' });
}
