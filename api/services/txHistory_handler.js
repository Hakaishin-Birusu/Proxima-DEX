const txHistory = require("../models/history");
const ReadPreference = require("mongodb").ReadPreference;

async function AddHistory(req, res) {
  try {
    const { userAddress, activity, hash } = req.body;

    const newTx = new txHistory({
      userAddress,
      activity,
      hash,
    });

    newTx.save().then(async () => {
      res.json({ response: "Success" });
    });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
}

async function GetHistory(req, res) {
  let userAddress = req.params.userAddress;
  const query = txHistory
    .find({ userAddress: userAddress }, { _id: 0, __v: 0 })
    .read(ReadPreference.NEAREST)
    .limit(5);
  query
    .exec()
    .then(async (usersHistory) => {
      usersHistory.length > 0
        ? res.json({ respoonse: usersHistory })
        : res.json({ response: "No record found" });
    })
    .catch((err) => {
      console.log("Err", err);
      res.status(500).send(err);
    });
}

module.exports = {
  AddHistory,
  GetHistory,
};
