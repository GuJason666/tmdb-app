import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getMovieDetail } from "../api/tmdb"

interface Movie {
  title: string
  poster_path: string
  overview: string
  release_date: string
  vote_average: number
}

export default function MovieDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [movie, setMovie] = useState<Movie | null>(null)

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return
      const data = await getMovieDetail(id)
      setMovie(data)
    }

    fetchDetail()
  }, [id])

  if (!movie) return <p>Loading...</p>

  return (
    <div style={{ padding: "20px" }}>
      <button onClick={() => navigate(-1)}>⬅ Back</button>

      <h1>{movie.title}</h1>

      <img
        style={{ width: "300px" }}
        src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
      />

      <p><b>Release:</b> {movie.release_date}</p>
      <p><b>Rating:</b> {movie.vote_average}</p>
      <p>{movie.overview}</p>
    </div>
  )
}