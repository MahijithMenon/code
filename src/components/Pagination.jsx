const Pagination = ({ currentPage, totalPages, paginate }) => {
  const pageNumbers = [];

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <ul className="pagination flex justify-center">
      {pageNumbers.map((number) => {
        return (
          <li
            key={number}
            className={`${
              currentPage === number
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            } py-2 px-4 mx-1 rounded-md cursor-pointer`}
            onClick={() => paginate(number)}
          >
            {number}
          </li>
        );
      })}
    </ul>
  );
};

export default Pagination;
