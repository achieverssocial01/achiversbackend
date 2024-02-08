import { userCollection } from "../Models/UserSchema.js";
import { productCollection } from "../Models/productSchema.js"
import ObjectId from 'mongoose'

import crypto from "crypto";
import { purchaseCollection } from "../Models/purchase.js";
import { Transaction } from "../Models/Transaction.js";
import moment from "moment";

const userregister = async (req, res) => {
  const { name, phone, email, password, referal } = req.body;
  const referalID = crypto.randomInt(0, 1000000);
  if (!name || !phone || !email || !password || !referalID) {
    return res.status(400).send(" all fields are required");
  }
  const isuseralreadyexist = await userCollection.findOne({ email: email })
  if (isuseralreadyexist) {
    return res.status(403).send("this user already exists");
  }
  if (referal) {
    const referaluser = await userCollection.findOne({ referalID: referal })
    if (!referaluser || referaluser == null) {
      return res.status(400).send("referal code is invalid");
    }
    referaluser.referalpoint = referaluser.referalpoint + 10;
    await referaluser.save()
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

const userupdate = async (req, res) => {

  const { id, name, phone, email, gender, state, city, pincode, address } = req.body;
  if (!name || !phone || !email || !gender || !state || !city || !pincode || !address) {
    return res.status(409).send(" all fields are required");
  }
  try {
    const updateddata = await userCollection.findByIdAndUpdate({ _id: id }, {
      name, phone, email, gender, state, city, pincode, address
    }, { new: true });
    res.status(200).send(updateddata);
  } catch (error) {
    res.status(500).send(error);
  }
};

const usersignin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send("all fields are required");
  }
  try {
    const isuserexist = await userCollection.findOne({ email: email }).populate('products');

    if (isuserexist) {
      if (password == isuserexist.password) {
        return res
          .status(200)
          .send({ msg: "user signed in succesfuully", data: isuserexist });
      } else {
        return res.status(409).send("email or password does not match");
      }
    } else {
      return res.status(404).send("User does not exist");
    }
  } catch (error) {
    return res.status(500).send(error);
  }
};



