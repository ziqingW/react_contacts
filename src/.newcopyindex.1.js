import React from 'react';
import ReactDOM from 'react-dom';
import 'font-awesome/css/font-awesome.min.css';
import { BrowserRouter, Route, Link, Switch } from 'react-router-dom';

// preSet contacts
var preList = localStorage.getItem('localContacts') ?
    JSON.parse(localStorage.getItem('localContacts')) : {
        contacts: [{
            name: 'Ziqing',
            email: 'redtaq@hotmail.com',
            number: '8046878474',
            address: '3802 Paigewood Dr.',
            city: 'Pearland',
            state: 'TX',
            zip: '77584',
            id: 1,
            fav: false
        }, {
            name: 'Jimmy',
            email: 'Jimmy@hotmail.com',
            number: '5723218526',
            address: '5509 Beachnut Blvd.',
            city: 'Houston',
            state: 'TX',
            zip: '77331',
            id: 2,
            fav: false
        }, {
            name: 'Sam',
            email: 'Sam@aol.com',
            number: '2571416354',
            address: '2807 Main St.',
            city: 'Houston',
            state: 'TX',
            zip: '77110',
            id: 3,
            fav: false
        }],
        givenId: 4
    };

// header
function Header() {
    return (
        <div><h1>My Contacts</h1></div>
    );
}

// sorting contacts by name    
function sortContacts(names) {
    names = names.sort((a, b) => {
        if (a.name < b.name) {
            return -1;
        }
        else if (a.name > b.name) {
            return 1;
        }
        else {
            return 0;
        }
    });
    return names;
}

// favorite toggle panel
class SidePanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            contacts : props.contacts,
            currentCard : props.currentCard,
            searchContacts : props.searchContacts,
            isFaved : props.isFaved,
            
        };
    }

    // search contacts
    searchedContacts = e => {
        const regex = new RegExp(e.target.value, 'i');
        let results = this.state.contacts.filter(contact => {
            let contactItems = Object.values(contact);
            for (let index in contactItems) {
                if (regex.test(contactItems[index])) {
                    return true;
                }
            }
            return false;
        });
        this.setState({
            searchContacts : results,
        });
        this.props.searchedContacts(results);
    }
    
    // show favs only
    showFavs = () => {
        this.setState ({
           isFaved : !this.state.isFaved 
        });  
        this.props.showFavs();
    }
    
    //add new button    
    addNew = () => {
        this.props.addNew();
    }
    
    //check individual namecard    
    checkPerson = i => {
        this.setState ({
            currentCard : i
        });   
        this.props.checkPerson(i);
    }
    
    // favorite person
    favorite = i => {
        let searchContactsCopy = this.state.searchContacts.slice();
        searchContactsCopy[i].fav = !searchContactsCopy[i].fav;
        this.setState({
            searchContacts: searchContactsCopy
        });
        this.props.favorite(searchContactsCopy);
    }
    
    render () {
        let simpleCards = [];
        if (this.state.isFaved) {
            simpleCards = this.state.searchContacts.filter(contact => {
                return contact.fav;
            });
        }
        else {
            simpleCards = this.state.searchContacts.slice();
        }
        console.log(simpleCards);
        return (
            <div>
            <div>
            <input type="text" onChange={this.searchedContacts}/>
            <button onClick={()=>this.showFavs()}>fav</button>
            <button onClick={()=>this.addNew()}>New</button>
            </div>
            <div>{ simpleCards.map( (contact, index) => {
                    return (
                    <div key={contact.name}>
                    <p onClick={() => this.checkPerson(index)}>{contact.name}</p><i onClick={() => this.favorite(index)} className="fa fa-heart"></i>
                    <p>{contact.city} {contact.state}</p>
                    </div>);
                })
                }</div>
            </div>
            );
    }
}

// individual name card
class IndividualCard extends React.Component {
    constructor (props) {
        super (props);
    }
    
    render() {
        return (
            <div>
            <p>Name: {this.props.searchContacts[this.props.currentCard].name}</p>
            <p>E-mail: {this.props.searchContacts[this.props.currentCard].email}</p>
            <p>Phone number: {this.props.searchContacts[this.props.currentCard].number}</p>
            <p>Address: {this.props.searchContacts[this.props.currentCard].address}</p>
            <p>City: {this.props.searchContacts[this.props.currentCard].city}</p>
            <p>props: {this.props.searchContacts[this.props.currentCard].props}</p>
            <p>Zip: {this.props.searchContacts[this.props.currentCard].zip}</p>
            </div>
        );
    }
}

//delete current card button
class DeleteButton extends React.Component {
    constructor (props) {
        super (props);
    }
    
    deletePerson = () => {
        let i = this.props.currentCard;
        let deletedSearchContacts = Object.assign([], this.props.searchContacts);
        let deletedId = deletedSearchContacts.splice(i, 1)[0]['id'];
        let deletedContacts = this.props.contacts.slice().filter(contact => contact.id !== deletedId);
        this.props.deletePerson(deletedContacts);
    }
    
