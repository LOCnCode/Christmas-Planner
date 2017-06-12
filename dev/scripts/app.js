import React from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  NavLink as Link,
  Route
} from "react-router-dom";

// Initialize Firebase, get this info from the FB website after you have created the project
var config = { //christmas planner
  apiKey: "AIzaSyAJB7TLuZhvm0PHSs7NT11cIVjY-jiWoxU",
  authDomain: "christmas-planner-d6c37.firebaseapp.com",
  databaseURL: "https://christmas-planner-d6c37.firebaseio.com",
  projectId: "christmas-planner-d6c37",
  storageBucket: "christmas-planner-d6c37.appspot.com",
  messagingSenderId: "184590846731"
};

firebase.initializeApp(config);

const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
const fbRef = firebase.database().ref("/"); //or /list1 if you have more then one list

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      passGiftReceiverList: "", //this needs to be the same as what is being pushed into the list/FB (below in handleSubmit)
      lists: [],
      enterGiftReceiverName: "",
      passReceiverGiftItems: "",
      enterReceiverGiftItems: "",
      giftsLists: [{
        gifts:[]
      }],
      loggedIn: false,  //default state for the app, will not be logged in when first opened
      user: null
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.submitGift = this.submitGift.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }
  handleSubmit(e) {
    e.preventDefault();
    const userId = this.state.user.uid;
    // const userRef= firebase.database().ref(userId);

    // userRef.push(this.state.passGiftReceiverList);
    // this.setState({
    //   passGiftReceiverList: ""
    // });

    const passGiftReceiverList = firebase.database().ref(userId); //giftReceiverName, passing the list to FB, cant change
    console.log("list creation button is working");

    const list = this.state.enterGiftReceiverName;  //enterGiftReceiverName here is referring to the empty list from above in the constructor, this is where the gift receiver name will be stored when entering it on the site
    console.log(list);
    passGiftReceiverList.push({
      name: list
    }); //this is pushing the info over to FB
    this.setState({
      currentList: list //this may change later, but for a starting point to begin working on the list
    });
  }
  handleChange(e) {
    // e.target.name is the input name property, same as when set this.state at beginning
    this.setState ({
      [e.target.name]: e.target.value
    })
  }
  login() {
    auth.signInWithPopup(provider)
    .then((result) => {
      const user = result.user;
      this.setState({
        user: user,
        loggedIn: true
      })
    });
  }
  logout() {
    auth.signOut()
    .then(() => {
      this.setState ({
        user: null,
        loggedIn: false
      })
    });
  }
  submitGift(e,personKey) {
    e.preventDefault();
    console.log("wooooorking");
    //we want to grab the value of the input, enterReceiverGiftItems
    //then save the value in FB, but in an object associated to the person's name 

    const passReceiverGiftItems = firebase.database().ref(`/${firebase.auth().currentUser.uid}/${personKey}/gifts`); //.child("giftItems")
    console.log("passing the gifts");

    const giftItems = this.state.enterReceiverGiftItems
    passReceiverGiftItems.push(giftItems);
    this.setState({
      currentGiftItems: giftItems
    });
  }
  render() {
    // console.log(this.state.lists);
    const showChristmasPlanner = () => {
      if (this.state.loggedIn === true) {
    		return (
    			<div className="app"> {/*root enveloping DOM begins*/}
            <nav>
              <button onClick={this.logout}>Log Out</button>
            </nav>
            <div className="container">
              <section className="createGiftReceiverInfo">
                <form>
                  <input name="enterGiftReceiverName" onChange={this.handleChange} type="text" placeholder="Enter Gift Receiver's Name"/>
                  <button onClick={this.handleSubmit}>Create New Gift Receiver List</button>
                </form>
              </section> {/*createGiftReceiverInfo list section ends*/}     
              <section className="displayGiftReceiverLists">
                <div className="wrapper">
                  <ul>
                    {this.state.lists.map((person) => {
                      // console.log(person);
                      return (
                        <li key={person.key}>
                          <p>{person.name}</p>
                          <form onSubmit={(e) => this.submitGift(e,person.key)}>
                            <input name="enterReceiverGiftItems" onChange={this.handleChange} type="text" placeholder="Enter Present Info"/>
                            <input type="submit" />
                          </form>
                          <ul>
                            {person.gifts.map((gift) => {
                              return (
                                <li>{gift}</li>
                              )
                            })}
                          </ul>
                        </li>
                      )
                    })}   
                  </ul>                
                </div> {/*wrapper ends*/}
              </section> {/*displayGiftReceiverLists section ends*/}     
            </div> {/*container ends*/}
    			</div> // root enveloping DOM ends
    		) //closes the return   
      } else { //the if ends here before the else
        return (
          <div>
            <button onClick={this.login}>Log In</button>
          </div>
        ) //return ends
      } //closes the else
    }
    return (
      <main>
        <h1>Christmas Planner</h1>
        {showChristmasPlanner()}
      </main>
    ) //closes the return
	} // closes the showChristmasPlanner

  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          user: user,
          loggedIn: true
        });

        const userId = user.uid;
    
        const fbListReference = firebase.database().ref(userId);
        
        fbListReference.on("value", (snapshot) => {
          const mainListReference = snapshot.val();
          const newLists = [];
          const people = [];
          for (let originalKey in mainListReference) {
            const peopleList = mainListReference[originalKey];
            console.log(peopleList);
            for(let key in peopleList){
              const giftArray = [];
              // console.log(peopleList[key])
              for(let gift in peopleList.gifts){
                giftArray.push(peopleList.gifts[gift])
              }
              people.push({
                key:originalKey,
                name:peopleList.name,
                gifts: giftArray
              })
            }
            // newLists.push({
            //   key: key,
            //   people: people
            // }); //closes the push
          } //closes the for 
          this.setState ({
            lists: people
          }); //closes the setState
        }); //closes the fbListReference
      } else {
        this.setState({
          user: null,
          loggedIn: false
        });
      }
    });
  } //closes the componentDidMount
} //closes the main render

ReactDOM.render(<App />, document.getElementById('app'));











