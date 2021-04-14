import './App.css';
import {gql, useQuery, useMutation, useLazyQuery} from '@apollo/client'
import Swal from 'sweetalert2'
import {useState} from 'react';

const GET_NOTES = gql `
  query {
    notes {
            id
            title 
            desc
          }
  } 
`
const AJOUT_NOTE = gql `
   mutation ajoutNote($title: String!, $desc: String!) {
     ajoutNote(input: {
       title: $title,
       desc: $desc
     }) {
       id
       title
       desc
     }
   }
`
const SUPPRIMER_NOTE = gql `
  query supprimerNote($id: Float!) {
    supprimerNote(id: $id)
  }
`

const MODIFIE_NOTE = gql `
  mutation modifierNote($id: Float!, $title: String!, $desc: String!) {
    modifierNote(id: $id, input: {
      title: $title,
      desc: $desc
    }) {
      id
      title
      desc
    }
  }
`

function App() {
  const {data} = useQuery(GET_NOTES, {pollInterval: 100})
  const [supprimerNote] = useLazyQuery(SUPPRIMER_NOTE)

  const Modal = () => {
        const [title, setTitle] = useState("")
        const [desc, setDesc] = useState("")
        const [ajoutNote] = useMutation(AJOUT_NOTE)
        return (
             <div className="modal fade" id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
       <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header border-0">
        <h5 className="modal-title text-center" id="exampleModalLabel"> Ajoute poste </h5>
        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">×</span>
        </button>
      </div>
      <div className="modal-body border-0">
        <form action="">
            <div className="form-group mb-4">
                <input type="text" placeholder="Title" className="form-control rounded-0" onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="form-group mb-4">
                <textarea type="text" placeholder="Content" rows='3' className="form-control rounded-0" onChange={(e) => setDesc(e.target.value)} />
            </div>
        </form>
      </div>
      <div className="modal-footer border-0">
        <button type="button" className="btn btn-success rounded-0" data-dismiss="modal" onClick={() => {
          ajoutNote({
            variables: {
              title: title,
              desc: desc
            }
          })
        }} >
        Ajoute Note</button>
        <button type="button" className="btn btn-danger rounded-0" data-dismiss="modal">Annuler</button>
      </div>
    </div>
  </div>
</div>
        )
    }

    const ModalUpdate = ({note}) => {
        const [title, setTitle] = useState(note.title)
        const [desc, setDesc] = useState(note.desc)
        const [modifierNote] = useMutation(MODIFIE_NOTE)
        return (
             <div className="modal fade" id="exampleModal2" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
       <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header border-0">
        <h5 className="modal-title text-center" id="exampleModalLabel"> Update Note </h5>
        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">×</span>
        </button>
      </div>
      <div className="modal-body border-0">
        <form action="">
            <div className="form-group mb-4">
                <input type="text" placeholder="Title" value={title} className="form-control rounded-0" onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="form-group mb-4">
                <textarea type="text" placeholder="Content" value={desc} rows='3' className="form-control rounded-0" onChange={(e) => setDesc(e.target.value)} />
            </div>
        </form>
      </div>
      <div className="modal-footer border-0">
        <button type="button" className="btn btn-success rounded-0" data-dismiss="modal" onClick={() => {
          modifierNote({
            variables: {
              id: note.id,
              title: title,
              desc: desc
            }
          })
        }} >
        Modifier Note</button>
        <button type="button" className="btn btn-danger rounded-0" data-dismiss="modal">Annuler</button>
      </div>
    </div>
  </div>
</div>
        )
    }



  return (
    <div className="App"> 
    <Modal/>
      <h2 className="mt-3 text-center">Notes App</h2>
      <button className="btn btn-success rounded-0 btn-block font-weight-bold w-25"
        data-toggle="modal" data-target="#exampleModal"
      ><i className="fas fa-plus-circle mr-2"></i> Ajouter Note </button>
      <div className="row mt-4 mx-3">
        {
          data && data.notes.map(note => (
            <div className="col-md-4 mb-5 position-relative" key={note.id}>
              <div className="card w-100 border-0 rounded shadow-sm">
                <div className="card-header bg-transparent border-0 font-weight-bold"> {note.title} </div>
                <div className="card-body">
                  <div className="card-text"> {note.desc} </div>
                </div>
              </div>
              <div className="position-absolute" style={{top: '5%', right: '7%', cursor: 'pointer'}} >
                <i className="far fa-trash-alt text-danger font-weight-bold" onClick={() => {

                                   Swal.fire({
                                   title: 'Are you sure?',
                                   text: "You won't be able to revert this!",
                                   icon: 'warning',
                                   showCancelButton: true,
                                   confirmButtonColor: '#3085d6',
                                    cancelButtonColor: '#d33',
                                    confirmButtonText: 'Yes, delete it!'
                                  }).then((result) => {
                                    if (result.isConfirmed) {
                                      supprimerNote({
                                        variables: {
                                          id: parseFloat(note.id)
                                        }
                                      })
                                      Swal.fire(
                                        'Deleted!',
                                        'Your file has been deleted.',
                                        'success'
                                      )
                                  }
                                  })
                               }}></i>
                </div>
                <div className="position-absolute" style={{bottom: '5%', right: '7%', cursor: 'pointer'}} >
                  <i className="far fa-edit text-warning font-weight-bold" data-toggle="modal" data-target="#exampleModal2" 
                  ></i>
                </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}

export default App;
