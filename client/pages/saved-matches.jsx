import React from 'react';
import AppContext from '../lib/app-context';
import { Card } from 'react-bootstrap';
export default class SavedMatches extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      animals: []
    };
    this.handleDelete = this.handleDelete.bind(this);
  }

  componentDidMount() {
    this.renderSavedMatches();
  }

  renderSavedMatches() {
    fetch('/api/saved', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Token': localStorage.getItem('jwt')
      }
    })
      .then(response => response.json())
      .then(animals => this.setState({ animals }))
      .catch(error => {
        console.error('Error', error);
      });
  }

  handleDelete(event) {
    const selectedPetId = Number(event.currentTarget.id);
    let petIndex = null;
    for (let i = 0; i < this.state.animals.length; i++) {
      if (this.state.animals[i].petId === selectedPetId) {
        petIndex = i;
      }
    }
    fetch(`/api/details/${selectedPetId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Token': localStorage.getItem('jwt')
      }
    })
      .then(() => {
        const deleteAnimal = this.state.animals.slice();
        deleteAnimal.splice(petIndex, 1);
        this.setState({ animals: deleteAnimal });
      })
      .catch(error => {
        console.error('Error', error);
      });
  }

  render() {
    const { user } = this.context;
    if (this.state.animals[0] === undefined) {
      return (
        <Card className='w-100 text-center mx-auto mt-5'>
          <Card.Body className=''>
            <Card.Text className=''>
               <h5 className="card-title">There are currently no saved pals.</h5>
               { user !== null &&
                <>
                  <p className="card-text">Click the button to find your next pal! <i className="fa-solid fa-dog fs-5"></i>
                  </p>
                  <a href="#" className="btn green-bg text-white">Let&apos;s go!</a>
                </>
               }
               { user === null &&
                <>
                  <p className="card-text">Log in or sign up to see your saved pals!
                  </p>
                  <a href="#log-in" className="btn green-bg text-white">Let&apos;s go!</a>
                </>
               }
            </Card.Text>
          </Card.Body>
        </Card>
      );
    } else {
      return (
        <>
        <h1 className="green-text d-flex justify-content-center mt-4">Matched Pals</h1>
          <div className="row row-cols-1 row-cols-md-3 g-4 mx-5 mt-1 mb-5">
            {this.state.animals.map(animal => {
              return (
                <div key={animal.petId} className='col'>
                  <div className="card h-100 hover">
                    <button className='bg-transparent position-absolute top-0 start-0' id={animal.petId} onClick={this.handleDelete}>
                      <i className="fas fa-heart hover"></i>
                    </button>
                    <a href={`#details?petId=${animal.petId}`} className='text-decoration-none'>
                      <img src={animal.details.photos} className="card-img-top p-2" alt={animal.details.name} />
                      <div className="card-body tan-bg">
                        <h2 className="card-title green-text mb-3 d-flex justify-content-center">{animal.details.name}</h2>
                        <p className="card-text text-secondary"><span className="fw-bolder">Location:</span> {animal.details.address.city}, {animal.details.address.state}</p>
                        <p className="card-text text-secondary"><span className="fw-bolder">Age:</span> {animal.details.age}</p>
                        <p className="card-text text-secondary"><span className="fw-bolder">Breed:</span> {animal.details.breed}</p>
                      </div>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      );
    }
  }
}

SavedMatches.contextType = AppContext;
