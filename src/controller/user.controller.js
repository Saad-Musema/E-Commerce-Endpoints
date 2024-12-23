const User = require("../model/user.mongo")
const libphonenumber = require('libphonenumber-js');

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

async function createUser(req, res) {
        const user = new User(req.body);
    if( await User.findOne({email: user.email})){
        return res.status(409).send("User with this Email already exists");
    }

    user.phoneNumber = libphonenumber.parsePhoneNumber(user.phoneNumber, 'ET').number;
    if(!libphonenumber.isValidPhoneNumber(user.phoneNumber)){

        console.log("Not Valid Phone Number");
        return res.status(409).send("Invalid Phone Number");
    }

    if (!isPasswordValid(user.password)) {
    console.log("Password is valid");
    return res.status(409).send("Password is Invalid! Please Include special charater, lowercase, uppercase and number")
    }

    try {
        // const refresh_token = jwt.sign(userData, process.env.refresh_token);
        // user.refreshToken = refresh_token;
        await user.save(user);
        res.status(201).send(user);
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Internal Server Error');
    }
};

function isPasswordValid(password) {
    return passwordRegex.test(password);
}




async function loginUser(req, res){
    
    try {

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
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).send("User not found");
        }
        res.status(200).send(user);
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Internal Server Error');
    }
}



module.exports = {createUser, loginUser, deleteUser};