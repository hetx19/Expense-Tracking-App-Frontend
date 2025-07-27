import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

// Hooks
import { Authhooks } from "../../hooks/Authhooks";

// Components
import Modal from "../../components/Modal";
import DeleteAlert from "../../components/DeleteAlert";
import IncomeList from "../../components/income/IncomeList";
import DashboardLayout from "../../components/layout/Dashboard";
import AddIncomeForm from "../../components/income/AddIncomeForm";
import IncomeOverview from "../../components/income/IncomeOverview";

// Utils
import axiosInst from "../../utils/axios";
import { API_ENDPOINT } from "../../utils/api";

const Income = () => {
  Authhooks();

  const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false);
  const [incomeData, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });

  const fetchIncomeDetails = async () => {
    if (loading) {
      return;
    }

    setLoading(true);

    try {
      const responce = await axiosInst.get(`${API_ENDPOINT.INCOME.GET_INCOME}`);

      if (responce.data) {
        setIncomeData(responce.data);
      }
    } catch (error) {
      console.error("Something Went Wrong. Please Try Agin", error);
    } finally {
      setLoading(false);
    }
  };

  const addIncomeDetails = async (income) => {
    const { source, amount, date, icon } = income;

    if (!source.trim()) {
      toast.error("Source is required.");
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
      await axiosInst.post(API_ENDPOINT.INCOME.ADD_INCOME, {
        source,
        amount,
        date,
        icon,
      });

      setOpenAddIncomeModal(false);

      toast.success("Income added successfully.");
      fetchIncomeDetails();
    } catch (error) {
      console.error(
        "Error Occured",
        error.responce?.data?.message || error.message
      );
    }
  };

  const deleteIncomeDetails = async (id) => {
    try {
      await axiosInst.delete(API_ENDPOINT.INCOME.DELETE_INCOME(id));

      setOpenDeleteAlert({ show: false, data: null });

      toast.success("Income details deleted successfully.");
      fetchIncomeDetails();
    } catch (error) {
      console.error(
        "Error Occured",
        error.responce?.data?.message || error.message
      );
    }
  };

  const downloadIncomeDetails = async () => {
    try {
      const responce = await axiosInst.get(
        API_ENDPOINT.INCOME.DOWNLOAD_INCOME_EXCEL,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([responce.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "income_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading income details", error);
      toast.error("Failed to download income details. Please try again.");
    }
  };

  useEffect(() => {
    fetchIncomeDetails();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DashboardLayout activeMenu="Income">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <IncomeOverview
              transaction={incomeData}
              addIncome={() => setOpenAddIncomeModal(true)}
            />
          </div>
          <IncomeList
            transactions={incomeData}
            onDelete={(id) => {
              setOpenDeleteAlert({ show: true, data: id });
            }}
            onDownload={downloadIncomeDetails}
          />
        </div>

        <Modal
          isOpen={openAddIncomeModal}
          onClose={() => setOpenAddIncomeModal(false)}
          title="Add Income"
        >
          <AddIncomeForm addIncome={addIncomeDetails} />
        </Modal>

        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Delete Income"
        >
          <DeleteAlert
            content="Are you sure you want to delete this income details?"
            onDelete={() => deleteIncomeDetails(openDeleteAlert.data)}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Income;
