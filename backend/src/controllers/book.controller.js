import { Book } from "../models/book.model.js";
import cloudinary from "../utils/cloudinary.js";


const createBook = async (req, res) => {
    try {
        const { title, caption, rating, image} = req.body;

        if (!title || !caption || !rating || !image) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: "Rating must be between 1 and 5"
            });
        }

        const uploadResponse = await cloudinary.uploader.upload(image);
        const imageUrl = uploadResponse.secure_url;


        const newBook = new Book({
            title,
            caption,
            rating,
            image: imageUrl,
            // user: req.user._id
        });

        await newBook.save();

        return res.status(201).json({
            success: true,
            message: "Book created successfully",
            newBook
        });
        
    } catch (error) {
        console.log("Error in creating book", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

const getUserBooks = async (req, res) => {
    
  try {
    const books = await Book.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    console.error("Get user books error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
}

const deleteBook = async (req, res) => {
    
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    // check if user is the creator of the book
    if (book.user.toString() !== req.user._id.toString())
      return res.status(401).json({ message: "Unauthorized" });

    // https://res.cloudinary.com/de1rm4uto/image/upload/v1741568358/qyup61vejflxxw8igvi0.png
    // delete image from cloduinary as well
    if (book.image && book.image.includes("cloudinary")) {
      try {
        const publicId = book.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      } catch (deleteError) {
        console.log("Error deleting image from cloudinary", deleteError);
      }
    }

    await book.deleteOne();

    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    console.log("Error deleting book", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export {createBook,
        getUserBooks,
        deleteBook

}