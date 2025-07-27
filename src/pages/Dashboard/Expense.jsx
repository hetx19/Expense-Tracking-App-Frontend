import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

// Hooks
import { Authhooks } from "../../hooks/Authhooks";

// Components
import Modal from "../../components/Modal";
import DeleteAlert from "../../components/DeleteAlert";
import ExpenseList from "../../components/expense/ExpenseList";
import DashboardLayout from "../../components/layout/Dashboard";
import AddExpenseForm from "../../components/expense/AddExpenseForm";
import ExpenseOverview from "../../components/expense/ExpenseOverview";

// Utils
import axiosInst from "../../utils/axios";
import { API_ENDPOINT } from "../../utils/api";

const Expense = () => {
  Authhooks();

  const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);
  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });

  const fetchExpenseDetails = async () => {
    if (loading) {
      return;
    }

    setLoading(true);

    try {
      const responce = await axiosInst.get(
        `${API_ENDPOINT.EXPENSE.GET_EXPENSE}`
      );

      if (responce.data) {
        setExpenseData(responce.data);
      }
    } catch (error) {
      console.error("Something Went Wrong. Please Try Agin", error);
    } finally {
      setLoading(false);
    }
  };

  const addExpenseDetails = async (expense) => {
    const { category, amount, date, icon } = expense;

    if (!category.trim()) {
      toast.error("Category is required.");
      return;
    }

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error("Amount should be a valid number greater than 0.");
      return;
    }

    if (!date) {
      toast.error("Date is required.");
      return;
    }

    try {
      await axiosInst.post(API_ENDPOINT.EXPENSE.ADD_EXPENSE, {
        category,
        amount,
        date,
        icon,
      });

      setOpenAddExpenseModal(false);

      toast.success("Expense added successfully.");
      fetchExpenseDetails();
    } catch (error) {
      console.error(
        "Error Occured",
        error.responce?.data?.message || error.message
      );
    }
  };

  const deleteExpenseDetails = async (id) => {
    try {
      await axiosInst.delete(API_ENDPOINT.EXPENSE.DELETE_EXPENSE(id));

      setOpenDeleteAlert({ show: false, data: null });

      toast.success("Expense details deleted successfully.");
      fetchExpenseDetails();
    } catch (error) {
      console.error(
        "Error Occured",
        error.responce?.data?.message || error.message
      );
    }
  };

  const downloadExpenseDetails = async () => {
    try {
      const responce = await axiosInst.get(
        API_ENDPOINT.EXPENSE.DOWNLOAD_EXPENSE_EXCEL,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([responce.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "expense_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading expense details", error);
      toast.error("Failed to download expense details. Please try again.");
    }
  };

  useEffect(() => {
    fetchExpenseDetails();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DashboardLayout activeMenu="Expense">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <ExpenseOverview
              transaction={expenseData}
              addExpense={() => setOpenAddExpenseModal(true)}
            />
          </div>
          <ExpenseList
            transactions={expenseData}
            onDelete={(id) => {
              setOpenDeleteAlert({ show: true, data: id });
            }}
            onDownload={downloadExpenseDetails}
          />
        </div>

        <Modal
          isOpen={openAddExpenseModal}
          onClose={() => setOpenAddExpenseModal(false)}
          title="Add Expense"
        >
          <AddExpenseForm addExpense={addExpenseDetails} />
        </Modal>

        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Delete Expense"
        >
          <DeleteAlert
            content="Are you sure you want to delete this expense details?"
            onDelete={() => deleteExpenseDetails(openDeleteAlert.data)}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Expense;
