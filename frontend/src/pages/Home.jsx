import DashboardHeader from "../components/DashboardHeader/DashboardHeader";
import StatsSection from "../components/StatsSection/StatsSection";
import ActivitySection from "../components/ActivitySection/ActivitySection";

function Home({ stats }) {
  return (
    <>
      <DashboardHeader />
      <StatsSection stats={stats} />
      <ActivitySection />
    </>
  );
}

export default Home;