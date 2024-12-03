import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id; // basically this is your id
    const filteredUser = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json(filteredUser);
  } catch (error) {
    console.log("Error in getUsersForSidebar:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params; // check the dynamic value -- and roture:id other ID  so the image of other from frontend use clink on image to get data fethc-- thus user chocie turn to id they want to pick--which is the other id
    const myId = req.user._id; // my ID

    const messages = await Message.find({
      // recal schemma of message has sender and receiver id--to feth messa u want u want sender and receiver message right

      $or: [
        { senderId: myId, receiverId: userToChatId }, // find the message when the sendier is me, the other user is other
        { senderId: userToChatId, receiverId: myId }, // find message if sender is other and receiver is me
      ],
    });
    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const sendMessage = async (req, res) => {
  // the message could be text or image
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params; // rename id as receiverId // quite similar logic like getMessage
    const senderId = req.user._id; // my Id

    let imageUrl;
    if (image) {
      // Upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image); // ok uploadResponse send back bund of metadata, liek an objecy. below u tap in wiht object.secure_url
      imageUrl = uploadResponse.secure_url; // A URL where the uploaded image can be accessed securely (over HTTPS).
    }

    const newMessage = new Message({
      // Create a new instance of the  model -- this case the model is Message
      senderId, // short hand way if senderID: senderId. same belwo
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save(); // Save the instance to the database

    
    const receiverSocketId = getReceiverSocketId(receiverId);
    if(receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage",newMessage)
    }



    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
