import React from 'react';
import ReactDOM from 'react-dom';
import 'font-awesome/css/font-awesome.min.css';
import { BrowserRouter, Route, Link, Switch, Redirect } from 'react-router-dom';
import './index.css';

// preSet contacts
var preList = localStorage.getItem('localContacts') ?
    JSON.parse(localStorage.getItem('localContacts')) : {
        contacts: [{
            fname: 'Jaime',
            lname: "Lannister",
            email: 'SirJaime@kingsguard.com',
            number: '900-900-1234',
            address: 'Suite 1, Red Keep',
            city: "King's Lading",
            state: 'TX',
            zip: '77330',
            id: 1,
            fav: false
        }, {
            fname: 'Jon',
            lname: "Snow",
            email: 'JonSnow@nightwatch.org',
            number: '300-112-0708',
            address: "Commander's office, The Wall",
            city: 'The Wall',
            state: 'TX',
            zip: '77325',
            id: 2,
            fav: false
        }, {
            fname: 'Daenerys',
            lname: 'Targaryen',
            email: 'TrueQueen@sevenkingdom.gov',
            number: '100-100-0001',
            address: 'The Throne',
            city: 'Meereen',
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
        if (a.fname < b.fname) {
            return -1;
        }
        else if (a.fname > b.fname) {
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
            contacts: props.contacts,
            currentCard: props.currentCard,
            searchContacts: props.searchContacts,
            isFaved: props.isFaved,
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
            searchContacts: results,
        });
        this.props.searchedContacts(results);
    }

    // show favs only
    showFavs = () => {
        this.setState({
            isFaved: !this.state.isFaved
        });
        this.props.showFavs();
    }

    //check individual namecard    
    checkPerson = i => {
        this.setState({
            currentCard: i
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
        console.log(simpleCards);
        const slug = this.state.searchContacts.length > 0 ? this.state.searchContacts[this.state.currentCard].id : null;
        return (
            <div className="major">
            <div className="search-panel">
            <input type="text" onChange={this.searchedContacts} placeholder="Search contacts"/>
            <button className={this.state.isFaved ? ("btns faved"):("btns")} onClick={()=>this.showFavs()}><b>Fav</b></button>
            </div>
            {simpleCards.length > 0 ?
            (<div className="info-panel"><div className="small-cards">{ simpleCards.map( (contact, index) => {
                    return (
                    <div className="small-card" key={contact.id}>
                    <p><i onClick={() => this.favorite(index)} className={contact.fav ? ("fa fa-heart fav") : ("fa fa-heart nofav")}></i><span onClick={() => this.checkPerson(index)}>{contact.fname}</span></p>
                    <p>{contact.city} {contact.state}</p>
                    </div>);
                })
                }</div>
            <div className="detail-back">
            <div className="detail-card">
            <div className="detail-card-info">
            <p><span>First name: </span><span>{this.state.searchContacts[this.state.currentCard].fname}</span></p>
            <p><span>Last name: </span><span>{this.state.searchContacts[this.state.currentCard].lname}</span></p>
            <p><span>E-mail: </span><span>{this.state.searchContacts[this.state.currentCard].email}</span></p>
            <p><span>Phone number: </span><span>{this.state.searchContacts[this.state.currentCard].number}</span></p>
            <p><span>Address: </span><span>{this.state.searchContacts[this.state.currentCard].address}</span></p>
            <p><span>City: </span><span>{this.state.searchContacts[this.state.currentCard].city}</span></p>
            <p><span>State: </span><span>{this.state.searchContacts[this.state.currentCard].state}</span></p>
            <p><span>Zip: </span><span>{this.state.searchContacts[this.state.currentCard].zip}</span></p>
            </div>
            <div className="button-panel">
            <Link to={`/delete/:${slug}`}><button className="btn-detail btn-detail-delete"><b>Delete</b></button></Link>
            <Link to={`/edit/:${slug}`}><button className="btn-detail btn-detail-edit" onClick={()=>this.props.editPerson()}><b>Edit</b></button></Link>
            </div>
            </div>
            </div>
            </div>
            )
            : <h5 className="message">No result found</h5>
            }
            </div>
        );
    }
}

// edit form
class EditForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentCard: props.currentCard,
            contacts: props.contacts
        };
    }

    // update contact
    updateItem = event => {
        let item = event.target.name;
        let updateContacts = this.state.contacts.slice();
        let index = this.state.currentCard;
        updateContacts[index][item] = event.target.value;
        this.setState({
            contacts: updateContacts.slice(),
        });
        this.props.updateItem(updateContacts);
    }

    render() {
        return (
            <div className="new-form-back">
            <div>
            <form className="new-form">
            <div><label>First name: </label><input type="text" name="fname" value={this.state.contacts[this.state.currentCard].fname} onChange={this.updateItem}/></div>
            <div><label>Last name: </label><input type="text" name="lname" value={this.state.contacts[this.state.currentCard].lname} onChange={this.updateItem}/></div>
            <div><label>E-mail: </label><input type="email" name="email" value={this.state.contacts[this.state.currentCard].email} onChange={this.updateItem}/></div>
            <div><label>Phone number: </label><input type="text" name="number" value={this.state.contacts[this.state.currentCard].number} onChange={this.updateItem}/></div>
            <div><label>Address: </label><input type="text" name="address" value={this.state.contacts[this.state.currentCard].address} onChange={this.updateItem}/></div>
            <div><label>City: </label><input type="text" name="city" value={this.state.contacts[this.state.currentCard].city} onChange={this.updateItem}/></div>
            <div><label>State: </label><input type="text" name="state" value={this.state.contacts[this.state.currentCard].state} onChange={this.updateItem}/></div>
            <div><label>Zip: </label><input type="text" name="zip" value={this.state.contacts[this.state.currentCard].zip} onChange={this.updateItem}/></div>
            </form>
            <div className="button-panel new-form-btns">
            <Link to="/"><button className="btn-detail btn-detail-delete" onClick={()=>this.props.cancelEdit()}><b>Cancel</b></button></Link>
            <Link to="/"><button className="btn-detail btn-detail-edit" onClick={()=>this.props.updateSubmit()}><b>Submit</b></button></Link>
            </div>
                </div>
                </div>
        );
    }
}