    render() {
        return <button onClick={()=>this.deletePerson()}>Delete</button>;
    }
}

//edit current card button
class EditButton extends React.Component {
    constructor (props) {
        super (props);
    }
    
    //edit current card
    editPerson = () => {
        let previousContacts = JSON.stringify(this.props.searchContacts);
        this.props.editPerson(previousContacts);
    }
    
    render() {
        return <button onClick={()=>this.editPerson()}>Edit</button>;
    }
}
// edit form
class EditForm extends React.Component {
    constructor (props) {
        super (props);
    }
    // submit button for update
    updateSubmit = e => {
        e.preventDefault();
        this.props.updateSubmit();
    }

    // update contact
    updateItem = event => {
        let item = event.target.name;
        let updateContacts = this.props.contacts.slice();
        let index = this.props.currentCard;
        updateContacts[index][item] = event.target.value;
        this.props.updateItem(updateContacts);
    }

    // cancel submit
    cancelEdit = () => {
        let previousContacts = JSON.parse(this.props.precontacts);
        this.props.cancelEdit(previousContacts);
    }
    render() {
        return (
            <form onSubmit={this.updateSubmit}>
            <label>Name: </label><input type="text" name="name" value={this.props.searchContacts[this.props.currentCard].name} onChange={this.updateItem}/>
            <label>E-mail: </label><input type="email" name="email" value={this.props.searchContacts[this.props.currentCard].email} onChange={this.updateItem}/>
            <label>Phone number: </label><input type="text" name="number" value={this.props.searchContacts[this.props.currentCard].number} onChange={this.updateItem}/>
            <label>Address: </label><input type="text" name="address" value={this.props.searchContacts[this.props.currentCard].address} onChange={this.updateItem}/>
            <label>City: </label><input type="text" name="city" value={this.props.searchContacts[this.props.currentCard].city} onChange={this.updateItem}/>
            <label>State: </label><input type="text" name="props" value={this.props.searchContacts[this.props.currentCard].props} onChange={this.updateItem}/>
            <label>Zip: </label><input type="text" name="zip" value={this.props.searchContacts[this.props.currentCard].zip} onChange={this.updateItem}/>
            <button onClick={()=>this.cancelEdit()}>Cancel</button>
            <button type="submit">Submit</button>
            </form>
        );
    }
}

//new form
class NewForm extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            newPerson : props.newPerson,
            newPersonCopy : props.newPersonCopy,
            givenId : props.givenId,
            contacts : props.contacts,
            searchContacts : props.searchContacts
        };
    }

    // new contact input item
    newItem = e => {
        let newContact = Object.assign({}, this.state.newPerson);
        let item = e.target.name;
        newContact[item] = e.target.value;
        this.props.newItem(newContact);
        this.setState({
            newPerson: newContact
        });
    }

    // cancel adding new contact
    cancelNew = () => {
        let cancelNewPerson = Object.assign({}, this.state.newPersonCopy);
        
        this.props.cancelNew(cancelNewPerson);
        this.setState({
            newPerson: cancelNewPerson
        });
    }

    // submit new contact
    updateNew = e => {
        e.preventDefault();
        let newContact = Object.assign({}, this.state.newPerson);
        newContact['id'] = this.state.givenId;
        let contactsCopy = this.state.contacts.slice();
        contactsCopy.push(newContact);
        contactsCopy = sortContacts(contactsCopy);
        let idCopy = this.state.givenId + 1;
        this.props.updateNew(contactsCopy, idCopy);
        this.setState({
            contacts: contactsCopy.slice(),
            newPerson: Object.assign({}, this.props.newPersonCopy),
            givenId: idCopy,
            searchContacts: contactsCopy.slice(),
        });
    }

    render() {
        console.log("added");
        console.log("newperson", this.state.newPerson);
        return (
            <form onSubmit={this.updateNew}>
                <label>Name: </label><input type="text" name="name" onChange={this.newItem}/>
                <label>E-mail: </label><input type="email" name="email" onChange={this.newItem}/>
                <label>Phone number: </label><input type="text" name="number" onChange={this.newItem}/>
                <label>Address: </label><input type="text" name="address" onChange={this.newItem}/>
                <label>City: </label><input type="text" name="city" onChange={this.newItem}/>
                <label>State: </label><input type="text" name="state" onChange={this.newItem}/>
                <label>Zip: </label><input type="text" name="zip" onChange={this.newItem}/>
                <Link to="/"><button onClick={()=>this.cancelNew()}>Cancel</button></Link>
                <button type="submit">Submit</button>
                </form>
        );
    }
}

