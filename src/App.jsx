import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchBlogPosts,
  searchBlogPosts,
  sortBlogPosts,
  addBlogPost,
  deleteBlogPost,
  setNewPostBody,
  setNewPostTitle,
} from './store';
import Pagination from './components/Pagination';

const App = () => {
  const dispatch = useDispatch();
  const blogPosts = useSelector((state) => state.blogPosts);
  const searchQuery = useSelector((state) => state.searchQuery);
  const sortOption = useSelector((state) => state.sortOption);
  const newPost = useSelector((state) => state.newPost);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;
  const [creatingPost, setCreatingPost] = useState(false);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = blogPosts.posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(blogPosts.length / postsPerPage);

  console.log(blogPosts.posts);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    dispatch(fetchBlogPosts());
  }, [dispatch]);

  const handleSearch = (e) => {
    dispatch(searchBlogPosts(e.target.value));
  };

  const handleSort = (e) => {
    dispatch(sortBlogPosts(e.target.value));
  };

  const handleAddPost = () => {
    dispatch(addBlogPost(newPost));
    setCreatingPost(false);
  };

  const handleDeletePost = (postId) => {
    dispatch(deleteBlogPost(postId));
  };
  const handleCreatePostCancel = () => {
    setCreatingPost(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {creatingPost ? (
        <div className="flex flex-col items-center border border-gray-300 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Add New Blog Post</h3>
          <label>Enter Title of Your Post</label>
          <input
            type="text"
            placeholder="Title"
            value={newPost?.title}
            onChange={(e) => dispatch(setNewPostTitle(e.target.value))}
            className="border border-gray-300 rounded-lg px-4 py-2 mb-4"
          />
          <label className="block mb-4">Enter The Body Of Your Post</label>
          <textarea
            placeholder="Body"
            value={newPost?.body}
            onChange={(e) => dispatch(setNewPostBody(e.target.value))}
            className="border border-gray-300 rounded-lg px-4 py-2 mb-4 resize-none"
            style={{ width: '100%', height: '200px' }}
          />

          <div className="flex justify-between">
            <button
              onClick={handleAddPost}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              Add Post
            </button>
            <button
              onClick={handleCreatePostCancel}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg ml-4"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-between">
            <div>
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={handleSearch}
                className="border border-gray-300 rounded-lg px-4 py-2 mb-4"
              />
              <select
                value={sortOption}
                onChange={handleSort}
                className="border border-gray-300 rounded-lg px-4 py-2 mb-4"
              >
                <option value="date">Sort by Date</option>
                <option value="title">Sort by Title</option>
              </select>
            </div>
            <button
              onClick={() => setCreatingPost(true)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Create New Post
            </button>
          </div>

          <ul className="space-y-4">
            {currentPosts.map((post) => (
              <li key={post.id} className="bg-white shadow rounded-lg p-4">
                <h3 className="text-xl font-semibold">{post.title}</h3>
                <p>{post.body}</p>
                <button
                  onClick={() => handleDeletePost(post.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg mt-4"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              paginate={paginate}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
