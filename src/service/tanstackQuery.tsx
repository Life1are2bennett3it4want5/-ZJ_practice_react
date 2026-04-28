import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { useMemo, useState } from "react";
import Banner from "../components/navBanner";
import "../index.css";
import axios from "axios";

const queryClient = new QueryClient();

type Exercise = {
  name: string;
  level: string;
  category: string;
  equipment: string;
  force: string;
  mechanic: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  instructions: string[];
};
type ExerciseFilters = {
  name: string;
  level: string;
  category: string;
  equipment: string;
  force: string;
  mechanic: string;
  primaryMuscles: string;
  secondaryMuscles: string;
  instructions: string;
};

const levelOptions /*: (number|string)[]*/ = [
  "beginner",
  "intermediate",
  "expert",
];
const categoryOptions = [
  "cardio",
  "olympic weightlifting",
  "plyometrics",
  "powerlifting",
  "strength",
  "stretching",
  "strongman",
];
const equipmentOptions = [
  "bands",
  "barbell",
  "body only",
  "cable",
  "dumbbell",
  "e-z curl bar",
  "exercise ball",
  "foam roll",
  "kettlebells",
  "machine",
  "medicine ball",
  "other",
];
const forceOptions = ["pull", "push", "static"];
const mechanicOptions = ["compound", "isolation"];
const primaryMuscleOptions = [
  "abdominals",
  "abductors",
  "adductors",
  "biceps",
  "calves",
  "chest",
  "forearms",
  "glutes",
  "hamstrings",
  "lats",
  "lower back",
  "middle back",
  "neck",
  "quadriceps",
  "shoulders",
  "traps",
  "triceps",
];
const secondaryMuscleOptions = [
  "abdominals",
  "abductors",
  "adductors",
  "biceps",
  "calves",
  "chest",
  "forearms",
  "glutes",
  "hamstrings",
  "lats",
  "lower back",
  "middle back",
  "neck",
  "quadriceps",
  "shoulders",
  "traps",
  "triceps",
];

//getSuggestions expects an array, labeled options and a string labeled value
function getSuggestions(options: string[], value: string) {
  if (!value.trim()) return []; //return empty array if no input
  return options.filter(
    (option) => option.toLowerCase().includes(value.toLowerCase()), //compare value and check if options has a similar value
  );
}

export default function TanstackQueryPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <Banner />
      <Search />
    </QueryClientProvider>
  );
}

//returns a promise that contains the values in Exercise
async function fetchExercises(filters: ExerciseFilters): Promise<Exercise[]> {
  const response = await axios.get<Exercise[]>(
    `https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/dist/exercises.json`,
  );
  const normalized = (value: string) => value.trim().toLowerCase();
  return response.data.filter((exercise) => {
    return (
      (!filters.name ||
        exercise.name.toLowerCase().includes(normalized(filters.name))) &&
      (!filters.level ||
        exercise.level.toLowerCase().includes(normalized(filters.level))) &&
      (!filters.category ||
        exercise.category
          .toLowerCase()
          .includes(normalized(filters.category))) &&
      (!filters.equipment ||
        exercise.equipment
          .toLowerCase()
          .includes(normalized(filters.equipment))) &&
      (!filters.mechanic ||
        exercise.mechanic
          .toLowerCase()
          .includes(normalized(filters.mechanic))) &&
      (!filters.primaryMuscles ||
        exercise.primaryMuscles.some((muscle) =>
          muscle.toLowerCase().includes(normalized(filters.primaryMuscles)),
        )) &&
      (!filters.secondaryMuscles ||
        exercise.secondaryMuscles.some((muscle) =>
          muscle.toLowerCase().includes(normalized(filters.secondaryMuscles)),
        )) &&
      (!filters.instructions ||
        exercise.instructions.some((instructions) =>
          instructions.toLowerCase().includes(normalized(filters.instructions)),
        ))
    );
  });
}

