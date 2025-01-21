import { useState } from "react"
import { useWorkoutsContext } from "../hooks/useWorkoutsContext"
import { useAuthContext } from "../hooks/useAuthContext"

const WorkoutForm = () => {
  const { dispatch } = useWorkoutsContext()
  const { user } = useAuthContext();

  const [title,setTitle] = useState('')
  const [load,setLoad] = useState('')
  const [reps,setReps] = useState('')
  const [error,setError] = useState(null)

  const  handleSubmit = async (e) => {
    //prevent null submit
    e.preventDefault();

    if(!user){
      setError("You must be logged in ");
      return;
    }

    const workout = {title, load, reps}

    const response = await fetch('/api/workouts',{
      method:"POST",
      body: JSON.stringify(workout),
      headers: { 
        "Content-Type": "application/json",
        'Authorization' : `Bearer ${user.token}`
       }
    })
    const json = await response.json()

    if (!response.ok) {
      setError(json.error)
    }
    if (response.ok) {
      setTitle('')
      setLoad('')
      setReps('')
      setError(null)
      console.log('new workout added', json)
      dispatch({type: 'CREATE_WORKOUT', payload: json})
    }
      
  }

  return(
    <form className="create" onSubmit={handleSubmit}>
      <h3>Add a New Workout</h3>
        <label>Exercise Title:</label>
        <input
          type="text"
          onChange={(e)=>setTitle(e.target.value)}
          value={title}
        ></input>
        <label>Exercise Load:</label>
        <input
          type="number"
          onChange={(e)=>setLoad(e.target.value)}
          value={load}
        ></input>
        <label>Exercise Reps:</label>
        <input
          type="number"
          onChange={(e)=>setReps(e.target.value)}
          value={reps}
        ></input>

      <button>Add Workout</button>
      {error && <div className="error">{error}</div>}
    </form>


  )

}

export default WorkoutForm