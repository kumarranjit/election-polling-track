const GrafanaDashboard = () => {
const url="https://santaijosephsekar.grafana.net/public-dashboards/b160c8dcb3024ddca27a1bc3ba21e05b";

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <iframe
        src={url}    //"https://santaijosephsekar.grafana.net/public-dashboards/b160c8dcb3024ddca27a1bc3ba21e05b"
        width="100%"
        height="100%"
        style={{ border: "0" }}
        title="Grafana Dashboard"
      />
    </div>
  );
};

export default GrafanaDashboard;