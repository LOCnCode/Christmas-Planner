import React from "react";
import ReactDOM from "react-dom";

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

const fbRef = firebase.database().ref("/"); //or /list1 if you have more then one list

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      passGiftReceiverList: "", //this needs to be the same as what is being pushed into the list/FB (below in handleSubmit)
      lists: [{
        people:[]
      }],
      enterGiftReceiverName: "",
      passReceiverGiftItems: "",
      enterReceiverGiftItems: "",
      giftsLists: [{
        gifts:[]
      }]
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.submitGift = this.submitGift.bind(this);
  }
  handleSubmit(e) {
    e.preventDefault();
    const passGiftReceiverList = firebase.database().ref("giftReceiverName"); //giftReceiverName, passing the list to FB, cant change
    console.log("list creation button is working");

    const list = this.state.enterGiftReceiverName;  //enterGiftReceiverName here is referring to the empty list from above in the constructor, this is where the gift receiver name will be stored when entering it on the site

    passGiftReceiverList.push(list); //this is pushing the info over to FB
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
  submitGift(e) {
    e.preventDefault();
    console.log("wooooorking");
    //we want to grab the value of the input, enterReceiverGiftItems
    //then save the value in FB, but in an object associated to the person's name 

    const passReceiverGiftItems = firebase.database().ref("giftItems"); //.child("giftItems")
    console.log("passing the gifts");

    const giftItems = this.state.enterReceiverGiftItems
    passReceiverGiftItems.push(giftItems);
    this.setState({
      currentGiftItems: giftItems
    });
  }

  render() {
 
  		return (
  			<div className="app"> {/*root enveloping DOM begins*/}
  				<header>
            <h1>Christmas Planner</h1>    
          </header>
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
                  {this.state.lists[0].people.map((person) => {
                    return (
                      <li key={person.key}>
                        <p>{person.name}</p>
                        <form onSubmit={this.submitGift}>
                          <input name="enterReceiverGiftItems" onChange={this.handleChange} type="text" placeholder="Enter Present Info"/>
                          <input type="submit" />
                        </form>
                        <ul>
                          {this.state.giftsLists[0].gifts.map((gift) => {
                          return (
                            <div>
                              <li key={gift.key}>
                                <p>{gift.name}</p>
                              </li>
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
          </div> {/*container ends*/}
  			</div> // root enveloping DOM ends
  		) //closes the return    
	} //closes the render

  componentDidMount() {
    const fbListReference = firebase.database().ref();
    fbListReference.on("value", (snapshot) => {
      const mainListReference = snapshot.val();
      const newLists = [];
      for (let key in mainListReference) {
        const peopleList = mainListReference[key];
        const people = [];
        for(let key in peopleList){
          people.push({
            key:key,
            name:peopleList[key]
          })
        }
        newLists.push({
          key: key,
          people: people
        }); //closes the push
      } //closes the for 
      this.setState ({
        lists: newLists
      }); //closes the setState
    }); //closes the fbListReference

    const fbSubListReference = firebase.database().ref();
    fbSubListReference.on("value", (snapshot) => {
      const subListReference = snapshot.val();
      const subLists = [];
      for (let key in subListReference) {
        const giftsList = subListReference[key];
        const gifts = [];
        for(let key in giftsList){
          gifts.push({
            key:key,
            name:giftsList[key]
          })
        }
        subLists.push({ 
          key: key,
          gifts: gifts
        }); //closes the push
      } //closes the for 
      this.setState ({
        gifts: subLists
      }); //closes the setState
    }); //closes the fbListReference
  } //closes the componentDidMount
} //closes the main render

ReactDOM.render(<App />, document.getElementById('app'));











