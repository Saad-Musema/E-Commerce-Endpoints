const User = require("../model/user.mongo")
const libphonenumber = require('libphonenumber-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const process = require('process')

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

async function createUser(req, res) {
    const user = new User(req.body);

    // Check if user with the same email already exists
    if (await User.findOne({ email: user.email })) {
        return res.status(409).send("User with this Email already exists");
    }

    user.phoneNumber = libphonenumber.parsePhoneNumberWithError(user.phoneNumber, 'ET').number;
        if(!libphonenumber.isValidPhoneNumber(user.phoneNumber)){

            console.log("Not Valid Phone Number");
            return res.status(409).send("Invalid Phone Number");
        }

    // Validate password
    if (!isPasswordValid(user.password)) {
        console.log("Password is invalid");
        return res.status(409).send("Password is Invalid! Please include a special character, lowercase, uppercase, and number");
    }

    try {
        // Hash the password
        const saltRounds = 10; // Adjust this according to your security needs
        user.password = await bcrypt.hash(user.password, saltRounds);

        // Save the user
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Internal Server Error');
    }
}


function isPasswordValid(password) {
    return passwordRegex.test(password);
}




async function loginUser(req, res){
    
    try {
        console.log(req.body.email)
        const user = await User.findOne({email: req.body.email});
        console.log(user);
        if(!user){
            return res.send("Password and Email don't match!")
        }

        let result = await bcrypt.compare(req.body.password, user.password)
            if(!result){
                return res.status(403).send("Password and Email don't match!")
            }
        const userData = {username: user._id}
        const access_token = generateAuthToken(userData);

        await User.updateOne(
            { _id: user._id },
            { $push: { tokens: { token: access_token } } }
          );
          console.log(user)
        
        res.json({access_token: access_token});

    } catch (error) {
        console.log(error);
       return  res.status(500).send('User not Found!');
    }
};


async function deleteUserHard(req, res) {
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        await User.findByIdAndDelete(id);
        res.status(200).json({ message: 'User deleted successfully' });

    } catch (error) {
        console.log(error.message);
        res.status(500).send('Internal Server Error');
    }
}

async function deleteUser(req, res) {
    try {
        const { username } = req.params;
        const user = await User.findOneAndUpdate({ username }, { deletedAt: new Date() });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('User marked as deleted.');
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send('Internal Server Error');
    }
}



async function updateUser(req, res) {
    try {
        const username = req.params.username;
        const updateData = req.body;

        // Log the incoming data for debugging
        console.log(`Updating user with username: ${username}`);
        console.log('Update data:', updateData);

        // Validate that updateData is not empty
        if (!updateData || Object.keys(updateData).length === 0) {
            return res.status(400).send("No update data provided");
        }

        const user = await User.findOneAndUpdate({ username: username }, updateData, { new: true, runValidators: true });

        // Log the result of the update operation
        console.log('Update result:', user);

        if (!user) {
            return res.status(404).send("User not found");
        }
        res.status(200).send(user);
    } catch (error) {
        console.log('Error updating user:', error.message);
        res.status(500).send('Internal Server Error');
    }
}

function generateAuthToken(userData){
    return jwt.sign(userData, process.env.ACCESS_TOKEN, { expiresIn: '1 hr' });
}


function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    const refreshToken = authHeader && authHeader
  
    console.log(refreshToken)
    
    if (token === null || token === undefined) {
      return res.sendStatus(401);
    }
  
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
      if(err){
        if (err.name == 'TokenExpiredError') {
          console.log(err.name);
          return res.status(403).send("Token Expired");
        }
      }
  
      req.user = user;
      console.log(user);
      next();
    });
  }



module.exports = {createUser, loginUser, deleteUser, updateUser, authenticateToken};