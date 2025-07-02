function PaginationTab({
  currentPage,
  totalPages,
  totalItems,
  setCurrentPage,
}) {
  return (
    <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-4">
      <div>
        Showing {currentPage}- {totalPages} of {totalItems}
      </div>
      <ul className="pagination">
        {/* Previous button */}
        <li className={currentPage === 1 ? "disabled" : ""}>
          <button
            className="pagination-link"
            onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
          >
            &lt;
          </button>
        </li>

        {/* Page numbers */}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
          <li key={pageNum}>
            <button
              className={`pagination-link ${
                pageNum === currentPage ? "active" : ""
              }`}
              onClick={() => setCurrentPage(pageNum)}
            >
              {pageNum}
            </button>
          </li>
        ))}

        {/* Next button */}
        <li className={currentPage === totalPages ? "disabled" : ""}>
          <button
            className="pagination-link"
            onClick={() =>
              currentPage < totalPages && setCurrentPage(currentPage + 1)
            }
          >
            &gt;
          </button>
        </li>
      </ul>
    </div>
  );
}

export default PaginationTab;
