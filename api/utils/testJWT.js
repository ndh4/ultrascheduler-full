const { User } = require("../models")
const { createToken } = require("./authenticationUtils")

const testJWT = () => {
    return User.findOne({ netid: "sg71" }).then(async user => {
        let token = createToken(user);
        return await User.findByIdAndUpdate(user._id, { token: token }, { new: true });
    })
}
// testJWT().then(t => console.log(t));