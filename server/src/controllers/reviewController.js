// import
import reviewModel from "../models/reviewModel.js";

//add Review
export const addReview = async (req, res) => {
  try {
    const { carId, bookingId, rating, comment } = req.body;

    const review = await reviewModel.create({
      car: carId,
      booking: bookingId,
      customer: req.user._id,
      rating,
      comment,
    });

    const populatedReview = await review.populate("customer", "name");

    res.status(201).json(populatedReview);
  } catch (error) {
    console.error("Add Review Error:", error);
    res.status(500).json({ message: error.message });
  }
};

//update Review
export const updateReview = async (req, res) => {
  try {
    const review = await reviewModel.findOneAndUpdate(
      { _id: req.params.id, customer: req.user._id },
      req.body,
      { new: true },
    );
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//delete Review
export const deleteReview = async (req, res) => {
  try {
    await reviewModel.findOneAndDelete({
      _id: req.params.id,
      customer: req.user._id,
    });
    res.json({ message: "Review deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get Car Reviews
export const getCarReviews = async (req, res) => {
  try {
    const reviews = await reviewModel
      .find({ car: req.params.carId })
      .populate("customer", "name");
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
