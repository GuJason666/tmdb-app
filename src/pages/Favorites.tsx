import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getMovieDetail } from "../api/tmdb"

interface Movie {
  id: number
  title: string
  poster_path: string
  vote_average: number
  overview: string
}

export default function Favorites() {
  const [movies, setMovies] = useState<Movie[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    const loadFavorites = async () => {
      const saved = localStorage.getItem("favorites")

      if (!saved) return

      const ids: number[] = JSON.parse(saved)

      const results = await Promise.all(
        ids.map(async (id) => {
          const data = await getMovieDetail(String(id))
          return data
        })
      )

      setMovies(results)
    }

    loadFavorites()
  }, [])

  // ❤️ 删除收藏
  const removeFavorite = (movieId: number) => {
    const saved = localStorage.getItem("favorites")

    if (!saved) return

    const ids: number[] = JSON.parse(saved)

    const updated = ids.filter(id => id !== movieId)

    localStorage.setItem("favorites", JSON.stringify(updated))

    setMovies(prev => prev.filter(m => m.id !== movieId))
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>❤️ My Favorites</h1>

      {movies.length === 0 && <p>No favorites yet</p>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "10px",
        }}
      >
        {movies.map((movie) => (
          <div
            key={movie.id}
            style={{
              background: "#111",
              color: "#fff",
              borderRadius: "10px",
              overflow: "hidden",
              cursor: "pointer",
            }}
          >
            {/* 海报 */}
            <div onClick={() => navigate(`/movie/${movie.id}`)}>
              {movie.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                  style={{
                    width: "100%",
                    height: "450px",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <div
                  style={{
                    height: "450px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#333",
                  }}
                >
                  No Poster
                </div>
              )}
            </div>

            {/* 信息 */}
            <div style={{ padding: "10px" }}>
              <h3 style={{ fontSize: "14px", margin: 0 }}>
                {movie.title}
              </h3>

              <p style={{ fontSize: "12px", color: "#aaa" }}>
                ⭐ {movie.vote_average}
              </p>

              {/* ❤️ 删除收藏按钮 */}
              <button
                onClick={() => removeFavorite(movie.id)}
                style={{
                  marginTop: "5px",
                  background: "red",
                  border: "none",
                  color: "#fff",
                  padding: "5px 8px",
                  cursor: "pointer",
                  borderRadius: "5px",
                }}
              >
                Remove ❤️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}