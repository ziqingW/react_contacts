import React from 'react';
import ReactDOM from 'react-dom';
// preSet contacts
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
            
// class App
class App extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            contacts : preList,
            currentCard : 0,
            edit : false
        };
        this.checkPerson = this.checkPerson.bind(this);
        this.deletePerson = this.deletePerson.bind(this);
        this.editPerson = this.editPerson.bind(this);
        this.updateSubmit = this.updateSubmit.bind(this);
        this.updateItem = this.updateItem.bind(this);
        this.cancelEdit = this.cancelEdit.bind(this);
    }
    
    // header
    Header () {
        return (
            <div>
            <h1>My Contacts</h1>
            </div>
            );
    }
        
    // simple contacts
    SimpleContacts () {
        return (
            <div>{ props.contacts.map( (contact, index) => {
                return (
                <div key={index} onClick={props.onClick}>
                <p>{contact.name}</p>
                <p>{contact.city} {contact.state}</p>
                </div>);
            })
            }</div>);
    }
    // individual name card
    function IndividualCard (props) {
    return (
            <div>
            <p>Name: {props.contacts[props.currentCard].name}</p>
            <p>E-mail: {props.contacts[props.currentCard].email}</p>
            <p>Phone number: {props.contacts[props.currentCard].number}</p>
            <p>Address: {props.contacts[props.currentCard].address}</p>
            <p>City: {props.contacts[props.currentCard].city}</p>
            <p>State: {props.contacts[props.currentCard].state}</p>
            <p>Zip: {props.contacts[props.currentCard].zip}</p>
            <button onClick={props.onDelete}>Delete</button>
            <button onClick={props.onEdit}>Edit</button>
            </div>
            );
}
    // edit form
    function EditForm (props) {
    return (
            <form onSubmit={props.onSubmit}>
            <label>Name: </label><input type="text" name="name" value={props.contacts[props.currentCard].name} onChange={props.updateItem}/>
            <label>E-mail: </label><input type="email" name="email" value={props.contacts[props.currentCard].email} onChange={props.updateItem}/>
            <label>Phone number: </label><input type="text" name="number" value={props.contacts[props.currentCard].number} onChange={props.updateItem}/>
            <label>Address: </label><input type="text" name="address" value={props.contacts[props.currentCard].address} onChange={props.updateItem}/>
            <label>City: </label><input type="text" name="city" value={props.contacts[props.currentCard].city} onChange={props.updateItem}/>
            <label>State: </label><input type="text" name="state" value={props.contacts[props.currentCard].state} onChange={props.updateItem}/>
            <label>Zip: </label><input type="text" name="zip" value={props.contacts[props.currentCard].zip} onChange={props.updateItem}/>
            <button type="submit">Submit</button>
            <button onClick={props.onCancel}>Cancel</button>
            </form>
            );
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
    checkPerson(i, e) {
        // let index = e.target.name;
        console.log(i);
        console.log(e);
        // this.setState({
        //     currentCard: index
        // });
    }
    
    //delete current card    
    deletePerson() {
        let i = this.state.currentCard;
        let deletedContacts = Object.assign(this.state.contacts);
        deletedContacts.splice(i, 1);
            this.setState({
                contacts: deletedContacts,
                showCard: 0
        });
    }
    
    //edit current card
    editPerson() {
        // previousContactsState = Object.assign(this.state.contacts[this.state.showCard]);
        console.log("copyed!");
        this.setState({
            edit: true
        });
    }
    
    // submit button for update
    updateSubmit (e) {
        e.preventDefault();
        console.log("updated!");
        // const stateCopy = [...this.state.contacts];
        this.setState({
            edit: false
        });
    }

    // update contact
    updateItem (event) {
        let item = event.target.name;
        // let prevItem = previousContactsState[item];
        // console.log("1. :", prevItem);
        
        let copyContacts = Object.assign(this.state.contacts);
        let index = this.state.currentCard;
        // console.log("2. :", prevItem);
        
        copyContacts[index][item] = event.target.value;
        
        // console.log("3. :", prevItem);
        this.setState({
            contacts : copyContacts
        });
    }
        
    // cancel submit
    cancelEdit() {
        // console.log("canceled?",previousContactsState);
        this.setState({
            // contacts: previousContactsState,
            edit: false,
        });
    }
    
    render() {
        return (
            <div>
            <Header />
            {this.state.contacts.length > 0 ?
            (<div><SimpleContacts contacts={this.state.contacts} onClick={this.checkPerson} />
            {this.state.edit ? 
            <EditForm contacts={this.state.contacts} currentCard={this.state.currentCard} 
            onSubmit={this.updateSubmit} updateItem={this.updateItem} onCancel={this.cancelEdit}/>
            : <IndividualCard contacts={this.state.contacts} currentCard={this.state.currentCard} 
            onDelete={this.deletePerson} onEdit={this.editPerson} />
            }
            </div> )
            : <div /> }
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('root'));