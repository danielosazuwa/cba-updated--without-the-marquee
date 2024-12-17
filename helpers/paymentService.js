const Flutterwave = require("flutterwave-node-v3");
const open = require("open");

const flw = new Flutterwave(
  process.env.FLW_PUBLIC_KEY,
  process.env.FLW_SECRET_KEY
);

const chargeCard = async (payload) => {
  const response = await flw.Charge.card(payload);
  if(response.meta.authorization.mode === 'pin'){
    const recallCharge = await flw.Charge.card(payload.pin);

    // console.log(recallCharge)
}
  return response;
};

module.exports = {
  chargeCard,
};
