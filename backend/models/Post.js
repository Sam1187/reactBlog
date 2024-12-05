// Dieser Code definiert ein Mongoose-Schema
//  für Blogbeiträge in einer MongoDB-Datenbank

import mongoose from "mongoose";

const Schema = mongoose.Schema;
const PostSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  tags: {
    type: Array,
    default: [],
  },
  viewsCount: {
    type: Number,
    default: 0,
  },
  imageUrl: String, 
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// das Schema als Modell Post exportiert, damit es in anderen Teilen der Anwendung für Datenoperationen
//  (z. B. Erstellen, Lesen, Aktualisieren und Löschen von Beiträgen) verwendet werden kann
export default mongoose.model("Post", PostSchema);

