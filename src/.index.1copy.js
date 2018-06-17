import React from 'react';
import ReactDOM from 'react-dom';
import 'font-awesome/css/font-awesome.min.css';
import {BrowserRouter, Route, Link, Switch} from 'react-router-dom';

// preSet contacts
var preList = localStorage.getItem('localContacts') ? 
JSON.parse(localStorage.getItem('localContacts')) : 
{contacts: [{
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
            givenId: 4};
            
// class App
class App extends React.Component {
    constructor (props) {
        super(props);
        
        this.state = {
            contacts : this.sortContacts(preList['contacts']).slice(),
            precontacts: null,
            currentCard : 0,
            edit : false,
            isFaved: false,
            serachContacts: this.sortContacts(preList['contacts']).slice(),
            
            
        };
        this.checkPerson = this.checkPerson.bind(this);
        this.deletePerson = this.deletePerson.bind(this);
        this.editPerson = this.editPerson.bind(this);
        this.updateSubmit = this.updateSubmit.bind(this);
        this.updateItem = this.updateItem.bind(this);
        this.cancelEdit = this.cancelEdit.bind(this);
        this.searchContacts = this.searchContacts.bind(this);
        this.newItem = this.newItem.bind(this);
        this.updateNew = this.updateNew.bind(this);
        this.cancelNew = this.cancelNew.bind(this);
    }
    
    // header
    Header () {
        return (
            <div>
            <h1>My Contacts</h1>
            </div>
            );
    }
    
    // favorite toggle panel
    SidePanel () {
        return (
            <div>
            <input type="text" onChange={this.searchContacts}/>
            <button onClick={()=>this.showFavs()}>fav</button>
            <button onClick={()=>this.addNew()}>New</button>
            </div>
            );
    }
    // simple contacts
    SimpleContacts () {
        let simpleCards = [];
        if (this.state.isFaved) {
            simpleCards = this.state.serachContacts.filter( contact => {
                return contact.fav;
            });
        } else {
            simpleCards = this.state.serachContacts.slice();
        }
        return (
            <div>{ simpleCards.map( (contact, index) => {
                return (
                <div key={contact.name}>
                <p onClick={() => this.checkPerson(index)}>{contact.name}</p><i onClick={() => this.favorite(index)} className="fa fa-heart"></i>
                <p>{contact.city} {contact.state}</p>
                </div>);
            })
            }</div>);
    }
    // individual name card
    IndividualCard () {
    return (
            <div>
            <p>Name: {this.state.serachContacts[this.state.currentCard].name}</p>
            <p>E-mail: {this.state.serachContacts[this.state.currentCard].email}</p>
            <p>Phone number: {this.state.serachContacts[this.state.currentCard].number}</p>
            <p>Address: {this.state.serachContacts[this.state.currentCard].address}</p>
            <p>City: {this.state.serachContacts[this.state.currentCard].city}</p>
            <p>State: {this.state.serachContacts[this.state.currentCard].state}</p>
            <p>Zip: {this.state.serachContacts[this.state.currentCard].zip}</p>
            <button onClick={()=>this.deletePerson()}>Delete</button>
            <button onClick={()=>this.editPerson()}>Edit</button>
            </div>
            );
}

    // edit form
    EditForm () {
    return (
            <form onSubmit={this.updateSubmit}>
            <label>Name: </label><input type="text" name="name" value={this.state.serachContacts[this.state.currentCard].name} onChange={this.updateItem}/>
            <label>E-mail: </label><input type="email" name="email" value={this.state.serachContacts[this.state.currentCard].email} onChange={this.updateItem}/>
            <label>Phone number: </label><input type="text" name="number" value={this.state.serachContacts[this.state.currentCard].number} onChange={this.updateItem}/>
            <label>Address: </label><input type="text" name="address" value={this.state.serachContacts[this.state.currentCard].address} onChange={this.updateItem}/>
            <label>City: </label><input type="text" name="city" value={this.state.serachContacts[this.state.currentCard].city} onChange={this.updateItem}/>
            <label>State: </label><input type="text" name="state" value={this.state.serachContacts[this.state.currentCard].state} onChange={this.updateItem}/>
            <label>Zip: </label><input type="text" name="zip" value={this.state.serachContacts[this.state.currentCard].zip} onChange={this.updateItem}/>
            <button onClick={()=>this.cancelEdit()}>Cancel</button>
            <button type="submit">Submit</button>
            </form>
            );
    }
    
    //add new button
    addNew () {
        this.setState({
            addNew: true
        });
    }
    
    
    
    
    // sorting contacts by name    
    sortContacts (names) {
        names = names.sort((a,b)=> {
            if (a.name < b.name) {
                return -1;
            } else if (a.name > b.name) {
                return 1;
            } else {
                return 0;
            }
        }); 
        return names;
    }
    
    //check individual namecard    
    checkPerson(i) {
        this.setState({
            currentCard: i
        });
    }
    
    // favorite person
    favorite(i) {
        let searchContactsCopy = this.state.serachContacts.slice();
        searchContactsCopy[i].fav = !searchContactsCopy[i].fav;
        this.setState({
            serachContacts: searchContactsCopy
        });
    }
    
    // search contacts
    searchContacts (e) {
        const regex = new RegExp(e.target.value, 'i');
        let results = this.state.contacts.filter(contact => {
            let contactItems = Object.values(contact);
            for (let index in contactItems) {
                if (regex.test(contactItems[index])){
                    return true;
                }
            }
            return false;
            });
        this.setState({
            serachContacts: results
        });
    }
    // show favs only
    showFavs () {
        this.setState({
            isFaved : !this.state.isFaved
        });
    }
    //delete current card    
    deletePerson() {
        let i = this.state.currentCard;
        let deletedSearchContacts = Object.assign([],this.state.serachContacts);
        let deletedId = deletedSearchContacts.splice(i, 1)[0]['id'];
        let deletedContacts = this.state.contacts.slice().filter( contact => contact.id !== deletedId);
        this.setState({
            contacts: deletedContacts.slice(),
            serachContacts: deletedContacts.slice(),
            currentCard: 0
        }, function(){
            let localSave = JSON.stringify({contacts: this.state.contacts, givenId: this.state.givenId});
            localStorage.setItem('localContacts', localSave);
        });
    }
    
    //edit current card
    editPerson() {
        let previousContacts = JSON.stringify(this.state.serachContacts);
        this.setState({
            precontacts: previousContacts,
            edit: true
        });
    }
    
    // submit button for update
    updateSubmit (e) {
        e.preventDefault();
        this.setState({
            precontacts: null,
            edit: false
        }, function(){
            let localSave = JSON.stringify({contacts: this.state.contacts, givenId: this.state.givenId});
            localStorage.setItem('localContacts', localSave);
        });
    }

    // update contact
    updateItem (event) {
        let item = event.target.name;
        let updateContacts = this.state.contacts.slice();
        let index = this.state.currentCard;
        updateContacts[index][item] = event.target.value;
        this.setState({
            contacts : updateContacts.slice(),
            serachContacts : updateContacts.slice()
        });
    }
        
    // cancel submit
    cancelEdit() {
        let previousContacts = JSON.parse(this.state.precontacts);
        this.setState({
            contacts: previousContacts.slice(),
            serachContacts : previousContacts.slice(),
            precontacts: null,
            edit: false,
        });
    }
    
    render() {
        console.log(preList);
        return (
            <div >
            {this.Header()}
            {this.SidePanel()}
            {this.state.serachContacts.length > 0 ?
            (<div>{this.SimpleContacts()}
            {this.state.addNew ? this.NewForm() : (this.state.edit ? this.EditForm() : this.IndividualCard())}
            </div> )
            : <div /> }
            </div>
        );
    }
}

//new form
class NewForm extends React.Component {
    constructor (props) {
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
            newPerson: Object.assign({}, newPerson),
            newPersonCopy: Object.assign({}, newPerson),
            givenId: preList['givenId'],
            addNew: false,
        };
    }
    
    // new contact input item
    newItem (e) {
        let newContact = Object.assign({}, this.state.newPerson);
        let item = e.target.name;
        newContact[item] = e.target.value;
        this.setState({
            newPerson : newContact
        });
    }
    
    // cancel adding new contact
    cancelNew () {
        let cancelNewPerson = Object.assign({}, this.state.newPersonCopy);
        this.setState({
            addNew: false,
            newPerson: cancelNewPerson
        });
    }
    
    // submit new contact
    updateNew (e) {
        e.preventDefault();
        let newContact = Object.assign({}, this.state.newPerson);
        newContact['id'] = this.state.givenId;
        let contactsCopy = this.state.contacts.slice();
        contactsCopy.push(newContact);
        contactsCopy = this.sortContacts(contactsCopy);
        let idCopy = this.state.givenId + 1;
        this.setState({
            contacts : contactsCopy,
            serachContacts : contactsCopy,
            addNew : false,
            newPerson : Object.assign({}, this.state.newPersonCopy),
            givenId: idCopy,
        }, function(){
            let localSave = JSON.stringify({contacts: this.state.contacts, givenId: this.state.givenId});
            localStorage.setItem('localContacts', localSave);
        });
    }
    
    render() {
        return (
                <form onSubmit={this.updateNew}>
                <label>Name: </label><input type="text" name="name" onChange={this.newItem}/>
                <label>E-mail: </label><input type="email" name="email" onChange={this.newItem}/>
                <label>Phone number: </label><input type="text" name="number" onChange={this.newItem}/>
                <label>Address: </label><input type="text" name="address" onChange={this.newItem}/>
                <label>City: </label><input type="text" name="city" onChange={this.newItem}/>
                <label>State: </label><input type="text" name="state" onChange={this.newItem}/>
                <label>Zip: </label><input type="text" name="zip" onChange={this.newItem}/>
                <button onClick={()=>this.cancelNew()}>Cancel</button>
                <button type="submit">Submit</button>
                </form>
                );
    }
}


ReactDOM.render((
    <BrowserRouter>
    <Route exact path="/" component={App}/>
    <Route path="/add" component={NewForm}/>
    </BrowserRouter>)
    , document.getElementById('root'));