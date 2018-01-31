import React, {Component} from 'react';
import ReactDOM from 'react-dom';

document.addEventListener('DOMContentLoaded', function(){

    class Input extends Component {
      constructor(props){
        super(props);
        this.state = {
          value: '',
          companyData: {},
          error: '',
          validate: false,
          nip: ''
        };
      }
      //first validation of input - if it is a number or string
      newVat = (event) =>{

        if(typeof event.target.value === 'number' || typeof event.target.value === 'string'){
          this.setState({value: event.target.value, error: ''});
        }else {
          this.setState({error: 'Proszę wprowadzić poprawny format NIP', companyData: {}});
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
      // handle button Click - validate the length of input
      handleClick = (event) =>{
          if(this.state.value.length < 9){
            this.setState({error: 'Proszę wprowadzić poprawną ilość cyfr', companyData: {}});
          } else {
            let validate = this.checkNIPIsValid();
            if (validate){
              this.setState({error:''});
              this.checkStorage();
            } else if (!validate){
              this.setState({error:'Proszę wprowadzić poprawny numer', companyData: {}});

            }
          }
      }
      checkNIPIsValid () {
        const weights = [6, 5, 7, 2, 3, 4, 5, 6, 7];
        let nip = this.state.value;
        nip = nip.replace(/[\s-]/g, '');
        nip = nip.replace(/\D+/g, "");
        if (nip.length === 10 && parseInt(nip, 10) > 0) {
                let sum = 0;
                for(let i = 0; i < 9; i++){
                        sum += nip[i] * weights[i];
                }
                if((sum % 11) === Number(nip[9])){
                  this.setState({validate: true})
                }else{
                  this.setState({validate: false});
                }
                return (sum % 11) === Number(nip[9]);
        }
        this.setState({validate: false});
        return false;
      }
      // after button Click check if the key is available in localStorage or not
      checkStorage = () =>{
        if (this.storageAvailable('localStorage')) {
          let nip = this.state.value;
          nip = nip.replace(/[\s-]/g, '');
          nip = nip.replace(/\D+/g, "");
          let keyString = JSON.stringify(nip);
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
        let nip = this.state.value;
        nip = nip.replace(/[\s-]/g, '');
        nip = nip.replace(/\D+/g, "");
        let keyString = JSON.stringify(nip);
        let result = localStorage.getItem(keyString);
        this.setState({ companyData: JSON.parse(result) });
      }
      // if there is no key in localStorage, fetch data from API and add to localStorage
      getCompanyDetails = () =>{
        let newValue = this.state.value;
        newValue= newValue.replace(/\D+/g, "");
        newValue = newValue.replace(/[\s-]/g, '');
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
           return ( <div className="data">
                      <div className="dataBox">
                        <span className="dataBox_name">REGON</span>
                        <span className="dataBox_info">{this.state.companyData.CompanyInformation.Regon}</span>
                      </div>
                      <div className="dataBox">
                        <span className="dataBox_name">NAZWA</span>
                        <span className="dataBox_info">{this.state.companyData.CompanyInformation.Name}</span>
                      </div>
                      <div className="dataBox">
                        <span className="dataBox_name">WOJEWÓDZTWO</span>
                        <span className="dataBox_info">{this.state.companyData.CompanyInformation.Province}</span>
                      </div>
                      <div className="dataBox">
                        <span className="dataBox_name">POWIAT</span>
                        <span className="dataBox_info">{this.state.companyData.CompanyInformation.County}</span>
                      </div>
                      <div className="dataBox">
                        <span className="dataBox_name">ADRES</span>
                        <span className="dataBox_info">{this.state.companyData.CompanyInformation.Street} {this.state.companyData.CompanyInformation.HouseNumber} / {this.state.companyData.CompanyInformation.ApartmentNumber} {this.state.companyData.CompanyInformation.PostalCode} {this.state.companyData.CompanyInformation.Place}
                        </span>
                      </div>
                      <div className="dataBox">
                        <span className="dataBox_name">DATA ROZPOCZĘCIA DZIAŁALNOŚCI</span>
                        <span className="dataBox_info">{this.state.companyData.CompanyInformation.BusinessActivityStart}</span>
                      </div>
                      <div className="dataBox">
                        <span className="dataBox_name">RODZAJ DZIAŁALNOSCI</span>
                        <span className="dataBox_info">{this.state.companyData.CompanyInformation.Type}</span>
                      </div>
           </div>);
        }else{
          return null;
        }
      }
      render(){
          return(
            <div className ="entry">
              <h1>SPRAWDŹ NUMER NIP</h1>
              <input value={this.state.value} placeholder="wprowadź numer NIP" type="text" onChange={this.newVat} ></input>
              <button onClick={this.handleClick}>Sprawdź numer NIP</button>
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
