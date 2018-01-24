import React, {Component} from 'react';
import ReactDOM from 'react-dom';


document.addEventListener('DOMContentLoaded', function(){

    class Input extends Component {
      constructor(props){
        super(props);
        this.state = {
          value: '',
          companyData: {},
          error: ''
        };
      }
      //first validation of input - if it is a number or string
      newVat = (event) =>{
        if(typeof event.target.value === 'number' || typeof event.target.value === 'string'){
          this.setState({value: event.target.value, error: ''});
        }else {
          this.setState({error: 'Proszę wprowadzić poprawny format NIP'});
        }
      }
      //check if localStorage is available in Browser
      storageAvailable = (type) => {
            try {  const storage = window[type],
                    test = '__storage_test__';
              storage.setItem(test, test);
              storage.removeItem(test);
              return true;
          }
          catch(e) {
              return e instanceof DOMException && (
                  // everything except Firefox
                  e.code === 22 ||
                  // Firefox
                  e.code === 1014 ||
                  // test name field too, because code might not be present
                  // everything except Firefox
                  e.name === 'QuotaExceededError' ||
                  // Firefox
                  e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
                  // acknowledge QuotaExceededError only if there's something already stored
                  storage.length !== 0;
          }
      }
      // handle keyPress ('enter') - validate the length of input
      keyPress = (event) =>{
        if (event.key === 'Enter') {
          if(this.state.value.length < 9){
            this.setState({error: 'Proszę wprowadzić poprawny numer'});
          } else if (this.state.value.length >= 9){
            this.setState({error:''})
            this.checkStorage();
          }
        }
      }
      // after keyPress check if the key is available in localStorage or not
      checkStorage = () =>{
        if (this.storageAvailable('localStorage')) {
          let keyString = JSON.stringify(this.state.value);
          if(!localStorage.getItem(keyString)) {
              this.getCompanyDetails();
            } else {
              this.getDataFromLocalStorage();
            }
        }
        else {
          this.getCompanyDetails();
        }
      }
      // if there is a key in localStorage, get data from there
      getDataFromLocalStorage = () => {
        let keyString = JSON.stringify(this.state.value);
        let result = localStorage.getItem(keyString);
        this.setState({ companyData: JSON.parse(result) });
      }
      // if there is no key in localStorage, fetch data from API and add to localStorage
      getCompanyDetails = () =>{
        let newValue = this.state.value;
        newValue= newValue.replace(/\D+/g, "");
        const apiUrl = `http://ihaveanidea.aveneo.pl/NIPAPI/api/Company?CompanyId=${newValue}`;
        const apiData = fetch(apiUrl).then(resp =>	{
            if	(resp.ok) return	resp.json();
            else  throw	new	Error('Błąd	sieci!');
          }).then(	result	=>	{
            if(result.CompanyInformation === null){
                return;
            } else {
              if (this.storageAvailable('localStorage')) {
                localStorage.setItem(JSON.stringify(newValue), JSON.stringify(result));
                this.getDataFromLocalStorage();
              } else {
                this.setState({ companyData: result });
            }
          }
        }).catch(	err	=>	{
            console.log('Błąd!',	err);
        });
      }
      //after geting the Data from localStorage or API (if successfull), return the table with data
      createDetails = () =>{
        if(this.state.companyData === null){
          return null;
        }else if (this.state.companyData.Success === true){
           this.setState({error:""});
           return ( <div>
               <table>
                   <thead>
                     <tr>
                       <th>REGON</th>
                       <th>NAZWA</th>
                       <th>WOJEWÓDZTWO</th>
                       <th>POWIAT</th>
                       <th>ADRES</th>
                       <th>DATA ROZPOCZĘCIA DZIAŁALNOŚCI</th>
                       <th>RODZAJ DZIAŁALNOSCI</th>
                     </tr>
                   </thead>
                   <tbody>
                     <tr>
                       <th>{this.state.companyData.CompanyInformation.Regon}</th>
                       <th>{this.state.companyData.CompanyInformation.Name}</th>
                       <th>{this.state.companyData.CompanyInformation.Province}</th>
                       <th>{this.state.companyData.CompanyInformation.County}</th>
                       <th>{this.state.companyData.CompanyInformation.Street} {this.state.companyData.CompanyInformation.HouseNumber} / {this.state.companyData.CompanyInformation.ApartmentNumber} {this.state.companyData.CompanyInformation.PostalCode} {this.state.companyData.CompanyInformation.Place} </th>
                       <th>{this.state.companyData.CompanyInformation.BusinessActivityStart}</th>
                       <th>{this.state.companyData.CompanyInformation.Type}</th>
                     </tr>
                   </tbody>
                 </table>
           </div>);
        }else{
          return null;
        }
      }
      render(){
          return(
            <div>
              <input value={this.state.value} placeholder="wprowadź numer NIP i naciśnij ENTER" type="text" onChange={this.newVat} onKeyPress={this.keyPress}></input>
              <div className="error">{this.state.error}</div>
              {this.createDetails()}
            </div>
          );
        }
      }

    class App extends Component {
      render(){
        return(
					<div className={"container"}>
            VAT CHECK
            <Input />
					</div>
        );
      }
    };
    ReactDOM.render(
        <App />,
        document.getElementById('app')
    );
});
