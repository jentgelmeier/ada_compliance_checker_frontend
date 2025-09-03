import { useState } from "react";
import "./App.css";

function App() {
  const [htmlInput, setHtmlInput] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [issues, setIssues] = useState([]);
  const [error, setError] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [urlToggle, setUrlToggle] = useState(false);

  // values that depend on urlToggle
  const inputText = urlToggle ? "text-body-tertiary" : "";
  const urlText = urlToggle ? "" : "text-body-tertiary";
  const placeholder = `Enter html, i.e.,

<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Test Page</title>
  </head>
  <body>
    <h1>This is a Test Page</h1>
  </body>
</html>`;

  function handleTextChange(event, source) {
    const { value } = event.target;
    if (source === "html") {
      setHtmlInput(value);
    } else {
      setUrlInput(value);
    }
  }

  function handleToggle() {
    setUrlToggle(!urlToggle);
    setIssues([]);
    setSubmitted(false);
  }

  async function handleSubmit() {
    let body, requestUrl;
    if (urlToggle) {
      body = JSON.stringify({ url: urlInput });
      requestUrl = "http://127.0.0.1:5000/api/v1/url-check";
    } else {
      body = JSON.stringify({ html: htmlInput });
      requestUrl = "http://127.0.0.1:5000/api/v1/html-check";
    }

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    };

    try {
      const res = await fetch(requestUrl, requestOptions);

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
            <div className="row">
              <div className="col d-flex">
                <span className={`fs-5 ${inputText}`}>Input HTML</span>
                <div class="form-check form-switch d-flex align-items-center ps-5">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    role="switch"
                    value={urlToggle}
                    onChange={handleToggle}
                  />
                </div>
                <span className={`fs-5 ${urlText}`}>Input URL</span>
              </div>
            </div>
            {urlToggle ? (
              <input
                type="text"
                className="form-control mb-3"
                placeholder="Enter a URL, i.e., https://duckduckgo.com"
                value={urlInput}
                onChange={(e) => handleTextChange(e, "url")}
              />
            ) : (
              <textarea
                className="overflow-auto"
                value={htmlInput}
                onChange={(e) => handleTextChange(e, "html")}
                style={{ height: "600px", width: "100%" }}
                placeholder={placeholder}
              />
            )}
            <button
              className="btn btn-primary"
              type="button"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
          <div className="col-md-6 col-s-12 p-2" style={{ minHeight: "690px" }}>
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
  } else if (issues.message) {
    return (
      <div className="alert alert-danger">
        {issues.message}
      </div>
    );
  } else if (submitted) {
    return (
      <div className="alert alert-success">
        Looks good! There were no accessibility issues identified.
      </div>
    );
  } else {
    return "";
  }
}

export default App;
