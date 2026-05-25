import User from "../models/user.model.js";

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;

    console.log("-----------------------------------------");
    console.log(" 📩 Received request for user ID:", userId);

    let user = await User.findById(userId);

    if (!user) {
      console.log(" ❌ User not found in DB");
      return res.status(404).json({ message: "User not found" });
    }

    let needsSave = false;

    if (!user.role) {
      user.role = "free";
      needsSave = true;
      console.log(" 🛠️ Fixed missing role for:", user.email);
    }

    if (!user.lastCreditReset) {
      user.lastCreditReset = new Date(0);
      needsSave = true;
    }

    // --- التعديل المطور والشامل لضبط التزامن يدوياً ---
    const NOW = new Date();
    const lastReset = new Date(user.lastCreditReset);
    const hoursPast = (NOW - lastReset) / (1000 * 60 * 60);

    let expectedCredits = 100;
    if (user.role === "basic") expectedCredits = 300;
    else if (user.role === "pro") expectedCredits = 650;

    // الشرط المحدث لضمان المزامنة الفورية عند أي تغيير يدوي
    if (hoursPast >= 12 || user.credits !== expectedCredits) {
      user.credits = expectedCredits;
      user.lastCreditReset = NOW;
      needsSave = true;
      console.log(` ⚡ Syncing Credits for ${user.role} to ${expectedCredits}`);
    }
    // ---------------------------------------------------

    if (needsSave) {
      await user.save();
      console.log(" ✅ Database updated.");
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error(" ❌ Controller Error:", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const upgradeUserRole = async (req, res) => {
  try {
    const { userId, newRole } = req.body;

    let creditsToAdd = 100;
    if (newRole === "basic") creditsToAdd = 300;
    else if (newRole === "pro") creditsToAdd = 650;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        role: newRole,
        credits: creditsToAdd,
        lastCreditReset: new Date(),
      },
      { new: true },
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (global.io) {
      global.io.to(userId).emit("account_updated", {
        role: updatedUser.role,
        credits: updatedUser.credits,
      });
    }

    return res.status(200).json({
      message: "User upgraded successfully",
      user: updatedUser,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Failed to upgrade user: ${error.message}` });
  }
};