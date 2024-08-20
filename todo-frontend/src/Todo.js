import { useState , useEffect } from "react";

export default function Todo() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editId,setEditId] = useState(-1)
  const apiUrl = "http://localhost:8000";

  //For Edit
  const [editTitle, seteditTitle] = useState("");
  const [editDescription, seteditDescription] = useState("");


  const handlesubmit = () => {
    setError("");
    //Check input
    if (title.trim() !== " " && description.trim() !== " ") {
      fetch(apiUrl + "/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      })
        .then((res) => {
          if (res.ok) {
            //add item to list
            setTodos([...todos, { title, description }]);
            setMessage("Item Added Successfully");
            setTimeout(() => {
              setMessage("");
            }, 3000);

            
          } else {
            //set error
            setError("Unabel to create Todo item");
          }
        })
        .catch(() => {
          setError("Unable to create Todo item");
        });
    }
  };

  useEffect(() => {
    getItems()
  },[])

  const getItems = () =>{
    fetch(apiUrl + "/todos")
    .then((res) => {
      return res.json()
    }).then((res) =>{
      setTodos(res)
    })
  }

  const handleEdit = (item) => {
    setEditId(item._id);
    seteditTitle(item.title);
    seteditDescription(item.description)
    }

    const handleEditCancel = () => {
      setEditId(-1)
    }

  const handleupdate = () => {
    setError("");
    //Check input
    if (editTitle.trim() !== "" && editDescription.trim() !== "") {
      fetch(apiUrl + "/todos/" +editId, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({ title: editTitle, description: editDescription }),
      })
        .then((res) => {
          if (res.ok) {
            //Update item to list
            const updatedTodos = todos.map((item) => {
              if (item._id == editId) {
                item.title = editTitle;
                item.description = editDescription;
              }
              return item;
            })
            setTodos(updatedTodos);
            setMessage("Item Updated Successfully");
            setTimeout(() => {
              setMessage("");
            }, 3000);
            setEditId(-1)
          } else {
            //set error
            setError("Unabel to Update Todo item");
          }
        })
        .catch(() => {
          setError("Unable to Update Todo item");
        });
    }
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure want to delete?')) {
      fetch(apiUrl+'/todos/'+id,{
        method:"DELETE"
      })
      .then(() => {
        const UpdateTodos = todos.filter((item) => item._id !== id)
        setTodos(UpdateTodos)

      })
    }

  }
 

  return (
    <>
      <div className="row p-3 bg-success text-light">
        <h1>Todo Project with MERN Stack!</h1>
      </div>
      <div className="row">
        <h3>Add Item</h3>
        {message && <p className="text-success">{message}</p>}
        <div className="form-group d-flex gap-2">
          <input placeholder="title" onChange={(e) => setTitle(e.target.value)} value={title}
            className="form-control" type="text"/>
          <input placeholder="Description" onChange={(e) => setDescription(e.target.value)} value={description}
            className="form-control" type="text"/>
          <button className="btn btn-dark" onClick={handlesubmit}>
            Submit
          </button>
        </div>
        {error && <p className="text-danger">{error}</p>}
      </div>
      <div className="row mt-3">
        <h3>Tasks</h3>
        <div className="col-md-6">

        </div>
        <ul className="list-group">
          {
            todos.map((item) => 
              <li className="list-group-item bg-info d-flex justify-content-between align-items-center my-2">
            <div className="d-flex flex-column me-2">
              {
                editId == -1 || editId !== item._id ? <>
               <span className="fw-bold">{item.title}</span>
                <span>{item.description}</span>
                </> : <>
                
          <div className="form-group d-flex gap-2">
          <input placeholder="title" onChange={(e) => seteditTitle(e.target.value)} value={editTitle}
           className="form-control" type="text" />
          <input placeholder="Description" onChange={(e) => seteditDescription(e.target.value)} value={editDescription}
            className="form-control" type="text" />
        </div>
        </>
              }
            
            </div>
            <div className="d-flex gap-2">
            { editId == -1 || editId !== item._id ? 
            <button className="btn btn-warning" onClick={() => handleEdit(item)}>Edit</button> : 
            <button className="btn btn-warning" onClick={handleupdate}> Update</button>}
            { editId == -1 ? <button className="btn btn-danger" onClick={() => handleDelete(item._id)}>Delete</button> :
            <button className="btn btn-danger" onClick={handleEditCancel}>Cancel</button> }
            </div>
          </li>
            )
          }
        
          </ul>
      </div>
    </>
  );
}
