import React, { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import {
  withDrawRequest,
  getWithdrawRequests,
} from "../../services/withDrawService";
import PaginationTab from "../../components/PaginationTab/PaginationTab";

function WithDraw() {
  const { userId, user } = useUser();
  //  const [balance, setBalance] = useState(user?.totalRevenue);
  const [amount, setAmount] = useState("");
  const [bank, setBank] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [message, setMessage] = useState("");
  const [requests, setRequests] = useState([]);
  const availableBalance = (user?.totalRevenue || 0) - (user?.withdrawn || 0);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [totalItems, setTotalItems] = useState(0); // tổng số đơn hàng
  const [totalPages, setTotalPages] = useState(0);

  const handleWithdraw = async () => {
    const numAmount = parseInt(amount);
    if (!numAmount || numAmount <= 0) {
      setMessage("Vui lòng nhập số tiền hợp lệ.");
      return;
    }

    if (!bank || !accountNumber) {
      setMessage("Vui lòng chọn ngân hàng và nhập số tài khoản.");
      return;
    }

    if (numAmount > availableBalance) {
      setMessage("Số tiền rút vượt quá số dư hiện có.");
      return;
    }

    // Gửi yêu cầu rút tiền (giả lập)
    // setBalance(balance - numAmount);
    try {
      const response = await withDrawRequest(
        userId,
        amount,
        bank,
        accountNumber
      );
      setMessage(response);
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
    }

    // setMessage(`Yêu cầu rút ${numAmount.toLocaleString()} VND đã gửi đến ${bank}, STK: ${accountNumber}`);
    setAmount("");
    setBank("");
    setAccountNumber("");
  };

  const fetchRequests = async () => {
    try {
      // setLoading(true);
      const response = await getWithdrawRequests({
        page: currentPage - 1,
        size: pageSize,
        supplierId: userId,
      });

      setRequests(response.content || []);
      setTotalPages(response.totalPages);
      setTotalItems(response.totalElements);
    } catch (error) {
      console.error("Lỗi khi tải danh sách:", error);
    }
  };

  useEffect(() => {
    if(userId){
      fetchRequests();
    }
  }, [userId, currentPage]);

  return (
    <div className="p-6">
      <div className="extra-header"></div>
      <h2 className="text-xl font-semibold mb-4">Rút Tiền</h2>

      {/* Tổng số dư */}
      <div className="mb-6 p-4 bg-green-100 border border-green-300 rounded-lg w-full max-w-md">
        <p className="text-lg">
          <strong>Tổng tiền có thể rút:</strong>{" "}
          <span className="text-green-700 font-semibold">
            {availableBalance} VND
          </span>
        </p>
        <p className="text-lg">
          <strong>Tổng tiền đã rút:</strong>{" "}
          <span className="text-green-700 font-semibold">
            {user?.withdrawn || 0} VND
          </span>
        </p>
      </div>

      {/* Form rút tiền */}
      <div className="bg-white shadow-md rounded-lg p-6 max-w-md">
        <label className="block text-gray-700 font-medium mb-2">
          Số tiền muốn rút (VND):
        </label>
        <input
          type="number"
          className="w-full border border-gray-300 rounded px-4 py-2 mb-4"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="VD: 100000"
        />

        <label className="block text-gray-700 font-medium mb-2">
          Chọn ngân hàng:
        </label>
        <select
          className="w-full border border-gray-300 rounded px-4 py-2 mb-4"
          value={bank}
          onChange={(e) => setBank(e.target.value)}
        >
          <option value="">-- Chọn ngân hàng --</option>
          <option value="Vietcombank">Vietcombank</option>
          <option value="Techcombank">Techcombank</option>
          <option value="VietinBank">VietinBank</option>
          <option value="ACB">ACB</option>
          <option value="MB Bank">MB Bank</option>
          <option value="BIDV">BIDV</option>
        </select>

        <label className="block text-gray-700 font-medium mb-2">
          Số tài khoản:
        </label>
        <input
          type="text"
          className="w-full border border-gray-300 rounded px-4 py-2 mb-4"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          placeholder="VD: 0123456789"
        />

        <button
          className="bg-green-600 text-black px-6 py-2 rounded hover:bg-green-700 transition"
          onClick={handleWithdraw}
        >
          Gửi Yêu Cầu Rút
        </button>

        {message && <p className="mt-4 text-green-700">{message}</p>}
      </div>

      {/* Lịch sử rút tiền */}
      <div>
        <h3 className="text-lg font-medium mb-2">Lịch sử rút tiền</h3>
        <tbody>
          {requests?.map((req, index) => (
            <tr key={req.id}>
              <td className="px-4 py-2">{index + 1}</td>
              <td className="px-4 py-2">
                {req.amountApproved.toLocaleString()} VND
              </td>
              <td className="px-4 py-2">{req.bankName}</td>
              <td className="px-4 py-2">{req.accountNumber}</td>
              <td className="px-4 py-2">
                <span
                  className={`px-2 py-1 rounded ${
                    req.status === "pending"
                      ? "bg-yellow-100"
                      : req.status === "completed"
                      ? "bg-green-100"
                      : "bg-red-100"
                  }`}
                >
                  {req.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
        {/* Pagination */}
        <PaginationTab
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
}
export default WithDraw;
