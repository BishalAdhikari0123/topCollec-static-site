const postSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: String,
    },
    tags: [{
      type: String,
    }],
    published: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
    },
  }, { timestamps: true });
  
  Post = mongoose.model('Post', postSchema);

  export default Post;