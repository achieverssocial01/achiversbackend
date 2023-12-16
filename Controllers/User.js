import { userCollection } from "../Models/UserSchema.js";

import crypto from "crypto";

const userregister = async (req, res) => {
  const { name, phone, email, password, referal } = req.body;
  const referalID = crypto.randomInt(0, 1000000);
  if (!name || !phone || !email || !password || !referalID) {
    return res.status(409).send(" all fields are required");
  }
  try {
    const data = await userCollection.create({
      name,
      phone,
      email,
      password,
      referal,
      referalID,
    });

    res.status(200).send(data);
  } catch (error) {
    res.status(500).send(error);
  }
};

const usersignin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(409).send("all fields are required");
  }
  try {
    const isuserexist = await userCollection.findOne({ email: email });

    if (isuserexist) {
      if (password == isuserexist.password) {
        return res
          .status(200)
          .send({ msg: "user signed in succesfuully", data: isuserexist });
      } else {
        return res.status(409).send("email or password does not match");
      }
    } else {
      return res.status(409).send("User does not exist");
    }
  } catch (error) {
    return res.status(500).send(error);
  }
};



const resetpassword =async(req,res)=>{
    const {email,password}=req.body;
    if(!email || !password){
        return res.status(409).send("please enter all field")
    }
    try {
        const isuseravailable = await userCollection.findOne({email});
     if(isuseravailable){
        isuseravailable.password = password;
        await isuseravailable.save();
        return res.status(200).send("password updated succesfully");
     }
     else{
        return res.status(403).send("user does not exist");
     }   
    } catch (error) {
        return res.status(500).send(error.message);
    }
}


export { userregister, usersignin,resetpassword };
