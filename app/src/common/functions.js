import web3 from "web3";
const Web3 = new web3();

export const convertTimeStamp = (date) => {
  //   let monthNames = [
  //     "Jan",
  //     "Feb",
  //     "Mar",
  //     "Apr",
  //     "May",
  //     "Jun",
  //     "Jul",
  //     "Sept",
  //     "Oct",
  //     "Nov",
  //     "Dec",
  //   ];
  let currentDate = new Date(date * 1000);
  //   return (
  //     currentDate.getDate() +
  //     " " +
  //     monthNames[currentDate.getMonth()] +
  //     "," +
  //     currentDate.getFullYear()
  //   );
  return currentDate.toGMTString();
};

export const convertWeiToEth = async (val) => {
  return await Web3.utils.fromWei(val, "ether");
};
