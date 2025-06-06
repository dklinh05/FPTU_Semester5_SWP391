import CardDashboard from "../../components/CardDashboard";

function Dashboard() {
  return (

      <div className="main-content">
        <div className="extra-header"></div>
        <div class="card-service-section px-0 px-md-0 px-lg-3">
          <div class="container-fluid">
            <div class="row">
              <CardDashboard />

            </div>
          </div>
        </div>
      </div>
  );
}

export default Dashboard;
