// import
import userModel from "../models/userModel.js";

export const approveDealer = async (req, res) => {
  try {
    const dealer = await userModel.findById(req.params.id);

    if (!dealer || dealer.role !== "dealer")
      return res.status(404).json({ message: "Dealer not found" });

    dealer.status = "approved";
    await dealer.save();

    res.json({ message: "Dealer approved successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
