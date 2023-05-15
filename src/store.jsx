import { configureStore } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchBlogPosts = createAsyncThunk(
  'blogPosts/fetchBlogPosts',
  async () => {
    try {
      const response = await axios.get(
        'https://jsonplaceholder.typicode.com/posts'
      );
      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
);

// Thunk action to add a blog post
export const addBlogPost = createAsyncThunk(
  'blogPosts/addBlogPost',
  async (_, { getState }) => {
    try {
      const newPost = getState().blogPosts.newPost; // Access newPost from the state
      const response = await axios.post(
        'https://jsonplaceholder.typicode.com/posts',
        newPost
      );
      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
);

// Thunk action to delete a blog post
export const deleteBlogPost = createAsyncThunk(
  'blogPosts/deleteBlogPost',
  async (postId) => {
    try {
      await axios.delete(
        `https://jsonplaceholder.typicode.com/posts/${postId}`
      );
      return postId;
    } catch (error) {
      throw new Error(error.message);
    }
  }
);

// Slice for blog posts
const blogPostsSlice = createSlice({
  name: 'blogPosts',
  initialState: {
    posts: [],
    newPost: { title: '', body: '' },
  },
  reducers: {
    searchBlogPosts: (state, action) => {
      const query = action.payload;

      if (!Array.isArray(state.posts)) {
        return { ...state };
      }
      console.log(query.length);

      if (query && query.length > 0) {
        const filteredPosts = state.posts.filter(
          (post) =>
            post.title.toLowerCase().includes(query.toLowerCase()) ||
            post.body.toLowerCase().includes(query.toLowerCase())
        );
        if (filteredPosts.length > 0) return { ...state, posts: filteredPosts };
        else return { ...state, posts: state.posts };
      } else {
        return { ...state, posts: state.posts };
      }
    },

    sortBlogPosts: (state, action) => {
      const option = action.payload;
      let sortedPosts = [...state.posts]; // Access the posts array property

      if (option === 'date') {
        sortedPosts.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateB - dateA; // Sort in descending order
        });
      } else if (option === 'title') {
        sortedPosts.sort((a, b) => {
          const titleA = a.title.toLowerCase();
          const titleB = b.title.toLowerCase();
          return titleA.localeCompare(titleB);
        });
      }

      return { ...state, posts: sortedPosts };
    },

    setNewPostTitle: (state, action) => {
      state.newPost = { ...state.newPost, title: action.payload };
    },
    setNewPostBody: (state, action) => {
      state.newPost = { ...state.newPost, body: action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogPosts.fulfilled, (state, action) => {
        return { ...state, posts: action.payload };
      })
      .addCase(addBlogPost.fulfilled, (state, action) => {
        if (Array.isArray(state.posts)) {
          state.posts.push(action.payload);
        }
      })
      .addCase(deleteBlogPost.fulfilled, (state, action) => {
        return {
          ...state,
          posts: state.posts.filter((post) => post.id !== action.payload),
        };
      });
  },
});

// Export the actions
export const {
  searchBlogPosts,
  sortBlogPosts,
  setNewPostTitle,
  setNewPostBody,
} = blogPostsSlice.actions;

// Create the store
const store = configureStore({
  reducer: {
    blogPosts: blogPostsSlice.reducer,
  },
});
store.dispatch(fetchBlogPosts());
export default store;