const resetpassword = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(409).send("please enter all field")
  }
  try {
    const isuseravailable = await userCollection.findOne({ email });
    if (isuseravailable) {
      isuseravailable.password = password;
      await isuseravailable.save();
      return res.status(200).send("password updated succesfully");
    }
    else {
      return res.status(403).send("user does not exist");
    }
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

const getuserinfobyreferalid = async (req, res) => {
  const { referalid, userId } = req.body;


  try {

    const data = await userCollection.findOne({ referalID: referalid });

    if (data !== null) {
      if (data._id.toHexString() === userId) {

        return res.status(400).send("Can not use your own referal id")
      }
      return res.status(200).send(data)
    }
    else {
      return res.status(400).send("no user found by this referal id");
    }

  } catch (error) {
    return res.status(500).send(error.message);
  }
}


const Buycourse = async (req, res) => {

  const { transactionid, userid, referaluserid, productid } = req.body;

  if (!transactionid || !userid || !productid) {
    return res.status(400).send("enter valid information")
  }

  try {
    const isalreadyproductpurchased = await Transaction.findOne({ $and: [{ userid: userid, courseid: productid }] })

    if (isalreadyproductpurchased) {
      return res.status(200).send("You already purchased this product");
    }
    let complimentry ;
    const userinfo = await userCollection.findById({ _id: userid })
    const productinfo = await productCollection.findById({ _id: productid })
    const allproducts = await productCollection.find();
    for (let product of allproducts) {
      if (product?.price <= productinfo?.price) {
         if(product?.price < productinfo?.price){
          complimentry = product?._id;
         }
        if (userinfo?.products?.length == 0) {
          userinfo?.products?.push(product?._id)
        }
        else {
          let value = userinfo?.products?.includes(product?._id)
  
          if (!value) {
            userinfo?.products?.push(product?._id)
          }

        }

      }
    }
    const datauser = await userinfo.save();
    const newuser = await datauser.populate("products")
    const data = await Transaction.create({ transactionid, userid, referaluserid, productid: productinfo, courseid: productid,complementry:complimentry })
    return res.status(200).send({ data, newuser })

  } catch (error) {
    return res.status(400).send(error?.message)
  }
}


const admingetbystatus = async (req, res) => {
  try {
    const data = await Transaction.find({ status: "pending" }).populate(["productid", "userid"]);
    return res.status(200).send(data)
  } catch (error) {
    return res.status(400).send(error?.message)
  }

}




const UserCourseStatus = async (req, res) => {
  const { status, id } = req.body;
  const currentDate = moment().format('YYYY-MM-DD');
  const newdate = new Date(currentDate)
  if (!id || !status) {
    return res.status(400).send("enter valid information")
  }
  try {
    const data = await Transaction.findByIdAndUpdate({ _id: id }, { status: status }, { new: true })
    if (data !== null) {
      if (data?.status == "recieved" && data?.referaluserid) {
        const referaluser = await userCollection.findById({ _id: data?.referaluserid });
        const commision = (data?.productid?.price * 80) / 100;
        const newItem = {
          user: data?.userid,
          amount: commision,
          date: newdate, // Aap date aur product ko bhi specify kar sakte hain
          product: data?.productid
        };
        const updateuser = referaluser?.referuser.push(newItem)
        const dataaa = await referaluser.save()
        const userstatusupdate = await userCollection.findByIdAndUpdate({ _id: data?.userid }, { status: data?.status }, { new: true })
      }
      return res.status(200).send({ data })
    }
  } catch (error) {
    return res.status(400).send(error.message)
  }
}

const getuserpaymentstatus = async (req, res) => {
  const { userid, productid } = req.body;
  if (!userid || !productid) {
    return res.status(404).send("pls enter valid information")
  }
  try {
    const data = await Transaction.findOne({
      userid: userid,
      $or: [
          { courseid: productid },
          { complementry: productid }
      ]
  })
  
    return res.status(200).send(data);
  } catch (error) {
    return res.status(400).send(error)
  }
}


const getMyReferalsInfo = async (req, res) => {
  const { referalId } = req.params;
  try {
    const myReferals = await userCollection.findOne({ referalID: referalId }).populate({
      path: 'referuser.user',
      model: 'userCollection' // Assuming the model name for user is 'User'
    }).exec()
    return res.status(200).send(myReferals);
  } catch (error) {
    
    res.status(500).send({ error: error.message });
  }
};
const getMyInvoiceInfo = async (req, res) => {
  const { userId } = req.params;
  try {
    const myReferals = await Transaction.find({ userid: userId }).populate('referaluserid');
    return res.status(200).send(myReferals);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};


const gettotalincome = async (req, res) => {
  const { userId } = req.params;
  const data = await userCollection.findById({ _id: userId });
  let totalincome = 0;
  if (data?.referuser?.length > 0) {
    for (let item of data?.referuser) {
      totalincome += item.amount;
    }
  }

  return res.status(200).send({ totalincome: totalincome })
}

const gettodayincome = async (req, res) => {
  const data = await userCollection.findById({ _id: req.params.userid })
  const currentDate = moment().format('YYYY-MM-DD');
  // const today = new Date(currentDate)
  let todayincome = 0;
  if (data?.referuser?.length > 0) {
    for (let item of data?.referuser) {
      if (currentDate === moment(item?.date).format('YYYY-MM-DD')) {
        todayincome += item?.amount;
      }
    }
  }
  return res.status(200).send({ todayincome: todayincome })
}



const getIncomeForDateRange = async (req, res) => {
  try {
    const data = await userCollection.findById(req.params.userid);
    const currentDate = moment();
    const oneWeekAgo = moment().subtract(7, 'days');
    let incomeForLastWeek = 0;

    if (data?.referuser?.length > 0) {
      for (let item of data?.referuser) {
        const itemDate = moment(item?.date);
        if (itemDate.isBetween(oneWeekAgo, currentDate, null, '[]')) { // Check if item date falls within the last week
          incomeForLastWeek += item?.amount;
        }
      }
    }

    return res.status(200).send({ incomeForLastWeek });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).send({ error: 'Internal Server Error' });
  }
};

const getMonthlyIncome = async (req, res) => {
  try {
    const data = await userCollection.findById(req.params.userid);
    const currentDate = moment();
    const firstDayOfMonth = moment().startOf('month');
    let monthlyIncome = 0;

    if (data?.referuser?.length > 0) {
      for (let item of data?.referuser) {
        const itemDate = moment(item?.date);
        if (itemDate.isBetween(firstDayOfMonth, currentDate, null, '[]')) { // Check if item date falls within the current month
          monthlyIncome += item?.amount;
        }
      }
    }

    return res.status(200).send({ monthlyIncome });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).send({ error: 'Internal Server Error' });
  }
};













export { userregister, Buycourse, UserCourseStatus, getuserpaymentstatus, admingetbystatus, usersignin, resetpassword, userupdate, getuserinfobyreferalid, getMyReferalsInfo, getMyInvoiceInfo, gettotalincome, gettodayincome, getIncomeForDateRange, getMonthlyIncome };
