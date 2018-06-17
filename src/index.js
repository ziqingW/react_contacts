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
function SidePanel (props) {
    return (
        <div>
        <input type="text" onChange={props.searchContacts}/>
        <button onClick={()=>props.showFavs()}>fav</button>
        <button onClick={()=>props.addNew()}>New</button>
        </div>
    );
}

// simple contacts
function SimpleContacts (props) {
    return (
        <div>{ props.simpleCards.map( (contact, index) => {
                return (
                <div key={contact.name}>
                <p onClick={() => props.checkPerson(index)}>{contact.name}</p><i onClick={() => props.favorite(index)} className="fa fa-heart"></i>
                <p>{contact.city} {contact.state}</p>
                </div>);
            })
            }</div>);
}

// individual name card
function IndividualCard (props) {
    return (
    <div>
    <p>Name: {props.searchContacts[props.currentCard].name}</p>
    <p>E-mail: {props.searchContacts[props.currentCard].email}</p>
    <p>Phone number: {props.searchContacts[props.currentCard].number}</p>
    <p>Address: {props.searchContacts[props.currentCard].address}</p>
    <p>City: {props.searchContacts[props.currentCard].city}</p>
    <p>State: {props.searchContacts[props.currentCard].state}</p>
    <p>Zip: {props.searchContacts[props.currentCard].zip}</p>
    <button onClick={()=>props.deletePerson()}>Delete</button>
    <button onClick={()=>props.editPerson()}>Edit</button>
    </div>
    );
}

// edit form
function EditForm (props) {
    return (
        <form onSubmit={props.updateSubmit}>
            <label>Name: </label><input type="text" name="name" value={props.searchContacts[props.currentCard].name} onChange={props.updateItem}/>
            <label>E-mail: </label><input type="email" name="email" value={props.searchContacts[props.currentCard].email} onChange={props.updateItem}/>
            <label>Phone number: </label><input type="text" name="number" value={props.searchContacts[props.currentCard].number} onChange={props.updateItem}/>
            <label>Address: </label><input type="text" name="address" value={props.searchContacts[props.currentCard].address} onChange={props.updateItem}/>
            <label>City: </label><input type="text" name="city" value={props.searchContacts[props.currentCard].city} onChange={props.updateItem}/>
            <label>State: </label><input type="text" name="state" value={props.searchContacts[props.currentCard].state} onChange={props.updateItem}/>
            <label>Zip: </label><input type="text" name="zip" value={props.searchContacts[props.currentCard].zip} onChange={props.updateItem}/>
            <button onClick={()=>props.cancelEdit()}>Cancel</button>
            <button type="submit">Submit</button>
            </form>
        );
}

