const ContactDetails = require("../../model/userProfile/contactInformationSchema");
const UserProfiles = require("../../model/userProfile/userProfileSchema");
const { connectToMongoClient } = require("../../config/db");
const { ObjectId } = require("mongodb");

const createContactInformation = async (req, res) => {
  const { iUserProfileId } = req.params;
  const { iContactPerson, ...data } = req.body;

  try {
    // Connection established
    const coll = await connectToMongoClient("persona");

    // Find user by id
    const user = await coll.findOne({ _id: new ObjectId(`${iContactPerson}`) });

    if (!user) {
      return res.status(404).json({ message: "User profile not found" });
    }

    // Find user profile by ID
    const userProfile = await UserProfiles.findById(iUserProfileId);

    if (userProfile) {
      // Validate data
      if (!data || Object.keys(data).length === 0) {
        return res.status(400).send("Contact information not provided");
      }
      // Assign the iUserProfileId to the new contact information object
      data.iUserProfileId = userProfile._id;
      data.iContactPerson = user._id;

      // Create a new contact information entry
      const newContactInformation = new ContactDetails(data);

      // Save the new contact information
      await newContactInformation.save();
      res.status(200).send(newContactInformation);
    } else {
      res.status(404).send("User profile not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

const updateContactInformation = async (req, res) => {
  const { iUserProfileId, id } = req.params;
  const { iContactPerson, ...data } = req.body;

  try {
    // Connection established
    const coll = await connectToMongoClient("persona");

    // Find user by id
    const user = await coll.findOne({ _id: new ObjectId(`${iContactPerson}`) });

    if (!user) {
      return res.status(404).json({ message: "User profile not found" });
    }

    // Find user profile by ID
    const userProfile = await UserProfiles.findById(iUserProfileId);

    if (userProfile) {
      // Validate data
      if (!data || Object.keys(data).length === 0) {
        return res.status(400).send("Contact information not provided");
      }
      // Assign the iUserProfileId and iContactPerson to the updated data
      data.iUserProfileId = userProfile._id;
      data.iContactPerson = user._id;

      // Update the contact information
      const updatedContactInformation = await ContactDetails.findByIdAndUpdate(
        id,
        data,
        { new: true }
      );

      if (!updatedContactInformation) {
        return res.status(404).send("Contact information not found");
      }

      res.status(200).send(updatedContactInformation);
    } else {
      res.status(404).send("User profile not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

const getAllContactInformations = async (req, res) => {
  const { iUserProfileId } = req.params;
  const {
    page = 1,
    limit = 10,
    sortBy = "vUpdatedAddress",
    order = "asc",
  } = req.query;

  try {
    // Find user profile by ID
    const userProfile = await UserProfiles.findById(iUserProfileId);

    if (userProfile) {
      // Calculate the number of documents to skip
      const skip = (page - 1) * limit;

      // Get contact information with pagination and sorting
      const contactInformation = await ContactDetails.find({
        iUserProfileId: userProfile._id,
      })
        .sort({ [sortBy]: order === "asc" ? 1 : -1 })
        .skip(skip)
        .limit(parseInt(limit));

      // Count the total number of documents
      const total = await ContactDetails.countDocuments({
        iUserProfileId: userProfile._id,
      });

      res.status(200).send({
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        data: contactInformation,
      });
    } else {
      res.status(404).send("User profile not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

const getContactInformationById = async (req, res) => {
  const { iUserProfileId, id } = req.params;

  try {
    // Find user profile by ID
    const userProfile = await UserProfiles.findById(iUserProfileId);

    if (userProfile) {
      // Find existing contact information by userId and id
      const contactInformation = await ContactDetails.findById(id);

      if (contactInformation) {
        res.status(200).send(contactInformation);
      } else {
        res.status(404).send("Contact information not found");
      }
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

const deleteContactInformation = async (req, res) => {
  const { iUserProfileId, id } = req.params;

  try {
    // Find user profile by ID
    const userProfile = await UserProfiles.findById(iUserProfileId);

    if (userProfile) {
      // Find existing contact information by userId and id
      const contactInformation = await ContactDetails.findByIdAndDelete(id);

      if (contactInformation) {
        res.status(200).send("Contact information successfully deleted");
      } else {
        res.status(404).send("Contact information not found");
      }
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

module.exports = {
  createContactInformation,
  updateContactInformation,
  getAllContactInformations,
  getContactInformationById,
  deleteContactInformation,
};
