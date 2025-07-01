function PaginationTab({products, currentPage, totalPages, totalItems, setCurrentPage}) {
  return (
    <div className="tab-content">
      <div id="tab-1" className="tab-pane fade show p-0 active">
        <div className="row g-4">
          <div className="col-lg-12">
            <div className="row g-4">
              {products?.map((product, index) => (
                <Link
                  to={`/product/${product.productID}`}
                  className="col-md-6 col-lg-4 col-xl-3"
                >
                  <CardItem
                    key={index}
                    id={product.productID}
                    img={product.imageURL}
                    category={product.category}
                    title={product.name}
                    description={product.description}
                    price={product.price}
                    unit={product.unit}
                    shopName={product.supplier.businessName}
                    soldCount={product.sales}
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Pagination */}
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
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(
            (pageNum) => (
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
            )
          )}

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
    </div>
  );
}

export default PaginationTab;
