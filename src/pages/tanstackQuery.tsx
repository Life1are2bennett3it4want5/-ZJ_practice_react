import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Banner from "../components/navBanner";
import "../index.css";


const queryClient = new QueryClient

export default function TanstackQueryPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <Banner />
      <Example />
    </QueryClientProvider>
  )
}

type Exercise = {
  name: string
  type: string
  muscle: string
  difficulty: string
  instructions: string
  equipments?: string[]
}

type ExerciseFilters = {
  name: string
  type: string
  muscle: string
  difficulty: string
}

async function fetchExercises(filters: ExerciseFilters): Promise<Exercise[]> {
  const params = new URLSearchParams()

  if(filters.name) params.set('name', filters.name);
  if(filters.type) params.set('type', filters.type);
  if(filters.muscle) params.set('muscle', filters.muscle);
  if(filters.difficulty) params.set('difficulty', filters.difficulty);

  const response = await fetch(
    `https://api.api-ninjas.com/v1/exercises?${params.toString()}`,
    { 
      headers:{
        'X-Api-Key': import.meta.env.VITE_API_NINJAS_KEY,
      },
    },
  );

  if(!response.ok) throw new Error(`Request failed: ${response.status}`)
  
  return response.json()
}

function Example() {
  const [filters, setFilters] = useState<ExerciseFilters>({
    name:'',
    type:'',
    muscle:'',
    difficulty:'',
  });

  const { data = [], isPending, error } = useQuery({
    queryKey: ['exercises', filters],
    queryFn: () => fetchExercises(filters),
  })

  return(
    <div>
      <h1>Search for an exercise</h1>

      <input 
        placeholder="Search by name"
        value={filters.name}
        onChange={(e) =>
          setFilters((prev) => ({...prev, name: e.target.value}))
        }
      />

      <input 
        className = ""
        placeholder="Type"
        value={filters.type}
        onChange={(e) =>
          setFilters((prev) => ({...prev, type: e.target.value}))
        }
      />

      <input 
        placeholder="Muscle"
        value={filters.muscle}
        onChange={(e) =>
          setFilters((prev) => ({...prev, muscle: e.target.value}))
        }
      />

      <input 
        placeholder="Difficulty"
        value={filters.difficulty}
        onChange={(e) =>
          setFilters((prev) => ({...prev, difficulty: e.target.value}))
        }
      />

      {isPending && <p>Loading...</p>}
      {error && <p>Error has occured:{error.message}</p>}

      {!isPending && !error && data.map((exercise) => (
        <div key={`${exercise.name}-${exercise.type}`}>
          <h2>{exercise.name}</h2>
          <p>Type: {exercise.type}</p>
          <p>Muscle: {exercise.muscle}</p>
          <p>Difficulty: {exercise.difficulty}</p>  
          <p>{exercise.instructions}</p>
        </div>
      ))}
    </div>
  )
}