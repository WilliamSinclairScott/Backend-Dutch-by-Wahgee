// Using ES module import statements
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const signup = async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        req.body.password = hashedPassword;
        await User.create(req.body);
        res.status(200).json({message: 'User created successfully'});
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
                const populated = await user.populate('Divvys');
                const { _id, email, displayName, Divvys} = populated;
                const response = { userID: _id, email, displayName, Divvys };
                res.cookie('token', token, { httpOnly: true }).json(response);
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


export const logout = async (_, res) => { 
    res.clearCookie('token').json({ message: 'Logout successful' });
}
