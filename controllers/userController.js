import user from '../models/userModel';

const updateUserById = (req, res) => {
    const userId = req.params.id;
    const updatedUserData = req.body;

    try { 
        const updatedUser = await user.findByIdAndUpdate(userId, updatedUserData, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
    }

    res.status(200).json({
        message: 'User updated successfully',
        user: updatedUser
    });



    // TODO: Implement the logic to update the user in the database

    // TODO: Return the updated user or an appropriate response

    // Example response
    res.status(200).json({ message: 'User updated successfully' });
};

module.exports = updateUserById;

