import { useState, useEffect } from "react"
import { searchMovies, getPopularMovies } from "../api/tmdb"
import { useNavigate } from "react-router-dom"

interface Movie {
  id: number
  title: string
  poster_path: string
  overview: string
  release_date: string
  vote_average: number
}

export default function Home() {
  const [searchText, setSearchText] = useState("")
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(false)
  const [favorites, setFavorites] = useState<number[]>([])

  const navigate = useNavigate()

  // ⭐ 加载热门电影
  useEffect(() => {
    const loadPopular = async () => {
      setLoading(true)
      const results = await getPopularMovies()
      setMovies(results)
      setLoading(false)
    }

    loadPopular()
  }, [])

  // ⭐ 读取本地收藏
  useEffect(() => {
    const saved = localStorage.getItem("favorites")
    if (saved) {
      setFavorites(JSON.parse(saved))
    }
  }, [])

  // 🔍 搜索
  const handleSearch = async () => {
    if (!searchText.trim()) return

    setLoading(true)
    const results = await searchMovies(searchText)
    setMovies(results)
    setLoading(false)
  }

  // ❤️ 收藏切换
  const toggleFavorite = (movieId: number) => {
  const id = Number(movieId)

  let updated: number[] = []

  if (favorites.includes(id)) {
    updated = favorites.filter(i => i !== id)
  } else {
    updated = [...favorites, id]
  }

  console.log("favorites updated:", updated) // 👈 加这个

  setFavorites(updated)
  localStorage.setItem("favorites", JSON.stringify(updated))
}

  return (
    <div style={{ padding: "20px" }}>
      <h1>Movie Search App</h1>
    <button
        onClick={() => navigate("/favorites")}
        style={{
            marginLeft: "10px",
            padding: "5px 10px",
            cursor: "pointer",
        }}
        >
        ❤️ Favorites
    </button>
      {/* 搜索区 */}
      <div style={{ marginBottom: "20px" }}>
        <input
          placeholder="Search movies..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch()
          }}
        />

        <button onClick={handleSearch}>Search</button>
      </div>

      {/* loading */}
      {loading && (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: "10px",
    }}
  >
    {Array.from({ length: 8 }).map((_, i) => (
      <div
        key={i}
        style={{
          height: "550px",
          background: "#222",
          borderRadius: "10px",
          animation: "pulse 1.2s infinite",
        }}
      />
    ))}
  </div>
)}

      {/* 空状态 */}
      {!loading && movies.length === 0 && <p>No movies found</p>}

      {/* 电影网格 */}
      {!loading && movies.length > 0 && (
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
              onClick={() => navigate(`/movie/${movie.id}`)}
              style={{
                position: "relative",
                cursor: "pointer",
                borderRadius: "10px",
                overflow: "hidden",
                background: "#111",
                color: "#fff",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)"
                e.currentTarget.style.boxShadow =
                  "0 10px 20px rgba(0,0,0,0.3)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)"
                e.currentTarget.style.boxShadow = "none"
              }}
            >
              {/* 海报 */}
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
                    background: "#333",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  No Poster
                </div>
              )}

              {/* 信息区 */}
              <div style={{ padding: "10px" }}>
                
                {/* ❤️ 收藏按钮（关键修复点） */}
                {/* ❤️ 收藏按钮（更明显版本） */}
        <button
        onClick={(e) => {
            e.stopPropagation()
            toggleFavorite(movie.id)
        }}
        style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            border: "none",
            background: "rgba(0,0,0,0.6)",
            color: favorites.includes(Number(movie.id)) ? "red" : "white",
            fontSize: "18px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "transform 0.2s ease",
        }}
        onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.15)"
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)"
        }}
        >
        ❤️
        </button>

                <h3
                  style={{
                    fontSize: "14px",
                    margin: 0,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {movie.title}
                </h3>

                <p
                  style={{
                    margin: "5px 0 0",
                    fontSize: "12px",
                    color: "#aaa",
                  }}
                >
                  ⭐ {movie.vote_average}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}