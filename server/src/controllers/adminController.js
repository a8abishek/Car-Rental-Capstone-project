// import
import userModel from "../models/userModel.js";
import carModel from "../models/carModel.js";
import bookingModel from "../models/bookingModel.js";

// ADMIN DASHBOARD STATS
export const getAdminStats = async (req, res) => {
  try {
    //BASIC COUNTS
    const totalUsers = await userModel.countDocuments({
      role: { $in: ["customer", "dealer"] },
    });

    const totalCars = await carModel.countDocuments({
      status: "approved",
    });

    const totalBookings = await bookingModel.countDocuments();

    //TOTAL REVENUE (Overall)
    const revenueData = await bookingModel.aggregate([
      { $match: { status: "confirmed" } },
      { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } },
    ]);
    const totalRevenue =
      revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    //NEW: CHART DATA (Last 7 Days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const weeklyRevenue = await bookingModel.aggregate([
      {
        $match: {
          status: "confirmed",
          createdAt: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          total: { $sum: "$totalAmount" },
        },
      },
      { $sort: { _id: 1 } }, // Sort by date ascending
    ]);

    //NEW: FLEET UTILIZATION

    // Count how many cars are currently in a "confirmed" booking
    const activeBookingsCount = await bookingModel.countDocuments({
      status: "confirmed",
    });
    const idleCars = Math.max(0, totalCars - activeBookingsCount);

    //RECENT LISTS
    const recentBookings = await bookingModel
      .find({ status: { $in: ["pending", "confirmed"] } })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("customer", "name email")
      .populate("car", "carName carImage carType carRunning transmission")
      .lean();

    const recentDealers = await userModel
      .find({ role: "dealer", status: "pending" })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name email status createdAt")
      .lean();

    const recentCustomers = await userModel
      .find({ role: "customer" })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name email createdAt")
      .lean();

    //FINAL RESPONSE
    res.json({
      totalUsers,
      totalCars,
      totalBookings,
      totalRevenue,
      recentBookings,
      recentDealers,
      recentCustomers,
      weeklyRevenue,
      utilization: {
        onTrip: activeBookingsCount,
        idle: idleCars,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//APPROVE DEALER
export const approveDealer = async (req, res) => {
  try {
    const dealer = await userModel.findById(req.params.id);

    if (!dealer || dealer.role !== "dealer") {
      return res.status(404).json({
        message: "Dealer not found",
      });
    }

    if (dealer.status === "approved") {
      return res.status(400).json({
        message: "Dealer already approved",
      });
    }

    dealer.status = "approved";
    await dealer.save();

    res.json({
      message: "Dealer approved successfully",
      dealerId: dealer._id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//REVOKE DEALER APPROVAL (BACK TO PENDING)
export const revokeDealer = async (req, res) => {
  try {
    const dealer = await userModel.findById(req.params.id);

    if (!dealer || dealer.role !== "dealer") {
      return res.status(404).json({
        message: "Dealer not found",
      });
    }

    dealer.status = "pending";
    await dealer.save();

    res.json({
      message: "Dealer approval revoked",
      dealerId: dealer._id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//GET ALL PENDING DEALERS
export const getPendingDealers = async (req, res) => {
  try {
    const dealers = await userModel
      .find({
        role: "dealer",
        status: "pending",
      })
      .sort({ createdAt: -1 })
      .select("-password")
      .lean();

    res.json(dealers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
