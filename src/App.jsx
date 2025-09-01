import { useState } from "react";
import "./App.css";

function App() {
  const [htmlInput, SetHtmlInput] = useState("");
  const [issues, setIssues] = useState([]);
  const [error, setError] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function handleTextChange(event) {
    const { value } = event.target;
    SetHtmlInput(value);
  }

  async function handleSubmit() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ html: htmlInput }),
    };

    try {
      const res = await fetch(
        "http://127.0.0.1:5000/api/v1/ada-check",
        requestOptions
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setError(false);
      console.log(data);
      setIssues(data);
      setSubmitted(true);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(true);
      setIssues([]);
    }
  }

  return (
    <>
      <header className="fixed-top">
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
          <div className="container-fluid">
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
              value={htmlInput}
              onChange={handleTextChange}
              style={{ height: "600px", width: "100%" }}
            />
            <button
              className="btn btn-primary"
              type="button"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
          <div className="col-md-6 col-s-12 p-2">
            <span className="fs-5">Identified Issues</span>
            <div
              id="issues"
              className="overflow-y-auto"
              style={{ maxHeight: "600px" }}
            >
              <IssueBlock issues={issues} error={error} submitted={submitted} />
            </div>
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

function IssueCard({ issue, index }) {
  return (
    <div className="card my-2 p-0">
      <div className="card-body">
        <div className="card-title">
          {index + 1}. {issue.problem}
        </div>
        <div className="card-text">
          <ul>
            <li>Element: {issue.element}</li>
            <li>Details: {issue.details}</li>
            {issue.rule === "COLOR_CONTRAST" ? (
              <>
                <li>Ratio: {issue.ratio}</li>
                <li>Foreground Color: {issue.foreground_color}</li>
                <li>Background Color: {issue.background_color}</li>
              </>
            ) : (
              ""
            )}
            <li>Rule: {issue.rule}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function IssueBlock({ issues, error, submitted }) {
  if (error) {
    return (
      <div className="alert alert-danger">
        There was an error processing the html.
      </div>
    );
  } else if (issues.length) {
    return issues.map((issue, index) => (
      <IssueCard issue={issue} index={index} />
    ));
  } else if (submitted) {
    return <div className="alert alert-success">
      Looks good! There were no accessibility issues identified.
    </div>;
  } else {
    return "";
  }
}

export default App;
