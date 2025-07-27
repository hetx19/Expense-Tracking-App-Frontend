import { IoMdCard } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { LuHandCoins, LuWalletMinimal } from "react-icons/lu";

// Hooks
import { Authhooks } from "../../hooks/Authhooks";

// Components
import InfoCard from "../../components/cards/InfoCard";
import DashboardLayout from "../../components/layout/Dashboard";
import RecentIncome from "../../components/dashboard/RecentIncome";
import FinanceOverview from "../../components/dashboard/FinanceOverview";
import RecentIncomeChart from "../../components/dashboard/RecentIncomeChart";
import RecentTransaction from "../../components/dashboard/RecentTransaction";
import Last30DaysExpenses from "../../components/dashboard/Last30DaysExpenses";
import ExpenseTransactions from "../../components/dashboard/ExpenseTransactions";

// Utils
import axiosInst from "../../utils/axios";
import { API_ENDPOINT } from "../../utils/api";
import { addThousandsSeparator } from "../../utils/helper";

const Home = () => {
  Authhooks();

  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchDashboardData = async () => {
    if (loading) {
      return;
    }

    setLoading(false);

    try {
      const responce = await axiosInst.get(
        `${API_ENDPOINT.DASHBOARD.GET_DASHBOARD_DATA}`
      );

      if (responce.data) {
        setDashboardData(responce.data);
      }
    } catch (error) {
      console.error("Something Went Wrong. Please Try Again", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InfoCard
            icon={<IoMdCard />}
            label="Total Balance"
            value={addThousandsSeparator(dashboardData?.totalBalance || 0)}
            colour="bg-primary"
          />
          <InfoCard
            icon={<LuHandCoins />}
            label="Total Income"
            value={addThousandsSeparator(dashboardData?.totalIncome || 0)}
            colour="bg-orange-500"
          />
          <InfoCard
            icon={<LuWalletMinimal />}
            label="Total Expense"
            value={addThousandsSeparator(dashboardData?.totalExpenses || 0)}
            colour="bg-red-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <RecentTransaction
            transaction={dashboardData?.recentTransactions}
            seeMore={() => navigate("/expense")}
          />
          <FinanceOverview
            totalBalance={dashboardData?.totalBalance || 0}
            totalIncome={dashboardData?.totalIncome || 0}
            totalExpenses={dashboardData?.totalExpenses || 0}
          />
          <ExpenseTransactions
            transaction={dashboardData?.last30DaysExpenses?.transactions || []}
            seeMore={() => navigate("/expense")}
          />
          <Last30DaysExpenses
            data={dashboardData?.last30DaysExpenses?.transactions || []}
          />
          <RecentIncomeChart
            data={
              dashboardData?.last60DaysIncome?.transactions?.slice(0, 4) || []
            }
            totalIncome={dashboardData?.totalIncome || 0}
          />
          <RecentIncome
            transaction={dashboardData?.last60DaysIncome?.transactions || []}
            seeMore={() => navigate("/income")}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Home;
