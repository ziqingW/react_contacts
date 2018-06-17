import React from 'react';
import ReactDOM from 'react-dom';
// header
function Header () {
    return (
        <div>
        <h1>My Contacts</h1>
        </div>
        );
}

var previousContactsState = null;

class Namecard extends React.Component {
    constructor(props) {
        super(props);
        var preList = [{
            name: 'Ziqing',
            email: 'redtaq@hotmail.com',
            number: '8046878474',
            address: '3802 Paigewood Dr.',
            city: 'Pearland',
            state: 'TX',
            zip: '77584',
        }, {
            name: 'Jimmy',
            email: 'Jimmy@hotmail.com',
            number: '5723218526',
            address: '5509 Beachnut Blvd.',
            city: 'Houston',
            state: 'TX',
            zip: '77331',
        }, {
            name: 'Sam',
            email: 'Sam@aol.com',
            number: '2571416354',
            address: '2807 Main St.',
            city: 'Houston',
            state: 'TX',
            zip: '77110',
            }];
//sort the contacts by name            
        preList = preList.sort((a,b)=> {
            if (a.name < b.name) {
                return -1;
            } else if (a.name > b.name) {
                return 1;
            } else {
                return 0;
            }
        }); 
        // var copyContacts = Object.assign(preList);
        this.state = {
            contacts: preList,
            // contactsPrevious: null,
            showCard: 0,
            edit: false,
        };
        this.updateItem = this.updateItem.bind(this);
        this.updateSubmit = this.updateSubmit.bind(this);
    }
//check individual namecard    
    checkPerson(i) {
        this.setState({
            showCard: i,
        });
    }
//delete current card    
    deletePerson(i) {
        let deletedContacts = Object.assign(this.state.contacts);
        deletedContacts.splice(i, 1);
            this.setState({
                contacts: deletedContacts,
                showCard: 0,
        });
    }
//edit current card
    editPerson() {
        previousContactsState = Object.assign(this.state.contacts[this.state.showCard]);
        console.log("copyed!");
        this.setState({
            edit: true
        }, console.log(previousContactsState));
        
    }
    
    cancelEdit() {
        console.log("canceled?",previousContactsState);
        this.setState({
            // contacts: previousContactsState,
            edit: false,
        });
    }
//edit card form
    editCurrent() {
        
        return (
            <form onSubmit={this.updateSubmit}>
            <label>Name: </label><input type="text" name="name" value={this.state.contacts[this.state.showCard].name} onChange={this.updateItem}/>
            <label>E-mail: </label><input type="email" name="email" value={this.state.contacts[this.state.showCard].email} onChange={this.updateItem}/>
            <label>Phone number: </label><input type="text" name="number" value={this.state.contacts[this.state.showCard].number} onChange={this.updateItem}/>
            <label>Address: </label><input type="text" name="address" value={this.state.contacts[this.state.showCard].address} onChange={this.updateItem}/>
            <label>City: </label><input type="text" name="city" value={this.state.contacts[this.state.showCard].city} onChange={this.updateItem}/>
            <label>State: </label><input type="text" name="state" value={this.state.contacts[this.state.showCard].state} onChange={this.updateItem}/>
            <label>Zip: </label><input type="text" name="zip" value={this.state.contacts[this.state.showCard].zip} onChange={this.updateItem}/>
            <button type="submit">Submit</button>
            <button onClick={e => {
            e.preventDefault();
            this.cancelEdit()}}>Cancel</button>
            </form>
            );
    }
    
// update contact
    updateItem (event) {
        
        let item = event.target.name;
        let prevItem = previousContactsState[item];
        console.log("1. :", prevItem);
        
        let copyStates = Object.assign(this.state);
        let index = copyStates.showCard;
        console.log("2. :", prevItem);
        
        copyStates['contacts'][index][item] = event.target.value;
        
        console.log("3. :", prevItem);
        this.setState(copyStates);

    }
// submit button for update
    updateSubmit (e) {
        e.preventDefault();
        console.log("updated!");
        const stateCopy = [...this.state.contacts];
        this.setState({
            contactsCopy: stateCopy,
            edit: false,
        });
    }
    
    
    componentDidMount() {
        console.log("4: ", previousContactsState);
    }

    componentWillUnmount() {
        console.log("5: ", previousContactsState);
    }
//individual card
    individualCard () {
        return (
            <div>
            <p>Name: {this.state.contacts[this.state.showCard].name}</p>
            <p>E-mail: {this.state.contacts[this.state.showCard].email}</p>
            <p>Phone number: {this.state.contacts[this.state.showCard].number}</p>
            <p>Address: {this.state.contacts[this.state.showCard].address}</p>
            <p>City: {this.state.contacts[this.state.showCard].city}</p>
            <p>State: {this.state.contacts[this.state.showCard].state}</p>
            <p>Zip: {this.state.contacts[this.state.showCard].zip}</p>
            <button onClick={e => {
                e.preventDefault();
                this.deletePerson(this.state.showCard);
            }}>Delete</button>
            <button onClick={ e=>{
                e.preventDefault();
                this.editPerson();
                }}>Edit</button>
            </div>
            );
    }

    render () {
        return (
            <div>
            <div>
            { this.state.contacts ?
                (this.state.contacts.map( (contact, index) => {
                return (
                <div key={contact.name} onClick={()=> this.checkPerson(index)}>
                <p>{contact.name}</p>
                <p>{contact.city} {contact.state}</p>
                </div>);
            }))
            : <div />
            }
            </div>
            {this.state.edit? this.editCurrent() : this.individualCard()}
            </div>
            );
    }
}


class App extends React.Component {
  render() {
    return (
        <div>
        <Header />
        <Namecard />
        </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));