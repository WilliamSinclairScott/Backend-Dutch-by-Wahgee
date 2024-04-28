// Using ES module import statements
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const signup = async (req, res) => {
    try {
        req.body.password = await bcrypt.hash(req.body.password, await bcrypt.genSalt(10));
        const user = await User.create(req.body);
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const user = await User.findOne({ name: req.body.name }).populate('closetItems').populate('associatedTags');
        if (user) {
            const result = await bcrypt.compare(req.body.password, user.password);
    
            if (result) {
                const payload = { name: user.name };
                const token = jwt.sign(payload, process.env.SECRET, { expiresIn: '1d' }); // Example: Expiring in 1 day
                res.cookie('token', token, { httpOnly: true }).json({ user: user });
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
