import React, { Component } from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import injectTapEventPlugin from "react-tap-event-plugin";
import orderBy from "lodash/orderBy";
import config from "./config";
import {load} from "./spreadsheet"

import logo from "./logo.svg";
import "./App.css";
import Form from "./Form";
import Table from "./Table";
import RaisedButton from "material-ui/RaisedButton";

injectTapEventPlugin();

const invertDirection = {
  asc: "desc",
  desc: "asc"
};

const privateKey = "https://docs.google.com/spreadsheets/d/1gEOdz7W91sGS702mC5_YSEUsjCD74hupSl-Y7v4z3CI/edit?usp=sharing"
const key2 = "https://script.google.com/macros/s/AKfycbx2HiriWwiOqGEQnYkPMwkH1FfZ1bZyAu10xKkw8T8ZKEB1OqA/exec"

const data = [
  {
    firstName: "Tann",
    lastName: "Gounin",
    username: "tgounin0",
    email: "tgounin0@wordpress.com",
    passsword: "yJG2MuL5piY"
  },
  {
    firstName: "Ari",
    lastName: "Spedroni",
    username: "aspedroni4",
    email: "aspedroni4@sun.com",
    passsword: "o78ibUPPmDlZ"
  },
  {
    firstName: "Abelard",
    lastName: "Rodriguez",
    username: "arodriguez5",
    email: "arodriguez5@shutterfly.com",
    passsword: "g2jd4AwfpA"
  },
  {
    firstName: "Ikey",
    lastName: "Latek",
    username: "ilatek6",
    email: "ilatek6@berkeley.edu",
    passsword: "GAsgPpKvJx"
  },
  {
    firstName: "Justis",
    lastName: "Habbeshaw",
    username: "jhabbeshaw7",
    email: "jhabbeshaw7@simplemachines.org",
    passsword: "GN2aQt3ZPq"
  },
  {
    firstName: "Maddie",
    lastName: "Bayne",
    username: "mbayne8",
    email: "mbayne8@constantcontact.com",
    passsword: "H1GmQcyG6"
  },
  {
    firstName: "Gerrie",
    lastName: "Rulton",
    username: "grulton9",
    email: "grulton9@reverbnation.com",
    passsword: "tcwp6oONe"
  }
];
if (localStorage.getItem("students") === null)
localStorage.setItem('students', JSON.stringify(data));

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      editIdx: -1,
      columnToSort: "",
      sortDirection: "desc",
      cars: [],
      error: null
    };
  }

  componentWillMount() {
    // console.log("hey");
    // console.log(this.state.data);
    let data = JSON.parse(localStorage.getItem("students"));
    this.setState((prevState, props) => ({
      data: data
    }));

    window.addEventListener(
      "beforeunload",
      this.saveStateToLocalStorage.bind(this)
    );

  }

  saveStateToLocalStorage() {
    // for every item in React state
    let data = this.state.data
    localStorage.setItem('students', JSON.stringify(data))
  }

  componentDidMount() {
    window.gapi.load("client", this.initClient);
  }

  initClient = () => {
    // 2. Initialize the JavaScript client library.
    window.gapi.client
      .init({
        apiKey: config.apiKey,
        // Your API key will be automatically added to the Discovery Document URLs.
        discoveryDocs: config.discoveryDocs
      })
      .then(() => {
      // 3. Initialize and make the API request.
      load(this.onLoad);
    });
  };

  onLoad = (data, error) => {
    console.log(data)
    console.log(error)
    if (data) {
      const cars = data.cars;
      this.setState({ cars });
    } else {
      this.setState({ error });
    }
  };

  handleRemove = i => {
    this.setState(state => ({
      data: state.data.filter((row, j) => j !== i)
    }));
    let data = this.state.data.filter((row, j) => j !== i)
    localStorage.setItem('students', JSON.stringify(data))

  };

  startEditing = i => {
    this.setState({ editIdx: i });
  };

  stopEditing = () => {
    this.setState({ editIdx: -1 });
  };

  handleSave = (i, x) => {
    this.setState(state => ({
      data: state.data.map((row, j) => (j === i ? x : row))
    }));
    let data = this.state.data.map((row, j) => (j === i ? x : row))
    localStorage.setItem('students', JSON.stringify(data))
    this.stopEditing();
  };

  handleSort = columnName => {
    this.setState(state => ({
      columnToSort: columnName,
      sortDirection:
        state.columnToSort === columnName
          ? invertDirection[state.sortDirection]
          : "asc"
    }));
  };

  finalSubmission= submission => {
    let data = [...this.state.data, submission]
    localStorage.setItem('students', JSON.stringify(data))
    return (
      this.setState({
        data: data
      })
    )
  }

  onSubmitFile = e => {
    e.preventDefault();
    console.log("onSubmitFile")
    let firstName = this.state.data.map(item => {
      return {firstName:item.firstName}
    });
    let lastName = this.state.data.map(item => {
      return {lastName:item.lastName}
    });
    let username = this.state.data.map(item => {
      return {username:item.username}
    });
    let email = this.state.data.map(item => {
      return {email:item.email}
    });
    let passsword = this.state.data.map(item => {
      return {passsword:item.passsword}
    });

    firstName = JSON.stringify(firstName);
    lastName = JSON.stringify(lastName);
    username = JSON.stringify(username);
    email = JSON.stringify(email);
    passsword = JSON.stringify(passsword);

    return fetch('https://script.google.com/macros/s/AKfycbx2HiriWwiOqGEQnYkPMwkH1FfZ1bZyAu10xKkw8T8ZKEB1OqA/exec?firstName=' + firstName + '&&lastName=' + lastName + '&&username=' + username + '&&email=' + email + '&&passsword=' + passsword)
    // return fetch('https://script.google.com/macros/s/AKfycbx2HiriWwiOqGEQnYkPMwkH1FfZ1bZyAu10xKkw8T8ZKEB1OqA/exec', {
    //     method: "POST", // *GET, POST, PUT, DELETE, etc.
    //     mode: "no-cors", // no-cors, cors, *same-origin
    //     cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    //     credentials: "same-origin", // include, *same-origin, omit
    //     headers: {
    //         "Content-Type": "application/json",
    //         // "Content-Type": "application/x-www-form-urlencoded",
    //     },
    //     redirect: "follow", // manual, *follow, error
    //     referrer: "no-referrer", // no-referrer, *client
    //     body: JSON.stringify(data), // body data type must match "Content-Type" header
    // })
    // .then((response) => response.json())
    .then((responseJson) =>
    {
      console.log(responseJson);
    })
    .catch((error) =>
    {
        console.error(error);
    });
   }

  componentWillUnmount() {
    window.removeEventListener(
      "beforeunload",
      this.saveStateToLocalStorage.bind(this)
    );

    // saves if component has a chance to unmount
    this.saveStateToLocalStorage();
  }

  render() {
    return (
      <MuiThemeProvider>
        <div className="App">
          <RaisedButton label="Add data to google spreedsheet" onClick={e => this.onSubmitFile(e)} primary />
          <Form
            onSubmit={this.finalSubmission}
          />
          <Table
            handleSort={this.handleSort}
            handleRemove={this.handleRemove}
            startEditing={this.startEditing}
            editIdx={this.state.editIdx}
            stopEditing={this.stopEditing}
            handleSave={this.handleSave}
            columnToSort={this.state.columnToSort}
            sortDirection={this.state.sortDirection}
            data={orderBy(
              this.state.data,
              this.state.columnToSort,
              this.state.sortDirection
            )}
            header={[
              {
                name: "First name",
                prop: "firstName"
              },
              {
                name: "Last name",
                prop: "lastName"
              },
              {
                name: "Username",
                prop: "username"
              },
              {
                name: "Email",
                prop: "email"
              }
            ]}
          />
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
