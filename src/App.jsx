import "./App.css";

function App() {
  return (
    <>
      <header className="fixed-top">
        <nav class="navbar navbar-expand-lg bg-body-tertiary">
          <div class="container-fluid">
            <span className="fs-3">ADA Compliance Checker</span>
          </div>
        </nav>
      </header>
      <div className="container content mt-5">
        <div className="row">
          <div className="col-md-6 col-s-12 p-2">
            <span className="fs-5">Input HTML Code</span>
            <textarea
              className="overflow-auto"
              style={{ height: "600px", width: "100%" }}
            />
            <input className="btn btn-primary" type="submit"></input>
          </div>
          <div className="col-md-6 col-s-12 p-2">
            <span className="fs-5">Identified Issues</span>

          </div>
        </div>
      </div>

      <footer>
        <div className="container mt-3">
          <div className="row">
            <div className="col-xs-12 text-center">
              <div>© 2025 Jason Entgelmeier</div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;