//new form
function NewForm (props) {
    return  (
        <form onSubmit={props.updateNew}>
            <label>Name: </label><input type="text" name="name" onChange={props.newItem}/>
            <label>E-mail: </label><input type="email" name="email" onChange={props.newItem}/>
            <label>Phone number: </label><input type="text" name="number" onChange={props.newItem}/>
            <label>Address: </label><input type="text" name="address" onChange={props.newItem}/>
            <label>City: </label><input type="text" name="city" onChange={props.newItem}/>
            <label>State: </label><input type="text" name="state" onChange={props.newItem}/>
            <label>Zip: </label><input type="text" name="zip" onChange={props.newItem}/>
            <button onClick={()=>props.cancelNew()}>Cancel</button>
            <button type="submit">Submit</button>
            </form>
        );
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
    
    // search contacts   
    searchContacts(e) {
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
            searchContacts: results
        });
    }
    
    // show favs only
    showFavs() {
        this.setState({
            isFaved: !this.state.isFaved
        });
    }
    
    //add new button
    addNew() {
        this.setState({
            addNew: true
        });
    }
    
    //check individual namecard    
    checkPerson(i) {
        this.setState({
            currentCard: i
        });
    }
    
    // favorite person
    favorite(i) {
        let searchContactsCopy = this.state.searchContacts.slice();
        searchContactsCopy[i].fav = !searchContactsCopy[i].fav;
        this.setState({
            searchContacts: searchContactsCopy
        });
    }  
    
    //delete current card    
    deletePerson() {
        let i = this.state.currentCard;
        let deletedSearchContacts = Object.assign([], this.state.searchContacts);
        let deletedId = deletedSearchContacts.splice(i, 1)[0]['id'];
        let deletedContacts = this.state.contacts.slice().filter(contact => contact.id !== deletedId);
        this.setState({
            contacts: deletedContacts.slice(),
            searchContacts: deletedContacts.slice(),
            currentCard: 0
        }, function() {
            let localSave = JSON.stringify({ contacts: this.state.contacts, givenId: this.state.givenId });
            localStorage.setItem('localContacts', localSave);
        });
    }    

    //edit current card
    editPerson() {
        let previousContacts = JSON.stringify(this.state.searchContacts);
        this.setState({
            precontacts: previousContacts,
            edit: true
        });
    }

    // submit button for update
    updateSubmit(e) {
        e.preventDefault();
        this.setState({
            precontacts: null,
            edit: false
        }, function() {
            let localSave = JSON.stringify({ contacts: this.state.contacts, givenId: this.state.givenId });
            localStorage.setItem('localContacts', localSave);
        });
    }
    
    // update contact
    updateItem(event) {
        let item = event.target.name;
        let updateContacts = this.state.contacts.slice();
        let index = this.state.currentCard;
        updateContacts[index][item] = event.target.value;
        this.setState({
            contacts: updateContacts.slice(),
            searchContacts: updateContacts.slice()
        });
    }

    // cancel submit
    cancelEdit() {
        let previousContacts = JSON.parse(this.state.precontacts);
        this.setState({
            contacts: previousContacts.slice(),
            searchContacts: previousContacts.slice(),
            precontacts: null,
            edit: false,
        });
    }

    // new contact input item
    newItem(e) {
        let newContact = Object.assign({}, this.state.newPerson);
        let item = e.target.name;
        newContact[item] = e.target.value;
        this.setState({
            newPerson: newContact
        });
    }

    // cancel adding new contact
    cancelNew() {
        let cancelNewPerson = Object.assign({}, this.state.newPersonCopy);
        this.setState({
            addNew: false,
            newPerson: cancelNewPerson
        });
    }

    // submit new contact
    updateNew(e) {
        e.preventDefault();
        let newContact = Object.assign({}, this.state.newPerson);
        newContact['id'] = this.state.givenId;
        let contactsCopy = this.state.contacts.slice();
        contactsCopy.push(newContact);
        contactsCopy = this.sortContacts(contactsCopy);
        let idCopy = this.state.givenId + 1;
        this.setState({
            contacts: contactsCopy,
            searchContacts: contactsCopy,
            addNew: false,
            newPerson: Object.assign({}, this.state.newPersonCopy),
            givenId: idCopy,
        }, function() {
            let localSave = JSON.stringify({ contacts: this.state.contacts, givenId: this.state.givenId });
            localStorage.setItem('localContacts', localSave);
        });
    }
    
    render() {
        let simpleCards = [];
        if (this.state.isFaved) {
            simpleCards = this.state.searchContacts.filter(contact => {
                return contact.fav;
            });
        }
        else {
            simpleCards = this.state.searchContacts.slice();
        }
        console.log(this.state.searchContacts);
        return (
            <div >
            <Header />
            <SidePanel searchContacts={this.searchContacts} showFavs={this.showFavs} addNew={this.addNew}/>
            {this.state.searchContacts.length > 0 ?
            (<div>
            <SimpleContacts simpleCards={simpleCards} checkPerson={this.checkPerson} favorite={this.favorite} />
            {this.state.addNew ? <NewForm updateNew={this.updateNew} newItem={this.newItem} cancelNew={this.cancelNew} /> : 
            (this.state.edit ? <EditForm updateSubmit={this.updateSubmit} searchContacts={this.state.searchContacts} currentCard={this.state.currentCard} updateItem={this.updateItem} cancelEdit={this.cancelEdit}/> : <IndividualCard searchContacts={this.state.searchContacts} currentCard={this.state.currentCard} deletePerson={this.deletePerson} editPerson={this.editPerson}/>)
            }
            </div> )
            : <div /> }
            </div>
        );
    }
}

ReactDOM.render((
    <BrowserRouter>
    <div>
    <Route exact path="/" component={App}/>
    <Route path="/add" component={NewForm}/>
    </div>
    </BrowserRouter>), document.getElementById('root'));
