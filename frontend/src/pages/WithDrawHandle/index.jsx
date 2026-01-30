import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  getWithdrawRequests,
  approveWithDraw,
  rejectWithDraw,
} from "../../services/withDrawService";
import PaginationTab from "../../components/PaginationTab/PaginationTab";
import { formatDate } from "../../utils/formatDate";

const WithdrawHandle = () => {
  const [requests, setRequests] = useState([]);
  const [status, setStatus] = useState(""); // "PENDING", "APPROVED", "REJECTED"

  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // trang đang xem (1-based)
  const pageSize = 10;
  const [totalItems, setTotalItems] = useState(0); // tổng số đơn hàng
  const [totalPages, setTotalPages] = useState(0);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await getWithdrawRequests({
        page: currentPage - 1,
        size: pageSize,
        status: status || undefined,
        // supplierId,
      });

      setRequests(response.content || []);
      setTotalPages(response.totalPages);
      setTotalItems(response.totalElements);
    } catch (error) {
      console.error("Lỗi khi tải danh sách:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [status]);

  const handleStatusChange = (e) => {
    // setPage(0);
    setStatus(e.target.value);
  };
  const handleApprove = async (id) => {
    if (!window.confirm("Bạn có chắc muốn duyệt yêu cầu này?")) return;
    try {
      const response = await approveWithDraw(id);
      toast.success(response);
      fetchRequests();
    } catch (err) {
      alert("Lỗi khi duyệt yêu cầu: " + err);
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Bạn có chắc muốn từ chối yêu cầu này?")) return;
    try {
      const response = await rejectWithDraw(id);
      toast.success(response);
      fetchRequests();
    } catch (err) {
      alert("Lỗi khi từ chối yêu cầu: " + err);
    }
  };

  const getQrUrl = (bankId, accountNo, amount, name) => {
    const encodedName = encodeURIComponent(name || "NCC");
    return `https://img.vietqr.io/image/${bankId}-${accountNo}-compact2.png?amount=${amount}&addInfo=RutTien&accountName=${encodedName}`;
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Lịch sử yêu cầu rút tiền</h2>

      {/* Bộ lọc trạng thái */}
      <div className="mb-4">
        <label className="mr-2 font-medium">Trạng thái:</label>
        <select
          value={status}
          onChange={handleStatusChange}
          className="border border-gray-300 rounded px-3 py-1"
        >
          <option value="">Tất cả</option>
          <option value="PENDING">Đang chờ duyệt</option>
          <option value="APPROVED">Đã duyệt</option>
          <option value="REJECTED">Đã từ chối</option>
        </select>
      </div>

      {/* Bảng yêu cầu rút */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        {loading ? (
          <p className="p-4">Đang tải...</p>
        ) : requests.length === 0 ? (
          <p className="p-4 text-gray-500">Không có yêu cầu nào.</p>
        ) : (
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">#</th>
                <th className="px-4 py-2 text-left">Số tiền yêu cầu</th>
                <th className="px-4 py-2 text-left">Ngân hàng</th>
                <th className="px-4 py-2 text-left">STK</th>
                <th className="px-4 py-2 text-left">Trạng thái</th>
                <th className="px-4 py-2 text-left">Ngày yêu cầu</th>
                <th className="px-4 py-2 text-left">Mã</th>
                <th className="px-4 py-2 text-left">Phê duyệt</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req, index) => (
                <tr key={req.id} className="border-t">
                  <td className="px-4 py-2">
                    {(currentPage - 1) * pageSize + index + 1}
                  </td>

                  <td className="px-4 py-2">
                    {req.amountRequested?.toLocaleString()} VND
                  </td>
                  <td className="px-4 py-2">{req.bankName}</td>
                  <td className="px-4 py-2">{req.bankAccountNumber}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        req.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-700"
                          : req.status === "APPROVED"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">{formatDate(req.requestDate)}</td>
                  <td>
                    {req.status === "PENDING" || req.status === "APPROVED" ? (
                      <img
                        src={getQrUrl(
                          req.bankName,
                          req.bankAccountNumber,
                          req.amountApproved || req.amountRequested,
                          req.supplier?.name
                        )}
                        alt="QR"
                        width={150}
                      />
                    ) : (
                      <em>Không có</em>
                    )}
                  </td>
                  <td>
                    {req.status === "PENDING" && (
                      <>
                        <button
                          className="btn btn-sm btn-success me-1"
                          onClick={() => handleApprove(req.id)}
                        >
                          Duyệt
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleReject(req.id)}
                        >
                          Từ chối
                        </button>
                      </>
                    )}
                    {(req.status === "APPROVED" ||
                      req.status === "REJECTED") && <em>Đã xử lý</em>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <PaginationTab
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default WithdrawHandle;
