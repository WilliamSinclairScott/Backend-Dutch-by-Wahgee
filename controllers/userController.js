import User from '../models/userModel';

const updateUserById = async (req, res) => {
    const userId = req.params.id;
    const updatedUserData = req.body;
    try { 
        const updatedUser = await user.findByIdAndUpdate(userId, updatedUserData, { new: true })
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' })
        }
    res.status(200).json({
        message: 'User updated successfully',
        user: updatedUser
    });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error: error.message })
    }
}
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({ message: 'Error getting user', error: error.message })
    }
}
const deleteUserById = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }
        res.status(200).json({ message: 'User deleted successfully' })
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error: error.message })
    }
}
const getDivvysByUserId = async (req, res) => {
    try {
        const divvys = await Divvy.find({ owner: req.params.userId })
        res.status(200).json(divvys);
    } catch (error) {
        res.status(500).json({ message: 'Error getting divvys', error: error.message })
    }
}
    module.exports = {
        createUser,
        getDivvysByUserId,
        updateUserById,
        getUserById,
        deleteUserById
}