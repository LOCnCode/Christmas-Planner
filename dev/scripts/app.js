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
      value: "",
      giftsLists: [{
        gifts:[]
      }],
      loggedIn: false,  //default state for the app, will not be logged in when first opened
      user: null
    }
    // this.handleDelete = this.handleDelete.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.submitGift = this.submitGift.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }
  // handleDelete(giftToBeDeleted) {
  //   console.log(giftToBeDeleted);
  //   const gifts = this.state.gifts.filter((_items) => {
  //     return _items != itemToBeDeleted
  //   });
  //     this.setState({items: gifts});
  // }
  handleSubmit(e) {
    e.preventDefault();

    const userId = this.state.user.uid;

    const passGiftReceiverList = firebase.database().ref(userId); //giftReceiverName, passing the list to FB, cant change
    console.log("list creation button is working");

    const list = this.state.enterGiftReceiverName;  //enterGiftReceiverName here is referring to the empty list from above in the constructor, this is where the gift receiver name will be stored when entering it on the site
    // console.log(list);
    passGiftReceiverList.push({
      name: list
    }); //this is pushing the info over to FB
    this.setState({
      value: "",
      currentList: list, //this may change later, but for a starting point to begin working on the list
      enterGiftReceiverName: ""
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
    // console.log("passing the gifts");
    const inputVal = "enterReceiverGiftItems" + personKey;
    const giftItems = this.state[inputVal];
    passReceiverGiftItems.push(giftItems);
    this.setState({
      currentGiftItems: giftItems,
      [inputVal]: ''
    });
  }
  removeGift(key) {
    const userId = this.state.user.uid;
    const userRef =firebase.database().ref(`${userId}/${key}`);
    userRef.remove();
  }
  render() {
    // console.log(this.state.lists);
    const showChristmasPlanner = () => {
      if (this.state.loggedIn === true) {
    		return (
    			<div className="app"> {/*root enveloping DOM begins*/}
            <nav className="logOutContainer clearfix">
              <h1 className="logOutTitle">Present Planner</h1>
              <div className="navSplit">
                <div className="bubbleBox">
                  <div className="logBubble">
                    <img  src="../../images/buttonbubble.png" alt="Yellow pop art style speech bubble."/>
                  </div>
                  <button className="logOutButton" onClick={this.logout}>Log Out</button>
                </div> {/*bubbBox ends*/}
              </div> {/*navSplit endss*/}
            </nav>

            <section className="createGiftReceiverInfoSection">
              <form className="createGiftReceiverForm">
                <input value={this.state.enterGiftReceiverName} name="enterGiftReceiverName" onChange={this.handleChange} type="text" placeholder="Enter Gift Receiver's Name"/>                                
                <button disabled={!this.state.enterGiftReceiverName} className="createGiftReceiverButton" onClick={this.handleSubmit}>Create New Gift List</button>
              </form> {/*giftReceiverForm ends*/}
            </section> {/*createGiftReceiverInfo list section ends*/}  

            <div className="giftReceiverFormContainer">
              <section className="displayGiftReceiverLists">
                <div className="wrapper">
                  <ul>
                    {this.state.lists.map((person) => {
                      // console.log(person);
                      const inputVal = 'enterReceiverGiftItems' + person.key;
                      return (
                        <li className="giftList" key={person.key}>
                          <div className="nameContainer">
                            <p className="personName">{person.name}</p>
                          </div>
                          <form onSubmit={(e) => this.submitGift(e,person.key)}>
                            <input name={`enterReceiverGiftItems${person.key}`} onChange={this.handleChange} type="text" placeholder="Enter Gift Items" value={this.state[inputVal]}/>
                            <input disabled={!this.state[inputVal]} type="submit" />
                          </form>
                          <ul>
                            {person.gifts.map((gift) => {
                              return (
                                <div className="listItemContainer">
                                  <li className="gifts">{gift}</li>
                                {/*<button onClick={ this.props.handleDelete.bind(null, gifts)}> x </button>*/}
                                </div>
                              )
                            })}
                          </ul>
                        </li>
                      )
                    })}   
                  </ul>                
                </div> {/*wrapper ends*/}
              </section> {/*displayGiftReceiverLists section ends*/}     
            </div> {/* giftReceiverFormContainer ends*/}
            <footer>
              <div className="footerContainer FCL">
                <a class="twitter-share-button" href="https://twitter.com/intent/ QWET
                + text=Never%20forget%20a%20gift%20again%20with%20this%20Present%20Planner%20by%20@LOCnCode" data-size="large"><i className="fa fa-twitter" aria-hidden="true"></i>Share!</a>
                <a className="personalTwitter" href="https://twitter.com/LOCnCode" target="_blank"><i className="fa fa-twitter-square" aria-hidden="true"></i>Tweet Me!</a>
              </div>
              <div className="footerContainer">
                <p>&copy;Laurie OConnor 2017</p>
              </div> {/* footerContainer ends*/}
            </footer>
    			</div> // root enveloping DOM ends
    		) //closes the return   
      } else { //the if ends here before the else
        return (
          <div>
              <div className="loginContainer">
                <div className="logBubble">
                  <img  src="../../images/buttonbubble.png" alt="Yellow pop art style speech bubble."/>
                </div>
                <div className="logInButton">
                  <button  onClick={this.login}>Log In</button>
                </div>
              </div>
            <main className="logInPage">
              <div className="titleContainer">
                <div className="logInTitle1">
                  <img src="../../images/popartbubble.png" alt="White pop art style speech bubble with explosion behind it."/>
                </div>
                <div className="logInTitle2">
                  {/*<h2>Present</h2>
                  <h2>Planner</h2>*/}
                </div>
              </div>
              <div>
                {/*<p>screenshots?</p>*/}
              </div>
            </main>
            
          </div>
        ) //return ends
      } //closes the else
    }
    return (
      <main>
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
             const giftArray = [];
              // const giftArray = [];
              // console.log(peopleList[key])
              for(let gift in peopleList.gifts){
                giftArray.push(peopleList.gifts[gift])
              }
              people.push({
                key:originalKey,
                name:peopleList.name,
                gifts: giftArray
              })
          } //closes the for 
          console.log(people)
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