function Search() {
  //value within filters changes from user input
  const [filters, setFilters] = useState<ExerciseFilters>({
    name: "",
    level: "",
    category: "",
    equipment: "",
    force: "",
    mechanic: "",
    primaryMuscles: "",
    secondaryMuscles: "",
    instructions: "",
  });

  const levelSuggestions = useMemo(
    () => getSuggestions(levelOptions, filters.level), //give suggestions for level
    [filters.level],
  );
  const categorySuggestions = useMemo(
    () => getSuggestions(categoryOptions, filters.category),
    [filters.category],
  );
  const equipmentSuggestions = useMemo(
    () => getSuggestions(equipmentOptions, filters.equipment),
    [filters.equipment],
  );
  const forceSuggestions = useMemo(
    () => getSuggestions(forceOptions, filters.force),
    [filters.force],
  );
  const mechanicSuggestions = useMemo(
    () => getSuggestions(mechanicOptions, filters.mechanic),
    [filters.mechanic],
  );
  const primaryMuscleSuggestions = useMemo(
    () => getSuggestions(primaryMuscleOptions, filters.primaryMuscles),
    [filters.primaryMuscles],
  );
  const secondaryMuscleSuggestions = useMemo(
    () => getSuggestions(secondaryMuscleOptions, filters.secondaryMuscles),
    [filters.secondaryMuscles],
  );

  const {
    data = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["exercises", filters],
    queryFn: () => fetchExercises(filters),
  });

  if (isError) {
    return <h1>Error fetching data</h1>;
  }

  return (
    <div>
      <h1 className="font-bold text-4xl">Search for an exercise</h1>

      <br></br>
      <div className="flex flex-wrap gap-4">
        <input
          className="border-2 rounded"
          placeholder="Search by name"
          value={filters.name}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, name: e.target.value }))
          }
        />
        <div>
          <input
            className="border-2 rounded"
            placeholder="Difficulty"
            value={filters.level}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, level: e.target.value }))
            }
          />

          {levelSuggestions.length > 0 && (
            <div className="flex flex-col">
              {levelSuggestions.map((option) => (
                <button
                  className="hover:cursor-pointer text-left hover:text-blue-500"
                  key={option}
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, level: option }))
                  }
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <input
            className="border-2 rounded"
            placeholder="Type"
            value={filters.category}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, category: e.target.value }))
            }
          />

          {categorySuggestions.length > 0 && (
            <div className="flex flex-col">
              {categorySuggestions.map((option) => (
                <button
                  className="hover:cursor-pointer text-left hover:text-blue-500"
                  key={option}
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, category: option }))
                  }
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <input
            className="border-2 rounded"
            placeholder="Equipment"
            value={filters.equipment}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, equipment: e.target.value }))
            }
          />

          {equipmentSuggestions.length > 0 && (
            <div className="flex flex-col">
              {equipmentSuggestions.map((option) => (
                <button
                  className="hover:cursor-pointer text-left hover:text-blue-500"
                  key={option}
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, equipment: option }))
                  }
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <input
            className="border-2 rounded"
            placeholder="Force"
            value={filters.force}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, force: e.target.value }))
            }
          />

          {forceSuggestions.length > 0 && (
            <div className="flex flex-col">
              {forceSuggestions.map((option) => (
                <button
                  className="hover:cursor-pointer text-left hover:text-blue-500"
                  key={option}
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, force: option }))
                  }
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <input
            className="border-2 rounded"
            placeholder="Mehcanics"
            value={filters.mechanic}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, mechanic: e.target.value }))
            }
          />

          {mechanicSuggestions.length > 0 && (
            <div className="flex flex-col">
              {mechanicSuggestions.map((option) => (
                <button
                  className="hover:cursor-pointer text-left hover:text-blue-500"
                  key={option}
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, mechanic: option }))
                  }
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <input
            className="border-2 rounded"
            placeholder="Primary Muscles"
            value={filters.primaryMuscles}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                primaryMuscles: e.target.value,
              }))
            }
          />

          {primaryMuscleSuggestions.length > 0 && (
            <div className="flex flex-col">
              {primaryMuscleSuggestions.map((option) => (
                <button
                  className="hover:cursor-pointer text-left hover:text-blue-500"
                  key={option}
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, primaryMuscles: option }))
                  }
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <input
            className="border-2 rounded"
            placeholder="Secondary Muscles"
            value={filters.secondaryMuscles}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                secondaryMuscles: e.target.value,
              }))
            }
          />

          {secondaryMuscleSuggestions.length > 0 && (
            <div className="flex flex-col">
              {secondaryMuscleSuggestions.map((option) => (
                <button
                  className="hover:cursor-pointer text-left hover:text-blue-500"
                  key={option}
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      secondaryMuscles: option,
                    }))
                  }
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <br></br>
      {!isLoading ? (
        <div className="overflow-x-auto">
          <table className="min-w-full table-fixed border-collapse text-sm">
            <thead>
              <tr>
                <th className="border text-center p-2">Name</th>
                <th className="border text-center p-2">Difficulty</th>
                <th className="border text-center p-2">Type</th>
                <th className="border text-center p-2">Equipment</th>
                <th className="border text-center p-2">Force</th>
                <th className="border text-center p-2">Mechanics</th>
                <th className="border text-center p-2">Primary Muscle</th>
                <th className="border text-center p-2">Secondary Muscle</th>
                <th className="border text-center p-2">Instructions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((exercise) => (
                <tr key={`${exercise.name}-${exercise.secondaryMuscles}`}>
                  <td className="border align-top p-2">
                    {exercise.name ?? "none"}
                  </td>
                  <td className="border align-top p-2">
                    {exercise.level ?? "none"}
                  </td>
                  <td className="border align-top p-2">
                    {exercise.category ?? "none"}
                  </td>
                  <td className="border align-top p-2">
                    {exercise.equipment ?? "none"}
                  </td>
                  <td className="border align-top p-2">
                    {exercise.force ?? "none"}
                  </td>
                  <td className="border align-top p-2">
                    {exercise.mechanic ?? "none"}
                  </td>
                  <td className="border align-top p-2">
                    {exercise.primaryMuscles.join(", ") ?? "none"}
                  </td>
                  <td className="border align-top p-2">
                    {exercise.secondaryMuscles.join(", ") ?? "none"}
                  </td>
                  <td className="border align-top p-2">
                    {exercise.instructions.join(" ") ?? "none"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <h1>Loading...</h1>
      )}
    </div>
  );
}