//new form
class NewForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            newPerson: props.newPerson,
            newPersonCopy: props.newPersonCopy,
            givenId: props.givenId,
            contacts: props.contacts,
            searchContacts: props.searchContacts
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
    updateNew = () => {
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
        return (
            <div className="new-form-back">
            <div>
            <form className="new-form">
                <div><label>First name: </label><input type="text" name="fname" onChange={this.newItem}/></div>
                <div><label>Last name: </label><input type="text" name="lname" onChange={this.newItem}/></div>
                <div><label>E-mail: </label><input type="email" name="email" onChange={this.newItem}/></div>
                <div><label>Phone number: </label><input type="text" name="number" onChange={this.newItem}/></div>
                <div><label>Address: </label><input type="text" name="address" onChange={this.newItem}/></div>
                <div><label>City: </label><input type="text" name="city" onChange={this.newItem}/></div>
                <div><label>State: </label><input type="text" name="state" onChange={this.newItem}/></div>
                <div><label>Zip: </label><input type="text" name="zip" onChange={this.newItem}/></div>
                </form>
                <div className="button-panel new-form-btns">
                <Link to="/"><button className="btn-detail btn-detail-delete" onClick={()=>this.cancelNew()}><b>Cancel</b></button></Link>
                <Link to="/added"><button className="btn-detail btn-detail-edit" onClick={()=>this.updateNew()}><b>Submit</b></button></Link>
                </div>
                </div>
                </div>
        );
    }
}

// class App
class App extends React.Component {
    constructor(props) {
        super(props);
        const newPerson = {
            fname: '',
            lname: '',
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
            isFaved: false,
            searchContacts: sortContacts(preList['contacts']).slice(),
            givenId: preList['givenId'],
            newPerson: Object.assign({}, newPerson),
            newPersonCopy: Object.assign({}, newPerson),
        };
    }

