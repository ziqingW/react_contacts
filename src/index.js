import React from 'react';
import ReactDOM from 'react-dom';
import 'font-awesome/css/font-awesome.min.css';
import { BrowserRouter, Route, Link, Switch, Redirect} from 'react-router-dom';

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
        const slug = this.state.searchContacts.length>0 ? this.state.searchContacts[this.state.currentCard].id : null;
        return (
            simpleCards.length > 0 ?
            (<div>
            <div>
            <input type="text" onChange={this.searchedContacts}/>
            <button onClick={()=>this.showFavs()}>fav</button>
            </div>
            <div>{ simpleCards.map( (contact, index) => {
                    return (
                    <div key={contact.name}>
                    <p onClick={() => this.checkPerson(index)}>{contact.name}</p><i onClick={() => this.favorite(index)} className="fa fa-heart"></i>
                    <p>{contact.city} {contact.state}</p>
                    </div>);
                })
                }</div>
            <div>
            <p>Name: {this.state.searchContacts[this.state.currentCard].name}</p>
            <p>E-mail: {this.state.searchContacts[this.state.currentCard].email}</p>
            <p>Phone number: {this.state.searchContacts[this.state.currentCard].number}</p>
            <p>Address: {this.state.searchContacts[this.state.currentCard].address}</p>
            <p>City: {this.state.searchContacts[this.state.currentCard].city}</p>
            <p>props: {this.state.searchContacts[this.state.currentCard].props}</p>
            <p>Zip: {this.state.searchContacts[this.state.currentCard].zip}</p>
            <Link to={`/delete/:${slug}`}><button>Delete</button></Link>
            <Link to={`/edit/:${slug}`}><button onClick={()=>this.props.editPerson()}>Edit</button></Link>
            </div>
            </div>
            )
            : <div />
            );
    }
}

// edit form
class EditForm extends React.Component {
    constructor (props) {
        super (props);
        this.state = {
            currentCard : props.currentCard,
            contacts : props.contacts
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
            <form>
            <label>Name: </label><input type="text" name="name" value={this.state.contacts[this.state.currentCard].name} onChange={this.updateItem}/>
            <label>E-mail: </label><input type="email" name="email" value={this.state.contacts[this.state.currentCard].email} onChange={this.updateItem}/>
            <label>Phone number: </label><input type="text" name="number" value={this.state.contacts[this.state.currentCard].number} onChange={this.updateItem}/>
            <label>Address: </label><input type="text" name="address" value={this.state.contacts[this.state.currentCard].address} onChange={this.updateItem}/>
            <label>City: </label><input type="text" name="city" value={this.state.contacts[this.state.currentCard].city} onChange={this.updateItem}/>
            <label>State: </label><input type="text" name="props" value={this.state.contacts[this.state.currentCard].props} onChange={this.updateItem}/>
            <label>Zip: </label><input type="text" name="zip" value={this.state.contacts[this.state.currentCard].zip} onChange={this.updateItem}/>
            <Link to="/"><button onClick={()=>this.props.cancelEdit()}>Cancel</button></Link>
            <Link to="/"><button onClick={()=>this.props.updateSubmit()}>Submit</button></Link>
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
            <form>
                <label>Name: </label><input type="text" name="name" onChange={this.newItem}/>
                <label>E-mail: </label><input type="email" name="email" onChange={this.newItem}/>
                <label>Phone number: </label><input type="text" name="number" onChange={this.newItem}/>
                <label>Address: </label><input type="text" name="address" onChange={this.newItem}/>
                <label>City: </label><input type="text" name="city" onChange={this.newItem}/>
                <label>State: </label><input type="text" name="state" onChange={this.newItem}/>
                <label>Zip: </label><input type="text" name="zip" onChange={this.newItem}/>
                <Link to="/"><button onClick={()=>this.cancelNew()}>Cancel</button></Link>
                <Link to="/added"><button onClick={()=>this.updateNew()}>Submit</button></Link>
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
            isFaved: false,
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
    
    checkPerson = i => {
        this.setState ({
            currentCard : i
        }, () => {
           console.log("current id", this.state.currentCard); 
        });
        
    }
    
    favorite = searchContactsCopy => {
        this.setState({
            searchContacts: searchContactsCopy
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
    
    render () {
        return <div />;
    }
}


ReactDOM.render(<App ref={(App) => {window.App = App}} />, document.getElementById("root"));

class Message extends React.Component {
    constructor (props) {
        super (props);
        this.state = {
            redirect : false
        };
    }
    
    componentDidMount() {
        this.delay = setInterval(()=> {
            this.setState({
                redirect : true
            });
        }, 2000);
    }
    
    componentWillUnmount() {
       clearInterval(this.delay);
    }
    
    render () {
        return (
        this.state.redirect ? <Redirect to="/" /> : <div><h5>{this.props.message}</h5><h5>This page will be redirected in 2 sec</h5></div>
        );
    }
}

const MessageNew = () => (<Message message="New contact successfully added" />);

const MessageDelete = () => (<Message message="Contact successfully deleted" />);

const Main = () => (
    <div>
    <Header />
    <SidePanel contacts={window.App.state.contacts} searchedContacts={window.App.searchedContacts} showFavs={window.App.showFavs} addNew={window.App.addNew} currentCard={window.App.state.currentCard} checkPerson={window.App.checkPerson} searchContacts={window.App.state.searchContacts} favorite={window.App.favorite} isFaved={window.App.state.isFaved} editPerson={window.App.editPerson}/>
    </div>
    );

const NewContact = () => (
    <NewForm searchContacts={window.App.state.searchContacts} newPerson={window.App.state.newPerson} newItem={window.App.newItem} updateNew={window.App.updateNew}
    cancelNew={window.App.cancelNew} newPersonCopy={window.App.state.newPersonCopy} contacts={window.App.state.contacts}
    givenId={window.App.state.givenId}/>
    );

const Delete = () => (<div>
<h5>Are you sure to delete this person?</h5>
<Link to="/deletemessage"><button onClick={()=>window.App.deletePerson()}>Yes</button></Link>
<Link to="/"><button>No</button></Link>
</div>);

const Edit = () => (
    <EditForm contacts={window.App.state.contacts} currentCard={window.App.state.currentCard} updateItem={window.App.updateItem} cancelEdit={window.App.cancelEdit} updateSubmit={window.App.updateSubmit}/>
    );

ReactDOM.render((<BrowserRouter>
  <div>
    <ul>
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