// class App
class App extends React.Component {
    constructor(props) {
        super(props);
        const newPerson = {
            name: '',
            email: '',
            number: '',
            address: '',
            city: '',
            state: '',
            zip: '',
            id: null,
            fav: false
        };
        this.state = {
            contacts: sortContacts(preList['contacts']).slice(),
            precontacts: null,
            currentCard: 0,
            edit: false,
            isFaved: false,
            addNew : false,
            searchContacts: sortContacts(preList['contacts']).slice(),
            givenId: preList['givenId'],
            newPerson: Object.assign({}, newPerson),
            newPersonCopy: Object.assign({}, newPerson),
        };
    }
    
    searchedContacts = results => {
        this.setState ({
            searchContacts : results
        });
    }
    
    showFavs = () => {
        this.setState ({
           isFaved : !this.state.isFaved 
        });    
    }
    
    addNew = () => {
        this.setState ({
           addNew : true 
        });
    }
    
    checkPerson = i => {
        this.setState ({
            currentCard : i
        });    
    }
    
    favorite = searchContactsCopy => {
        this.setState({
            searchContacts: searchContactsCopy
        });
    }
    
    deletePerson = deletedContacts => {
        this.setState({
            contacts: deletedContacts.slice(),
            searchContacts: deletedContacts.slice(),
            currentCard: 0
        }, function() {
            let localSave = JSON.stringify({ contacts: this.state.contacts, givenId: this.state.givenId });
            localStorage.setItem('localContacts', localSave);
        });
    }
    
    editPerson = previousContacts => {
        this.setState({
            precontacts: previousContacts,
            edit: true
        });
    }
    
    updateSubmit = () => {
        this.setState({
            precontacts: null,
            edit: false
        }, function() {
            let localSave = JSON.stringify({ contacts: this.state.contacts, givenId: this.state.givenId });
            localStorage.setItem('localContacts', localSave);
        });
    }
    
    updateItem = updateContacts => {
        this.setState({
            contacts: updateContacts.slice(),
            searchContacts: updateContacts.slice()
        });
    }
    
    cancelEdit = previousContacts => {
        this.setState({
            contacts: previousContacts.slice(),
            searchContacts: previousContacts.slice(),
            precontacts: null,
            edit: false,
        });
    }
    
    newItem = newContact => {
        this.setState({
            newPerson: newContact
        });
    }
    
    cancelNew = cancelNewPerson => {
        this.setState({
            addNew: false,
            newPerson: cancelNewPerson
        });
    }
    
    updateNew = (contactsCopy, idCopy) => {
        this.setState({
            contacts: contactsCopy.slice(),
            searchContacts: contactsCopy.slice(),
            addNew: false,
            newPerson: Object.assign({}, this.props.newPersonCopy),
            givenId: idCopy,
        }, function() {
            let localSave = JSON.stringify({ contacts: this.state.contacts, givenId: this.state.givenId });
            localStorage.setItem('localContacts', localSave);
        });
    }
    
    render () {
        console.log(this.state.searchContacts);
        console.log(this.state.contacts);
        return <div />;
    }
    // render() {
    //     console.log(this.state.searchContacts);
    //     return (
    //         <div >
    //         <Header />
    //         <SidePanel contacts={this.state.contacts}
    //         searchContacts={this.state.searchContacts}
    //         isFaved={this.state.isFaved}
    //         addNew={this.state.addNew}/>
    //         </div>
    //         // {this.state.searchContacts.length > 0 ?
    //         // (<div>{this.SimpleContacts()}
    //         // {this.state.addNew ? this.NewForm() : (this.state.edit ? this.EditForm() : this.IndividualCard())}
    //         // </div> )
    //         // : <div /> }
    //         // </div>
    //     );
}


ReactDOM.render(<App ref={(App) => {window.App = App}} />, document.getElementById("root"));

const Main = () => (
    <div>
    <Header />
    <SidePanel contacts={window.App.state.contacts} searchedContacts={window.App.searchedContacts} showFavs={window.App.showFavs} addNew={window.App.addNew} currentCard={window.App.state.currentCard} checkPerson={window.App.checkPerson} searchContacts={window.App.state.searchContacts} favorite={window.App.favorite} isFaved={window.App.state.isFaved} />
    <div>
    <IndividualCard searchContacts={window.App.state.searchContacts} currentCard={window.App.state.currentCard}/>
    </div>
    </div>
    );

const NewContact = () => (
    <NewForm searchContacts={window.App.state.searchContacts} newPerson={window.App.state.newPerson} newItem={window.App.newItem} updateNew={window.App.updateNew}
    cancelNew={window.App.cancelNew} newPersonCopy={window.App.state.newPersonCopy} contacts={window.App.state.contacts}
    givenId={window.App.state.givenId}/>
    );




ReactDOM.render((<BrowserRouter>
  <div>
    <ul>
      <li><Link to="/">Home</Link></li>
      <li><Link to="/form">Form</Link></li>
    </ul>
    <Route exact path="/" component={Main}/>
    <Route path="/form" component={NewContact}/>
  </div>
</BrowserRouter>), document.getElementById("app"));