    searchedContacts = results => {
        this.setState({
            searchContacts: results
        });
    }

    showFavs = () => {
        this.setState({
            isFaved: !this.state.isFaved
        });
    }

    checkPerson = i => {
        this.setState({
            currentCard: i
        }, () => {
            console.log("current id", this.state.currentCard);
        });

    }

    favorite = searchContactsCopy => {
        this.setState({
            searchContacts: searchContactsCopy
        }, function() {
            let localSave = JSON.stringify({ contacts: this.state.contacts, givenId: this.state.givenId });
            localStorage.setItem('localContacts', localSave);
        });
    }

    deletePerson = () => {
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
    editPerson = () => {
        let previousContacts = JSON.stringify(this.state.searchContacts);
        this.setState({
            precontacts: previousContacts,
        });
    }

    updateSubmit = () => {
        this.setState({
            precontacts: null,

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

    cancelEdit = () => {
        let previousContacts = JSON.parse(this.state.precontacts);
        this.setState({
            contacts: previousContacts.slice(),
            searchContacts: previousContacts.slice(),
            precontacts: null,
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

    render() {
        return <div />;
    }
}

ReactDOM.render(<App ref={(App) => {window.App = App}} />, document.getElementById("root"));

class Message extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false
        };
    }

    componentDidMount() {
        this.delay = setInterval(() => {
            this.setState({
                redirect: true
            });
        }, 3000);
    }

    componentWillUnmount() {
        clearInterval(this.delay);
    }

    render() {
        return (
            this.state.redirect ? <Redirect to="/" /> : <div className="message-info"><p>{this.props.message}</p><h5>This page will be redirected in 3 seconds</h5></div>
        );
    }
}

const MessageNew = () => (<Message message="New contact successfully added" />);

const MessageDelete = () => (<Message message="Contact successfully deleted" />);

const Main = () => (
    <div className="major">
    <SidePanel contacts={window.App.state.contacts} searchedContacts={window.App.searchedContacts} showFavs={window.App.showFavs} addNew={window.App.addNew} currentCard={window.App.state.currentCard} checkPerson={window.App.checkPerson} searchContacts={window.App.state.searchContacts} favorite={window.App.favorite} isFaved={window.App.state.isFaved} editPerson={window.App.editPerson}/>
    </div>
);

const NewContact = () => (
    <NewForm searchContacts={window.App.state.searchContacts} newPerson={window.App.state.newPerson} newItem={window.App.newItem} updateNew={window.App.updateNew}
    cancelNew={window.App.cancelNew} newPersonCopy={window.App.state.newPersonCopy} contacts={window.App.state.contacts}
    givenId={window.App.state.givenId}/>
);

const Delete = () => (<div className="message-info">
<p>Are you sure to delete this person?</p>
<div className="button-panel new-form-btns">
<Link to="/deletemessage"><button className="btn-detail btn-detail-delete" onClick={()=>window.App.deletePerson()}><b>Yes</b></button></Link>
<Link to="/"><button className="btn-detail btn-detail-edit"><b>No</b></button></Link>
</div>
</div>);

const Edit = () => (
    <EditForm contacts={window.App.state.contacts} currentCard={window.App.state.currentCard} updateItem={window.App.updateItem} cancelEdit={window.App.cancelEdit} updateSubmit={window.App.updateSubmit}/>
);

ReactDOM.render((<BrowserRouter>
  <div className="major">
    <Header />
    <ul className="control-panel">
      <li><Link to="/">Home</Link></li>
      <li><Link to="/new">Add New</Link></li>
    </ul>
    <Route exact path="/" component={Main}/>
    <Route path="/new" component={NewContact}/>
    <Route path="/added" component={MessageNew} />
    <Route path="/delete/:id" component={Delete} />
    <Route path="/edit/:id" component={Edit} />
    <Route path="/deletemessage" component={MessageDelete} />
  </div>
</BrowserRouter>), document.getElementById("app"));